
prepare:
	gh auth login
	claude

submodule:
	git submodule update --init --recursive

server:
	hugo server -D
