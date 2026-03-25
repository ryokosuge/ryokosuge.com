# DevPod workspace name (defaults to directory name)
WORKSPACE := ryokosuge.com

.PHONY: up down ssh status serve build clean

## DevPod: start workspace (use RECREATE=1 to recreate)
up:
	devpod up .$(if $(RECREATE), --recreate) --ide none

## DevPod: stop workspace
down:
	devpod stop $(WORKSPACE)

## DevPod: SSH into workspace
ssh:
	devpod ssh $(WORKSPACE)

## DevPod: show workspace status
status:
	devpod status $(WORKSPACE)

## Hugo: start dev server
serve:
	$(MAKE) -C hugo_site serve

## Hugo: build site
build:
	$(MAKE) -C hugo_site build

## Hugo: clean public/
clean:
	$(MAKE) -C hugo_site clean
