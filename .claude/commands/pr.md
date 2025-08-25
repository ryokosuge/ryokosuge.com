---
description: Pull Request作成をサポートするコマンド
---

Pull Request作成手順のファイルを確認しました！

## pull request作成手順

### 差分の確認

- {{マージ先ブランチ}}に関する指定がない場合は、どのブランチに対してPullRequestを作成するか必ず聞き返してください。
- `git diff origin/{{マージ先ブランチ}}...HEAD | cat` でマージ先ブランチとの差分を確認

### Pull Request 作成とブラウザでの表示

- 以下のコマンドで pull request を作成し、自動的にブラウザで開く
- PR タイトルおよび PR テンプレートはマージ先との差分をもとに適切な内容にする
- 指示がない限り Draft で pull request を作成
- PR の本文は `pr_body.txt` を作成し、そのファイルの中に書いてください
  - PRのテンプレートは以下の通りにします

```
## 概要

(ここでは、PR の概要を記載します。)

## 詳細

(ここでは、PR の詳細を記載します。)

## 参考

(ここでは、PRの参考情報があれば記載します。)

```

- 以下のbashスクリプトでPull Requestを作成してください
  - draftにしないでください

--- bash
# PRの作成
git push origin HEAD && \
gh pr create --title "{{PRタイトル}}" --body-file pr_body.txt --assignee @me && \
gh pr view --web
---

- Pull Requestの作成が完了した後、 `pr_body.txt` を削除してください