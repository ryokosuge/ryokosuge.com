#!/bin/bash
set -euo pipefail

# Git submodules
git submodule update --init --recursive

# Hugo (extended edition)
HUGO_VERSION="0.158.0"
ARCH=$(dpkg --print-architecture)
curl -fsSL "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-${ARCH}.deb" -o /tmp/hugo.deb
sudo dpkg -i /tmp/hugo.deb
rm /tmp/hugo.deb

# Bun
curl -fsSL https://bun.sh/install | bash

# Claude Code
curl -fsSL https://claude.ai/install.sh | bash
