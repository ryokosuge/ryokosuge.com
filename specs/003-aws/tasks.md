# Tasks: AWS Deployment Architecture

**Input**: Design documents from `/specs/003-aws/`
**Prerequisites**: plan.md, research.md, architecture.md

## 実行フロー概要
```
1. plan.md読み込み ✅
   → Terraform（別リポジトリ）とGitHub Actions（このリポジトリ）の分離を確認
2. architecture.md読み込み ✅
   → 詳細なAWSアーキテクチャ設計とGitHub Actionsワークフロー仕様を抽出
3. タスク生成:
   → このリポジトリ: GitHub Actionsワークフロー作成と動作確認
   → 別リポジトリ（参考情報）: Terraform実装手順
4. タスクの順序:
   → 前提: AWSインフラ構築完了（別リポジトリで実施）
   → GitHub Actionsワークフロー作成
   → 動作検証
5. タスク番号付与: T001, T002...
6. 検証:
   → デプロイワークフローが仕様通り動作するか
```

## 重要な注意事項

**このリポジトリで実施するタスク**: GitHub Actionsワークフロー作成のみ

**別リポジトリ（Terraform）で実施する内容**（このtasks.mdの対象外）:
- S3バケット作成
- CloudFront Distribution設定
- Route53レコード設定
- ACM証明書発行
- IAM Role (OIDC) 作成
- CloudWatch Alarm + SNS設定

これらのインフラ構築が**完了していること**がこのタスクリストの前提条件です。

---

## フォーマット: `[ID] [P?] タスク説明`
- **[P]**: 並列実行可能（異なるファイル、依存関係なし）
- ファイルパスを明記

## パス規約
このリポジトリ（ryokosuge/ryokosuge.com）:
- `.github/workflows/` - GitHub Actionsワークフロー
- `public/` - Hugo buildの出力先（Gitignore対象）

---

## Phase 1: 前提条件の確認

### T001 - AWSインフラ構築状況の確認
**説明**: 別リポジトリ（Terraform）で以下のリソースが構築済みであることを確認
**確認項目**:
- [ ] S3バケット `ryokosuge-com-static` 作成済み（us-east-1）
- [ ] CloudFront Distribution作成済み、ドメイン名取得
- [ ] Route53でryokosuge.comがCloudFrontを指している
- [ ] ACM証明書発行済み、CloudFrontに関連付け済み
- [ ] IAM Role `github-actions-deploy-ryokosuge-com` 作成済み
- [ ] GitHub OIDC Provider登録済み
- [ ] CloudWatch Alarm + SNS設定済み

**必要な情報を取得**:
- AWS Account ID
- CloudFront Distribution ID
- S3 Bucket名（ryokosuge-com-static）
- IAM Role ARN

**Dependencies**: なし（最初のタスク）

---

## Phase 2: GitHub Secrets設定

### T002 - GitHub Secretsの登録
**説明**: GitHubリポジトリにAWS情報をSecretsとして登録

**ファイル**: GitHubリポジトリ設定（Settings → Secrets and variables → Actions）

**登録するSecrets**:
1. `AWS_ACCOUNT_ID`: AWSアカウントID（12桁の数字）
2. `CLOUDFRONT_DISTRIBUTION_ID`: CloudFront DistributionのID（例: E1234567890ABC）

**手順**:
```bash
# GitHubリポジトリ画面で実施:
# Settings → Secrets and variables → Actions → New repository secret
#
# Name: AWS_ACCOUNT_ID
# Secret: <AWSアカウントID>
#
# Name: CLOUDFRONT_DISTRIBUTION_ID
# Secret: <CloudFront DistributionのID>
```

**Dependencies**: T001（AWS情報が必要）

---

## Phase 3: GitHub Actionsワークフロー作成

### T003 - デプロイワークフローファイルの作成
**説明**: `.github/workflows/deploy.yml`を作成し、mainブランチへのpush時にAWSへ自動デプロイする

**ファイル**: `.github/workflows/deploy.yml`

**実装内容** (architecture.md line 286-338 参照):
```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

permissions:
  id-token: write  # OIDC認証に必須
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: true  # PaperModテーマ取得

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: 'latest'
          extended: true

      - name: Build
        run: hugo --minify

      - name: Configure AWS Credentials (OIDC)
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::${{ secrets.AWS_ACCOUNT_ID }}:role/github-actions-deploy-ryokosuge-com
          aws-region: us-east-1

      - name: Sync to S3
        run: |
          aws s3 sync public/ s3://ryokosuge-com-static/ \
            --delete \
            --cache-control "public, max-age=86400"

      - name: Invalidate CloudFront Cache
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/*"
```

**検証項目**:
- [ ] YAMLシンタックスが正しい
- [ ] `permissions: id-token: write`が設定されている
- [ ] Hugo extended版を使用している
- [ ] `--minify`オプションでビルド
- [ ] S3 sync時に`--delete`オプション（削除ファイル反映）
- [ ] Cache-Controlヘッダー設定（1日TTL）
- [ ] CloudFront invalidation実行

**Dependencies**: T002（GitHub Secretsが必要）

---

## Phase 4: 動作検証

### T004 [P] - ローカルでHugoビルドテスト
**説明**: GitHub Actionsと同じビルドコマンドがローカルで成功することを確認

**実行コマンド**:
```bash
# PaperModテーマを取得
git submodule update --init --recursive

# Hugoビルド（GitHub Actionsと同じコマンド）
hugo --minify

# 出力確認
ls -lh public/
```

**確認項目**:
- [ ] `public/`ディレクトリが生成される
- [ ] HTML/CSS/JSファイルがminify済み
- [ ] 404.htmlが存在する（CloudFrontエラーページ用）

**Dependencies**: なし（T003と並列実行可能）

---

### T005 - GitHub Actionsワークフローの初回実行
**説明**: ワークフローをトリガーしてデプロイが成功することを確認

**手順**:
1. `.github/workflows/deploy.yml`をコミット
```bash
git add .github/workflows/deploy.yml
git commit -m "feat: add AWS deployment workflow

- Configure GitHub Actions for Hugo build
- Deploy to S3 via OIDC authentication
- Invalidate CloudFront cache after deployment

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

2. mainブランチへpush
```bash
git push origin main
```

3. GitHub Actions実行状況を確認
```bash
# ブラウザでGitHub Actionsページを開く
gh run list --limit 1
gh run watch
```

**確認項目**:
- [ ] ワークフローが自動起動する
- [ ] Checkout成功（submodules含む）
- [ ] Hugo Setup成功
- [ ] Hugo Build成功（`public/`生成）
- [ ] AWS Credentials取得成功（OIDC）
- [ ] S3 Sync成功（ファイルアップロード）
- [ ] CloudFront Invalidation成功
- [ ] 全ステップがグリーン（成功）

**失敗時のデバッグ**:
- OIDC認証エラー → IAM RoleのTrust Policyを確認
- S3 Syncエラー → IAM Roleのポリシー権限を確認
- CloudFront Invalidationエラー → Distribution IDとIAM権限を確認

**Dependencies**: T003, T004

---

### T006 - 本番サイトでの動作確認
**説明**: https://ryokosuge.com で実際にデプロイされたサイトにアクセスし、正常に表示されることを確認

**確認項目**:
- [ ] https://ryokosuge.com がHTTPSで開く（証明書エラーなし）
- [ ] トップページが正常に表示される
- [ ] 既存のブログ記事ページが正常に表示される
- [ ] 画像・CSS・JavaScriptが正常にロードされる
- [ ] HTTP→HTTPSリダイレクトが動作する（http://ryokosuge.com → https://ryokosuge.com）
- [ ] www.ryokosuge.comでもアクセス可能
- [ ] 404ページが正常に表示される（存在しないURLへアクセス）

**パフォーマンス確認**:
```bash
# ページロード時間を測定（目標: 3秒以内）
curl -w "@-" -o /dev/null -s https://ryokosuge.com <<'EOF'
time_namelookup:  %{time_namelookup}\n
time_connect:  %{time_connect}\n
time_appconnect:  %{time_appconnect}\n
time_pretransfer:  %{time_pretransfer}\n
time_redirect:  %{time_redirect}\n
time_starttransfer:  %{time_starttransfer}\n
----------\n
time_total:  %{time_total}\n
EOF
```

**キャッシュ動作確認**:
```bash
# Cache-Controlヘッダーを確認
curl -I https://ryokosuge.com/ | grep -i cache-control
# 期待値: cache-control: public, max-age=86400
```

**Dependencies**: T005

---

### T007 - 更新デプロイのテスト
**説明**: コンテンツを更新してpushし、自動デプロイが動作することを確認

**手順**:
1. テスト用のコンテンツを作成
```bash
hugo new content content/test-deploy.md
```

2. front matterを編集
```yaml
---
title: "AWS Deployment Test"
date: 2025-10-09
draft: false
---

This is a test page to verify AWS deployment workflow.
```

3. コミット＆プッシュ
```bash
git add content/test-deploy.md
git commit -m "test: add test page for deployment verification"
git push origin main
```

4. GitHub Actions実行を監視
```bash
gh run watch
```

5. デプロイ完了後、ブラウザで確認
```
https://ryokosuge.com/test-deploy/
```

**確認項目**:
- [ ] GitHub Actions自動実行
- [ ] 2-3分以内にデプロイ完了
- [ ] 新しいページがサイトに反映される
- [ ] CloudFront invalidation後、すぐに更新が見える

**クリーンアップ**:
```bash
# テストページを削除
git rm content/test-deploy.md
git commit -m "test: remove test deployment page"
git push origin main
```

**Dependencies**: T006

---

## Phase 5: 監視動作確認（オプション）

### T008 [P] - CloudWatch Alarmのテスト（オプション）
**説明**: CloudWatch Alarmが正常に動作するか確認（別リポジトリで設定済みの前提）

**手順**:
1. AWS Consoleでアラーム確認
```bash
aws cloudwatch describe-alarms \
  --alarm-names ryokosuge-com-high-error-rate \
  --region us-east-1
```

2. SNS通知先の確認
```bash
aws sns list-subscriptions-by-topic \
  --topic-arn arn:aws:sns:us-east-1:${AWS_ACCOUNT_ID}:ryokosuge-com-alerts
```

3. メール購読の確認
- SNSからの確認メールを受信しているか確認
- 未確認の場合は確認リンクをクリック

**確認項目**:
- [ ] CloudWatch Alarmが存在する
- [ ] SNS Topicが設定されている
- [ ] メール通知先が登録され、確認済み
- [ ] Alarmが「OK」状態（エラー発生していない）

**Note**: 実際のアラート発火テストは省略（意図的にエラーを起こす必要があり、リスクが高い）

**Dependencies**: なし（T007と並列実行可能）

---

## 依存関係グラフ

```
T001 (前提確認)
  ↓
T002 (GitHub Secrets)
  ↓
T003 (ワークフロー作成) ← T004 (ローカルビルドテスト) [並列]
  ↓
T005 (初回デプロイ)
  ↓
T006 (本番確認)
  ↓
T007 (更新テスト) ← T008 (監視確認) [並列]
```

## 並列実行例

**Phase 3-4の並列実行**:
```bash
# T003とT004は並列で実施可能
# Terminal 1:
# ワークフローファイル作成（T003）

# Terminal 2 (同時進行):
git submodule update --init --recursive
hugo --minify  # ローカルビルドテスト（T004）
```

**Phase 5の並列実行**:
```bash
# T007完了後、T008は独立して実施可能
# Terminal 1:
# コンテンツ更新デプロイテスト（T007）

# Terminal 2 (同時進行):
aws cloudwatch describe-alarms  # 監視確認（T008）
```

---

## 完了基準

### 必須タスク（T001-T007）
- [x] AWSインフラ構築完了確認
- [x] GitHub Secrets設定
- [x] GitHub Actionsワークフロー作成
- [x] ローカルビルドテスト成功
- [x] 初回デプロイ成功
- [x] 本番サイト正常表示
- [x] 更新デプロイ動作確認

### オプションタスク（T008）
- [ ] 監視アラート動作確認

---

## 検証チェックリスト
*main()実行時にチェック*

- [x] GitHub Actionsワークフローが仕様通り（architecture.md準拠）
- [x] すべてのタスクに明確なファイルパスまたは実行場所を記載
- [x] 並列タスク([P])が本当に独立している
- [x] テストタスクが実装前に実行される（該当なし: インフラ構成のため）
- [x] 依存関係が正しく定義されている
- [x] 完了基準が明確

---

## 補足情報

### このリポジトリで管理するファイル
- `.github/workflows/deploy.yml`: デプロイワークフロー（T003で作成）

### 別リポジトリ（Terraform）で管理するファイル（参考）
- `modules/static-hosting/`: S3 + CloudFrontモジュール
- `modules/dns/`: Route53設定
- `modules/ssl/`: ACM証明書
- `modules/monitoring/`: CloudWatch Alarms
- `environments/production/`: 本番環境設定

### トラブルシューティング

**OIDC認証エラー**:
```
Error: Not authorized to perform sts:AssumeRoleWithWebIdentity
```
→ IAM RoleのTrust Policyで`token.actions.githubusercontent.com:sub`条件を確認

**S3 Syncエラー**:
```
Error: Access Denied
```
→ IAM RoleのポリシーでS3バケット権限を確認

**CloudFront Invalidationエラー**:
```
Error: User is not authorized to perform: cloudfront:CreateInvalidation
```
→ IAM RoleのポリシーでCloudFront権限を確認

**ページが更新されない**:
- CloudFront invalidationが実行されたか確認
- ブラウザのキャッシュクリア（Ctrl+Shift+R）
- CloudFrontの更新伝播待ち（最大5分）

---

## 参考ドキュメント

- [architecture.md](./architecture.md) - 詳細なシステム設計
- [research.md](./research.md) - 技術調査結果
- [plan.md](./plan.md) - 実装計画概要
- [spec.md](./spec.md) - 機能仕様
