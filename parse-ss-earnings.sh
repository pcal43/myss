#!/usr/bin/env bash
set -euo pipefail

node "$(dirname "$0")/cli.js" "${1:-raw-data/sample-social-security-statement.xml}"
