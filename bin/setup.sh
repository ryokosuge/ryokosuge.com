#!/bin/bash
set -e

# Claude Code
curl -fsSL https://claude.ai/install.sh | bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc

# Starship prompt init
if ! grep -q 'starship init bash' ~/.bashrc 2>/dev/null; then
  echo 'eval "$(starship init bash)"' >> ~/.bashrc
fi
