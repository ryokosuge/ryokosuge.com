
prepare:
	gh auth login

submodule:
	git submodule update --init --recursive

server:
	hugo server -D