
prepare:
	git submodule update --init --recursive
	gh auth login

server:
	hugo server -D