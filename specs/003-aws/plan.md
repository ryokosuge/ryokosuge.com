# Implementation Plan: AWS Deployment Architecture

**Branch**: `003-aws` | **Date**: 2025-10-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-aws/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path ✅
2. Fill Technical Context ✅
   → Project Type: Infrastructure/Deployment (static site hosting)
   → Structure Decision: Infrastructure-as-Code (managed in separate Terraform repo)
3. Fill Constitution Check section ✅
4. Evaluate Constitution Check section ✅
   → No violations - deployment follows Git-based workflow
5. Execute Phase 0 → research.md ✅
6. Execute Phase 1 → architecture design, infrastructure requirements ✅
7. Re-evaluate Constitution Check ✅
   → PASS - design complies with all principles
8. Plan Phase 2 → Document configuration steps (no tasks.md needed)
9. STOP - Ready for Terraform implementation in separate repo
```

## Summary
AWS上でHugo静的サイト（ryokosuge.com）を月額$1-5の予算内でホスティングする構成を設計します。GitHub pushによる自動デプロイ（CI/CD）、HTTPS対応、基本的な監視機能を提供します。月間1,000-10,000訪問の小規模個人ブログ向けにコスト最適化された構成です。

## Technical Context
**インフラストラクチャ管理**: Terraform (別リポジトリで管理)
**静的サイトジェネレーター**: Hugo (既存)
**CI/CDツール**: GitHub Actions
**AWSサービス候補**: S3, CloudFront, Route53, Certificate Manager, CloudWatch
**デプロイ元**: GitHub repository (ryokosuge/ryokosuge.com)
**ターゲットドメイン**: ryokosuge.com (既存)
**予算制約**: 月額$1-5 USD
**トラフィック想定**: 月間1,000-10,000訪問
**監視要件**: 基本的なアップタイム監視（ダウンタイム通知のみ）
**パフォーマンス目標**: ページロード3秒以内
**可用性目標**: 99%アップタイム

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### IV. Git-Based Publishing
✅ **PASS**: GitHub mainブランチへのpushをトリガーとした自動デプロイ
- デプロイワークフローはGitHub Actionsで管理
- インフラ構成はTerraformでバージョン管理（別リポジトリ）
- すべての変更履歴が追跡可能

### V. Local Development First
✅ **PASS**: Hugo開発サーバーでローカルプレビュー
- 既存の `make server` / `hugo server -D` ワークフローを継続使用
- AWSデプロイはローカル検証後のみ実行

### その他の原則
✅ **PASS**: コンテンツ作成ワークフロー（I, II, III）は既存のまま維持
✅ **PASS**: 日本語コミュニケーション（VI）は設計フェーズで遵守

**結論**: すべての憲法原則に準拠。インフラ変更はコンテンツワークフローに影響を与えません。

## Project Structure

### Documentation (this feature)
```
specs/003-aws/
├── spec.md              # Feature specification
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0: AWS service selection research
└── architecture.md      # Phase 1: Architecture design & service diagram
```

### Infrastructure Code (separate Terraform repository)
```
terraform/
├── modules/
│   ├── static-hosting/  # S3 + CloudFront module
│   ├── dns/             # Route53 configuration
│   ├── ssl/             # ACM certificate management
│   └── monitoring/      # CloudWatch alarms
├── environments/
│   └── production/      # ryokosuge.com production config
└── README.md            # Terraform usage documentation
```

### CI/CD Configuration (this repository)
```
.github/
└── workflows/
    └── deploy.yml       # GitHub Actions workflow for Hugo build & S3 sync
```

**Structure Decision**:
- インフラコード（Terraform）は別リポジトリで管理
- このリポジトリではデプロイワークフロー（GitHub Actions）のみ追加
- 既存のHugoプロジェクト構造は変更なし

## Phase 0: Outline & Research

### 研究課題
1. **月額$1-5予算内でのAWSサービス選定**
   - S3 静的ホスティングのコスト試算
   - CloudFront無料枠の活用可能性
   - Route53の月額コスト
   - 代替案としてのAmplify Hostingの評価

2. **自動SSL証明書管理**
   - AWS Certificate Manager (ACM) の無料証明書
   - 自動更新の仕組み

3. **GitHub ActionsからAWSへのデプロイ方法**
   - IAM認証のベストプラクティス
   - OIDC vs アクセスキーの比較
   - S3 syncコマンドの最適化

4. **基本監視の実装方法**
   - CloudWatch Alarmsの無料枠
   - Route53 Health Checksのコスト
   - サードパーティ無料監視サービスの検討

**Output**: research.md (次ステップで作成)

## Phase 1: Design & Contracts

### 成果物
1. **architecture.md**: AWSアーキテクチャ図と各サービスの役割
2. **インフラ要件定義**: Terraformモジュールの設計仕様
3. **デプロイワークフロー定義**: GitHub Actionsの実装仕様
4. **監視設定仕様**: アラート条件とエスカレーション設定

### データモデル
このフィーチャーはインフラ構成のため、アプリケーションレベルのデータモデルは不要です。
代わりに、以下のインフラリソースを定義します：

- **S3 Bucket**: 静的ファイル保存（バージョニング、ライフサイクルポリシー）
- **CloudFront Distribution**: CDN設定（キャッシュ動作、HTTPS強制）
- **Route53 Record**: DNS設定（Aレコード、エイリアス）
- **ACM Certificate**: SSL証明書（ドメイン検証、自動更新）
- **CloudWatch Alarm**: 監視アラート（エラー率閾値、通知先）

### API Contracts
このフィーチャーはインフラ構成のため、API contractsは不要です。
代わりに、以下のインターフェースを定義します：

- **GitHub Actions → AWS**: デプロイワークフローのインターフェース
- **CloudWatch → 通知先**: アラート通知のインターフェース

## Phase 2: Configuration Approach
*This section describes the configuration steps - NOT executed during /plan*

### Terraform構成手順（別リポジトリで実施）
1. S3バケット作成とウェブホスティング設定
2. CloudFront distributionの構成
3. Route53でのドメイン設定
4. ACM証明書の発行とCloudFrontへの関連付け
5. CloudWatch alarmsの設定

### GitHub Actions設定手順（このリポジトリで実施）
1. `.github/workflows/deploy.yml` の作成
2. AWS認証情報のシークレット設定
3. Hugo buildとS3 syncのワークフロー定義

### 検証手順
1. Terraformでインフラ構築
2. 手動でテストHTMLファイルをアップロード
3. https://ryokosuge.com でアクセス確認
4. GitHub Actionsワークフローのテスト実行
5. 監視アラートの動作確認

**Note**: 詳細な手順書はarchitecture.mdに記載します。

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Terraform実装（別リポジトリで実施）
**Phase 4**: GitHub Actionsワークフロー実装（このリポジトリで実施）
**Phase 5**: 動作検証とモニタリング確認

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

該当なし - すべての憲法原則に準拠しています。

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command) - research.md作成完了
- [x] Phase 1: Design complete (/plan command) - architecture.md作成完了
- [x] Phase 2: Task planning complete (/tasks command) - tasks.md作成完了
- [ ] Phase 3: Terraform implementation (別リポジトリ)
- [ ] Phase 4: GitHub Actions implementation (このリポジトリ) - tasks.md参照
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All research questions resolved
- [x] Complexity deviations documented (なし)

**Generated Artifacts**:
- ✅ research.md - AWSサービス選定、コスト試算、認証方法の調査結果
- ✅ architecture.md - 詳細なシステムアーキテクチャ、各コンポーネント設計、デプロイフロー
- ✅ tasks.md - GitHub Actionsワークフロー作成タスク（T001-T008、8タスク）

---
*Based on Constitution v1.2.0 - See `.specify/memory/constitution.md`*
