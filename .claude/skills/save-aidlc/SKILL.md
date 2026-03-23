---
name: save-aidlc
description: Save the current aidlc-docs/ session to .aidlc-saves/ for later restoration
disable-model-invocation: true
---

## Task

現在の `aidlc-docs/` セッションを `.aidlc-saves/` 配下に一時保存し、後で `/restore-aidlc` で復元できるようにする。コンテキストクリアや別作業への切り替え時に使用する。

## Steps

1. `aidlc-docs/` ディレクトリが存在するか確認する。存在しない場合はエラーメッセージを表示して終了する。
2. `aidlc-docs/` の内容からセーブ名を決定する:
   - `aidlc-docs/audit.md` を読み、最初の **User Input** エントリを探す
   - 見つかった場合、そのユーザーリクエストの内容を要約して **英語のkebab-case** で短い名前（2〜4単語）を生成する（例: `add-auth-api`, `refactor-payment-service`）
   - `audit.md` が無い場合やUser Inputが見つからない場合は `aidlc-docs/aidlc-state.md` の **Project Type** (greenfield/brownfield) を名前に使う
   - どちらも無い場合は `unnamed` を使う
3. 現在のタイムスタンプを `YYYYMMDD` 形式で取得する。
4. 保存先ディレクトリ名を `.aidlc-saves/<timestamp>-<name>` とする（例: `.aidlc-saves/20260312-add-auth-api`）。
5. `.aidlc-saves/` ディレクトリが存在しない場合は作成する。
6. `aidlc-docs/` を保存先に移動する（`mv aidlc-docs/ .aidlc-saves/<timestamp>-<name>/`）。
7. 移動完了後、結果を報告する:
   - 保存先パス
   - 含まれるファイル数
   - 復元コマンド: `/restore-aidlc` で復元できることを案内する
