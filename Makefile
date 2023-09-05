MICROCMS_SERVICE_DOMAIN ?= 
MICROCMS_API_KEY ?=

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

.PHONY: docker/build
docker/build:
	docker build \
		--build-arg MICROCMS_SERVICE_DOMAIN=$(MICROCMS_SERVICE_DOMAIN) \
		--build-arg MICROCMS_API_KEY=$(MICROCMS_API_KEY) \
		-t ryokosuge.com .
