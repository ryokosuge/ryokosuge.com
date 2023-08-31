all: deps install build

.PHONY: deps 
deps:
	npm i -g pnpm

.PHONY: install
install:
	pnpm install

.PHONY:	dev
dev:
	pnpm dev

.PHONY: build
build:
	pnpm build

.PHONY:	clean
clean:
	rm -rf dist
	rm -rf pnpm-lock.yaml
	rm -rf node_modules
