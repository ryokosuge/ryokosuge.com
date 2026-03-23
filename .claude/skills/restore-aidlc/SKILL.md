---
name: restore-aidlc
description: Restore a previously saved aidlc-docs/ session from .aidlc-saves/
disable-model-invocation: true
---

## Task

`/save-aidlc` で `.aidlc-saves/` に保存したセッションを `aidlc-docs/` に復元し、作業を再開できるようにする。

## Steps

1. 現在 `aidlc-docs/` ディレクトリが既に存在するか確認する。存在する場合は、自動的に `/save-aidlc` と同じ手順で現在のセッションを `.aidlc-saves/` に保存してから復元処理を続行する。保存が完了したことをユーザーに報告する。
2. `.aidlc-saves/` ディレクトリが存在するか確認する。存在しない場合は「保存されたセッションがありません。」とエラーメッセージを表示して終了する。
3. `.aidlc-saves/` 配下のディレクトリ一覧を取得する。セーブが無い場合は「保存されたセッションがありません。」と表示して終了する。
4. 保存されたセッションの一覧を表示する。各セーブについて以下の情報を表示する:
   - ディレクトリ名（タイムスタンプ + 名前）
   - `aidlc-state.md` から読み取った現在のフェーズとステージ
   - 保存日時（ディレクトリ名のタイムスタンプから）
5. ユーザーに復元するセッションを選択してもらう。セーブが1つしかない場合はそれを自動選択する旨を伝え確認を取る。
6. 選択されたセーブを `aidlc-docs/` に移動する（`mv .aidlc-saves/<selected>/ aidlc-docs/`）。
7. `.aidlc-saves/` が空になった場合はディレクトリを削除する。
8. 復元完了後、結果を報告する:
   - 復元元パス
   - 復元されたファイル数
   - 現在のフェーズとステージ（`aidlc-state.md` から）
   - 「セッション継続の手順に従って作業を再開できます」と案内する
