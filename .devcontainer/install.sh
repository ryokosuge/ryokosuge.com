#!/bin/bash
set -euo pipefail

# Hugo (via go install)
CGO_ENABLED=1 go install -tags extended github.com/gohugoio/hugo@v0.159.0

# JS dependencies (PostCSS, Dart Sass)
if [ -f hugo_site/package.json ]; then
  cd hugo_site && npm install && cd ..
fi

# Claude Code
curl -fsSL https://claude.ai/install.sh | bash
