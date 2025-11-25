prepare:
	gh auth login

submodule:
	git submodule update --init --recursive

# devcontainer環境でHugoサーバーを起動
# 1. devcontainer buildでイメージをビルド
# 2. dockerで直接コンテナを起動（sleep infinityで永続化）
# 3. docker execでHugoサーバーを実行
DEVCONTAINER_IMAGE := vsc-ryokosuge.com-dev
DEVCONTAINER_NAME := ryokosuge-com-dev

server:
	@# イメージをビルド（既にあればスキップ）
	devcontainer build --workspace-folder . --image-name $(DEVCONTAINER_IMAGE) 2>/dev/null || true
	@# 既存コンテナがあれば停止・削除
	@docker rm -f $(DEVCONTAINER_NAME) 2>/dev/null || true
	@# コンテナをデタッチモードで起動（sleep infinityで永続化）
	docker run -d --name $(DEVCONTAINER_NAME) \
		-p 1313:1313 \
		-v "$(PWD):/workspaces/ryokosuge.com" \
		-w /workspaces/ryokosuge.com \
		$(DEVCONTAINER_IMAGE) sleep infinity
	@# Hugoサーバーを起動（-tは対話環境の場合のみ有効）
	docker exec $(DEVCONTAINER_NAME) hugo server -D -p 1313 --bind 0.0.0.0

# devcontainer環境を停止
stop:
	docker stop $(DEVCONTAINER_NAME) 2>/dev/null || echo "No running devcontainer found"

# ローカルHugoでサーバーを起動（devcontainer不使用）
server-local:
	hugo server -D -p 1313
