
.PHONY: install
install:
	yarn

.PHONY:	dev
dev:
	yarn dev

.PHONY: build
build:
	yarn build

.PHONY:	clean
clean:
	rm -rf dist
	rm -rf node_modules

.env:
	cp .env-sample .env
