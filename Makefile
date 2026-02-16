# DevPod環境
DEVPOD_WORKSPACE := ryokosuge-com

# DevPodでworkspaceを起動（IDE無し）
devpod-up:
	devpod up . --ide none --id $(DEVPOD_WORKSPACE)

# DevPod workspaceにSSH接続
devpod-ssh:
	devpod ssh $(DEVPOD_WORKSPACE)

# DevPod workspaceを停止
devpod-stop:
	devpod stop $(DEVPOD_WORKSPACE)

# DevPod workspaceを削除
devpod-delete:
	devpod delete $(DEVPOD_WORKSPACE)

# DevPod workspace内でHugoサーバーを起動
server:
	hugo server -D --bind 0.0.0.0

