# Architecture Design: AWS Deployment for ryokosuge.com

**Date**: 2025-10-09
**Feature**: Hugo静的サイトのAWSホスティング
**Target**: 月額$1-5予算でのフルマネージドデプロイ

## システムアーキテクチャ概要

```
┌─────────────────┐
│  Visitor        │
│  (Browser)      │
└────────┬────────┘
         │ HTTPS
         ↓
┌─────────────────────────────────────────┐
│  Route53                                │
│  DNS: ryokosuge.com                     │
│  → Alias to CloudFront                  │
└────────┬────────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────────┐
│  CloudFront Distribution                │
│  - CDN (Edge Locations)                 │
│  - HTTPS Termination                    │
│  - ACM Certificate                      │
│  - Cache Control                        │
└────────┬────────────────────────────────┘
         │ Origin Fetch
         ↓
┌─────────────────────────────────────────┐
│  S3 Bucket (Origin)                     │
│  - Static Files Storage                 │
│  - Versioning Enabled                   │
│  - OAI (Origin Access Identity) Only    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  GitHub Repository                       │
│  ryokosuge/ryokosuge.com                │
└────────┬────────────────────────────────┘
         │ Push to main
         ↓
┌─────────────────────────────────────────┐
│  GitHub Actions                          │
│  1. Hugo Build                           │
│  2. OIDC Auth to AWS                     │
│  3. S3 Sync                              │
│  4. CloudFront Invalidation              │
└────────┬────────────────────────────────┘
         │ Assumes
         ↓
┌─────────────────────────────────────────┐
│  AWS IAM Role (OIDC)                     │
│  - S3 Write Permission                   │
│  - CloudFront Invalidate Permission      │
│  - Trust GitHub OIDC Provider            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  CloudWatch + SNS                        │
│  - 5xxErrorRate Metric                   │
│  - Alarm (threshold 10%)                 │
│  - Email Notification                    │
└─────────────────────────────────────────┘
```

## コンポーネント詳細設計

### 1. S3 Bucket（静的ファイルストレージ）

**役割**: Hugoビルド成果物（HTML/CSS/JS/画像）の保存

**設定仕様**:
```yaml
Bucket名: ryokosuge-com-static (グローバルユニーク名)
リージョン: us-east-1 (CloudFront用証明書はus-east-1必須)
バージョニング: 有効 (デプロイ履歴保持、ロールバック可能)
パブリックアクセス: すべてブロック (CloudFront OAI経由のみ許可)
暗号化: AES-256 (デフォルト、無料)
ライフサイクルルール:
  - 非現行バージョンを30日後に削除（ストレージコスト削減）
```

**IAMポリシー（Bucket Policy）**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontOAI",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${OAI_ID}"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::ryokosuge-com-static/*"
    }
  ]
}
```

### 2. CloudFront Distribution（CDN）

**役割**: グローバルエッジでのコンテンツ配信、HTTPS終端

**設定仕様**:
```yaml
Origin:
  - DomainName: ryokosuge-com-static.s3.us-east-1.amazonaws.com
  - OriginAccessIdentity: ${OAI_ID}
  - OriginProtocolPolicy: https-only

DefaultCacheBehavior:
  ViewerProtocolPolicy: redirect-to-https
  AllowedMethods: [GET, HEAD, OPTIONS]
  CachedMethods: [GET, HEAD]
  Compress: true (自動gzip圧縮)
  MinTTL: 0
  DefaultTTL: 86400 (1日)
  MaxTTL: 31536000 (1年)
  ForwardedValues:
    QueryString: false
    Cookies: none

CustomErrorResponses:
  - ErrorCode: 404
    ResponsePagePath: /404.html
    ResponseCode: 404
    ErrorCachingMinTTL: 300

Aliases: [ryokosuge.com, www.ryokosuge.com]
ViewerCertificate:
  ACMCertificateArn: ${ACM_CERT_ARN}
  SSLSupportMethod: sni-only
  MinimumProtocolVersion: TLSv1.2_2021

PriceClass: PriceClass_100 (北米・ヨーロッパのみ、コスト削減)
HttpVersion: http2and3
Logging:
  Enabled: false (コスト削減、必要なし)
```

**キャッシュ戦略**:
- HTML: 1日TTL（コンテンツ更新頻度を考慮）
- CSS/JS（ハッシュ付き）: 1年TTL（不変リソース）
- 画像: 1週間TTL（変更頻度低）
- Invalidation: デプロイ時に`/*`で全キャッシュクリア

### 3. Route53（DNS）

**役割**: ryokosuge.comのDNS管理

**設定仕様**:
```yaml
HostedZone:
  Name: ryokosuge.com
  Type: Public

RecordSets:
  - Name: ryokosuge.com
    Type: A
    AliasTarget:
      HostedZoneId: Z2FDTNDATAQYW2 (CloudFrontの固定ゾーンID)
      DNSName: ${CLOUDFRONT_DOMAIN}
      EvaluateTargetHealth: false

  - Name: www.ryokosuge.com
    Type: A
    AliasTarget:
      HostedZoneId: Z2FDTNDATAQYW2
      DNSName: ${CLOUDFRONT_DOMAIN}
      EvaluateTargetHealth: false

  - Name: ryokosuge.com
    Type: AAAA (IPv6サポート)
    AliasTarget:
      HostedZoneId: Z2FDTNDATAQYW2
      DNSName: ${CLOUDFRONT_DOMAIN}
      EvaluateTargetHealth: false
```

**コスト**: $0.50/月（ホストゾーン固定費）

### 4. ACM Certificate（SSL/TLS証明書）

**役割**: HTTPS通信の暗号化

**設定仕様**:
```yaml
DomainName: ryokosuge.com
SubjectAlternativeNames: [www.ryokosuge.com]
ValidationMethod: DNS
Region: us-east-1 (CloudFront用証明書は必ずus-east-1)
```

**自動更新フロー**:
1. 証明書発行時にRoute53にCNAME検証レコード自動追加
2. ACMが11ヶ月後に自動更新開始
3. DNS検証レコードが存在する限り、永続的に自動更新
4. 証明書ARN不変（CloudFront設定変更不要）

### 5. IAM Role (GitHub Actions用)

**役割**: GitHub ActionsからのOIDC認証

**設定仕様**:
```yaml
RoleName: github-actions-deploy-ryokosuge-com

TrustPolicy:
  Version: "2012-10-17"
  Statement:
    - Effect: Allow
      Principal:
        Federated: arn:aws:iam::${AWS_ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com
      Action: sts:AssumeRoleWithWebIdentity
      Condition:
        StringEquals:
          token.actions.githubusercontent.com:aud: sts.amazonaws.com
        StringLike:
          token.actions.githubusercontent.com:sub: "repo:ryokosuge/ryokosuge.com:ref:refs/heads/main"

AttachedPolicies:
  - PolicyName: DeployToS3AndInvalidateCloudFront
    PolicyDocument:
      Version: "2012-10-17"
      Statement:
        - Effect: Allow
          Action:
            - s3:PutObject
            - s3:PutObjectAcl
            - s3:GetObject
            - s3:ListBucket
            - s3:DeleteObject
          Resource:
            - arn:aws:s3:::ryokosuge-com-static
            - arn:aws:s3:::ryokosuge-com-static/*

        - Effect: Allow
          Action:
            - cloudfront:CreateInvalidation
          Resource:
            - arn:aws:cloudfront::${AWS_ACCOUNT_ID}:distribution/${DISTRIBUTION_ID}
```

### 6. CloudWatch Alarm + SNS（監視・アラート）

**役割**: サイトダウン時の通知

**設定仕様**:
```yaml
SNSTopic:
  Name: ryokosuge-com-alerts
  Subscription:
    - Protocol: email
      Endpoint: ${OWNER_EMAIL}

CloudWatchAlarm:
  AlarmName: ryokosuge-com-high-error-rate
  MetricName: 5xxErrorRate
  Namespace: AWS/CloudFront
  Dimensions:
    - Name: DistributionId
      Value: ${DISTRIBUTION_ID}
  Statistic: Average
  Period: 300 (5分)
  EvaluationPeriods: 1
  Threshold: 10.0 (10%以上のエラー率)
  ComparisonOperator: GreaterThanThreshold
  AlarmActions:
    - arn:aws:sns:us-east-1:${AWS_ACCOUNT_ID}:ryokosuge-com-alerts
  TreatMissingData: notBreaching
```

**アラート条件**:
- 5分間の5XXエラー率が10%を超えた場合
- メール通知送信
- 復旧時にもメール通知（OK状態への遷移）

## デプロイフロー詳細

### GitHub Actionsワークフロー

**ファイル**: `.github/workflows/deploy.yml`

**トリガー**: mainブランチへのpush

**ステップ**:
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
          role-to-assume: arn:aws:iam::${AWS_ACCOUNT_ID}:role/github-actions-deploy-ryokosuge-com
          aws-region: us-east-1

      - name: Sync to S3
        run: |
          aws s3 sync public/ s3://ryokosuge-com-static/ \
            --delete \
            --cache-control "public, max-age=86400"

      - name: Invalidate CloudFront Cache
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${DISTRIBUTION_ID} \
            --paths "/*"
```

**想定実行時間**: 2-3分（Hugo build 30秒 + S3 sync 1-2分）

**GitHub Secrets**:
- `AWS_ACCOUNT_ID`: AWSアカウントID
- `CLOUDFRONT_DISTRIBUTION_ID`: CloudFrontディストリビューションID

## セキュリティ設計

### 多層防御:
1. **S3**: パブリックアクセス完全ブロック、CloudFront OAIのみ許可
2. **CloudFront**: HTTPS強制、HTTP→HTTPSリダイレクト、TLS1.2以上
3. **IAM**: 最小権限の原則（S3 syncとCloudFront invalidationのみ）
4. **OIDC**: 一時認証情報、特定リポジトリ・ブランチのみ許可
5. **Route53**: DNSSEC未対応（追加コスト$0.50/月、優先度低）

### 監査:
- **CloudTrail**: IAMロール使用履歴の追跡（無料枠内）
- **S3アクセスログ**: 無効（コスト削減、必要性低）
- **CloudFrontアクセスログ**: 無効（コスト削減、必要性低）

## パフォーマンス設計

### 目標:
- **ページロード**: 3秒以内（日本からのアクセス）
- **TTI (Time to Interactive)**: 4秒以内

### 最適化手法:
1. **CloudFront CDN**: エッジでのコンテンツ配信（レイテンシ削減）
2. **Gzip圧縮**: CloudFront自動圧縮（テキストファイル70%削減）
3. **Hugo minify**: HTML/CSS/JS最小化
4. **キャッシュ戦略**: 長期キャッシュで繰り返しアクセスの高速化
5. **HTTP/2**: 多重化によるパフォーマンス向上

### 制約:
- **PriceClass_100**: アジアエッジなし（日本からのアクセスは北米経由）
  - トレードオフ: コスト削減優先（$1-2/月削減）
  - 影響: 初回アクセスのみ200-300ms追加レイテンシ

## コスト試算

### 月間想定:
- **訪問数**: 10,000
- **ページビュー**: 15,000（1訪問あたり1.5ページ）
- **データ転送**: 約10GB（1ページ700KB想定）

### 詳細コスト:
| サービス | 項目 | 単価 | 使用量 | 月額 |
|---------|------|------|--------|------|
| Route53 | ホストゾーン | $0.50/月 | 1 | $0.50 |
| Route53 | クエリ | $0.40/100万 | 0.1百万 | $0.04 |
| S3 | ストレージ | $0.023/GB | 0.5GB | $0.01 |
| S3 | PUT/COPY | $0.005/1000 | 100 | $0.00 |
| CloudFront | データ転送 | $0.085/GB | 10GB | $0.85 |
| CloudFront | HTTPSリクエスト | $0.01/10,000 | 15,000 | $0.02 |
| CloudWatch | Alarm | $0.10/個 | 1個（無料） | $0.00 |
| SNS | 通知 | $0.50/100万 | 10通 | $0.00 |
| ACM | 証明書 | 無料 | 1 | $0.00 |
| **合計** | | | | **$1.42** |

**予算範囲**: $1-5/月の下限に余裕で収まる ✅

## 災害復旧・バックアップ

### バックアップ戦略:
1. **Gitリポジトリ**: ソースコードの完全バックアップ
2. **S3バージョニング**: デプロイ履歴30日間保持
3. **Hugo再ビルド**: 任意のコミットから即座に再構築可能

### 復旧手順:
1. **S3データ損失**: Gitから再ビルド＆デプロイ（5分）
2. **CloudFront障害**: AWS自動フェイルオーバー（ユーザー操作不要）
3. **Route53障害**: AWS自動フェイルオーバー（ユーザー操作不要）
4. **ロールバック**: S3バージョニングから旧バージョン復元、または前コミットから再デプロイ

### RPO/RTO:
- **RPO (Recovery Point Objective)**: 0秒（Gitコミット単位）
- **RTO (Recovery Time Objective)**: 5分（手動再デプロイ）

## 今後の拡張可能性

### トラフィック増加時:
- 月間100,000訪問まで: 現構成で対応可能（$5-10/月）
- それ以上: PriceClassの見直し、Savings Planの検討

### 機能追加の余地:
- **プレビュー環境**: 別S3バケット＋CloudFront（developブランチ用）
- **詳細監視**: X-Rayトレーシング、カスタムメトリクス（追加コスト発生）
- **WAF**: DDoS対策、ボット対策（$5/月〜、現時点では不要）

## 次のステップ

1. **Terraformコード作成**（別リポジトリで実施）
2. **GitHub Actionsワークフロー作成**（このリポジトリ）
3. **動作検証**
4. **本番デプロイ**
