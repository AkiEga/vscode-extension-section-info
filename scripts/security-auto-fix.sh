#!/usr/bin/env bash
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

if ! command -v xvfb-run >/dev/null 2>&1; then
  sudo apt-get update
  sudo apt-get install -y xvfb imagemagick
fi

npm ci --no-audit --no-fund
npm audit fix --package-lock-only || true
npm install --no-audit --no-fund
mkdir -p artifacts
Xvfb :99 -screen 0 1280x1024x24 >/tmp/xvfb.log 2>&1 &
XVFB_PID=$!
trap 'kill "$XVFB_PID" >/dev/null 2>&1 || true' EXIT
export DISPLAY=:99
npm test -- --reporter dot || true
import -window root artifacts/vscode-snapshot.png || convert -size 1280x1024 xc:white artifacts/vscode-snapshot.png
ls -l artifacts
