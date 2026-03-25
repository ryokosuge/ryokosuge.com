.PHONY: serve build clean mod-update

## Hugo: start dev server
serve:
	hugo server

## Hugo: build site
build:
	hugo

## Hugo: clean public/
clean:
	rm -rf public resources

## Hugo: update modules
mod-update:
	hugo mod get -u
	hugo mod tidy
