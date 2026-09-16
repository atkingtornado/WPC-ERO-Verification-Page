#!/usr/bin/env bash
#
# deploy.sh — thin wrapper around the shared WPC deploy script.
#
#   ./deploy.sh <dev|production> [--dry-run] [--skip-build] [--yes]
#   ./deploy.sh --list
#
# The targets live in ./deploy.config.sh; everything else (build, upload
# order, pruning, safety guards) is the shared script — see
# https://github.com/atkingtornado/wpc-deploy. It is picked up from this
# app's node_modules once installed (`npm install -D @atkingtornado/wpc-deploy`),
# or from a checkout next to this repo (../wpc-deploy) until then.

set -euo pipefail
cd "$(dirname "$0")"

if [ -x node_modules/.bin/wpc-deploy ]; then
  exec node_modules/.bin/wpc-deploy "$@"
fi
SHARED="${WPC_DEPLOY_DIR:-../wpc-deploy}/deploy.sh"
if [ -f "$SHARED" ]; then
  exec bash "$SHARED" "$@"
fi
echo "wpc-deploy not found. Either:" >&2
echo "  npm install -D @atkingtornado/wpc-deploy" >&2
echo "  or clone https://github.com/atkingtornado/wpc-deploy next to this repo (or set WPC_DEPLOY_DIR)" >&2
exit 1
