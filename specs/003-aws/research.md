# Research: AWS Deployment Architecture

**Date**: 2025-10-09
**Feature**: AWS上でのHugo静的サイトホスティング（ryokosuge.com）
**Budget Constraint**: 月額$1-5 USD

## 研究課題と結果

### 1. 月額$1-5予算内でのAWSサービス選定

#### 決定: S3 + CloudFront + Route53 + ACM の組み合わせ

#### 根拠:
実際の運用例では、以下のコストでホスティングが可能：
- **月間500訪問、850ページビュー**の実績で**平均月額$0.93**（税抜）
  - Route53ホストゾーン: $0.51/月
  - CloudFront + S3: $0.42/月

本プロジェクトの想定トラフィック（月間1,000-10,000訪問）でも、**月額$2以下**に収まる見込み。

#### コスト内訳:
- **S3ストレージ**: ほぼ無料（小規模静的サイトは数MB程度）
- **CloudFront**:
  - データ転送: 低トラフィックならほぼ無料（無料枠: 月間1TB）
  - リクエスト: 月間10,000訪問でも無料枠内
  - S3からのオリジン取得: 無料
- **Route53**: $0.50/月（ホストゾーン固定費）
- **ACM**: 完全無料（CloudFrontと統合時）

#### 代替案の評価:
- **AWS Amplify Hosting**: 月額$0.15/GB（ビルド時間課金あり） → CloudFrontより高コスト
- **S3単体（CloudFrontなし）**: HTTPSカスタムドメインに対応不可 → 却下
- **Lightsail**: 最安プランで$3.50/月 → 予算超過の可能性

### 2. 自動SSL証明書管理

#### 決定: AWS Certificate Manager (ACM) を使用

#### 根拠:
- **完全無料**: CloudFront、ELBなどのAWSサービスと統合時
- **自動更新**: DNS検証設定後、証明書有効期限（13ヶ月）の11ヶ月後に自動更新
- **証明書ARN不変**: 更新時もARNが変わらないため、インフラ設定の変更不要
- **メンテナンスフリー**: DNS検証レコードを削除しない限り、永続的に自動更新

#### 要件:
- DNS検証用のCNAMEレコードをRoute53に設定
- CloudFrontディストリビューションに証明書を関連付け
- 証明書が「使用中」状態を維持（CloudFrontに紐付けされていれば自動的に満たす）

#### 代替案の評価:
- **Let's Encrypt**: 無料だが90日ごとの手動更新が必要 → 運用負荷が高い
- **商用SSL証明書**: 年間$10-100のコスト → 予算超過

### 3. GitHub ActionsからAWSへのデプロイ方法

#### 決定: OIDC (OpenID Connect) 認証を使用

#### 根拠:
- **セキュリティベストプラクティス（2025年時点）**:
  - 長期的なアクセスキーをシークレットに保存しない
  - 一時的な認証情報を自動発行（各ワークフロー実行ごと）
  - 漏洩リスクの最小化

- **AWS IAMとの統合**:
  - `id-token: write`パーミッションでGitHub OIDC providerがJWT発行
  - IAMロールのトラストポリシーで厳密なスコープ設定が可能
  - リポジトリ、ブランチ単位でのアクセス制御

- **監査性**:
  - CloudTrailでIAMロール使用履歴を追跡可能
  - どのワークフロー実行がどのAWS操作を行ったか明確

#### 実装要件:
1. AWS側の設定:
   - OIDC Identity Provider作成（URL: `https://token.actions.githubusercontent.com`, Audience: `sts.amazonaws.com`）
   - IAMロール作成（S3 sync権限、CloudFront invalidation権限）
   - トラストポリシーで`token.actions.githubusercontent.com:sub`条件を評価

2. GitHub Actions側の設定:
   - `permissions: id-token: write`を設定
   - `aws-actions/configure-aws-credentials`アクションでOIDC認証
   - `aws s3 sync`でデプロイ、`aws cloudfront create-invalidation`でキャッシュクリア

#### 代替案の評価:
- **IAMアクセスキー**: セキュリティリスク高、2025年のベストプラクティスに反する → 却下
- **GitHub Secrets**: 長期認証情報の保存が必要、ローテーション運用が発生 → OIDC推奨

### 4. 基本監視の実装方法

#### 決定: CloudWatch Alarms（最小構成）

#### 根拠:
- **予算内で実装可能**:
  - CloudWatch Alarms: 最初の10個無料、以降$0.10/アラーム/月
  - CloudWatch メトリクス: 基本メトリクス（5分間隔）は無料

- **監視対象**:
  - CloudFront エラー率（5XXエラー）
  - 閾値: 5分間で10%以上のエラー率
  - アクション: SNS経由でメール通知

- **Route53 Health Checks は使用しない**:
  - $0.50/ヘルスチェック/月 → 予算の大部分を消費
  - CloudFrontのエラーメトリクスで代替可能

#### 実装要件:
1. CloudWatch Alarm作成:
   - メトリクス: `AWS/CloudFront` の `5xxErrorRate`
   - 統計: Average
   - 期間: 5分
   - 閾値: 10%

2. SNS Topic作成:
   - メール通知先を登録
   - アラーム状態変化時に通知

3. コスト試算:
   - CloudWatch Alarm 1個: 無料（10個まで無料枠）
   - SNS通知: 月間1,000通まで無料（十分）

#### 代替案の評価:
- **Route53 Health Checks**: $0.50/月 → コスト高、CloudFrontメトリクスで代替可能 → 却下
- **サードパーティ監視（UptimeRobot等）**: 無料枠あり → 検討可能だが、AWSネイティブ監視を優先
- **詳細監視（1分間隔）**: $2.10/メトリクス/月 → 予算超過リスク → 5分間隔で十分

## 最終推奨構成

### AWSサービス構成:
1. **S3**: 静的ファイルストレージ（オリジン）
2. **CloudFront**: CDN、HTTPS配信
3. **Route53**: DNSホスティング（ryokosuge.com）
4. **ACM**: SSL/TLS証明書（自動更新）
5. **CloudWatch + SNS**: 基本監視とアラート通知

### 予想月額コスト:
- Route53: $0.50
- CloudFront + S3: $0.50-$1.50（トラフィック次第）
- CloudWatch Alarm: $0.00（無料枠内）
- ACM: $0.00（無料）
- **合計: $1.00-$2.00/月**（予算$1-5内に余裕で収まる）

### デプロイフロー:
1. GitHub mainブランチへpush
2. GitHub Actions起動
3. OIDC認証でAWS IAMロール取得
4. Hugo build実行
5. `aws s3 sync`でS3へアップロード
6. CloudFront invalidation実行
7. 5分以内にサイト更新完了

### 監視フロー:
1. CloudFrontで5XXエラー発生
2. 5分間の平均エラー率が10%超過
3. CloudWatch Alarmトリガー
4. SNS経由でメール通知送信
5. サイトオーナーが対応

## 未解決の技術的疑問

なし - すべての研究課題が解決されました。

## 次のステップ

Phase 1: Architecture Design
- アーキテクチャ図の作成
- Terraformモジュール設計
- GitHub Actionsワークフロー詳細設計
- 監視アラート詳細設計
