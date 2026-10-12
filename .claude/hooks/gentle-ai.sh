#!/usr/bin/env bash
# Runs a pinned gentle-ai/engram binary, installing it with `go install` when it
# is missing (cloud sessions start from a fresh container).
#
#   gentle-ai.sh setup            install both binaries if missing
#   gentle-ai.sh run <args...>    run gentle-ai (no-op if it cannot be installed)
#   gentle-ai.sh engram <args...> exec engram (used by the MCP server entry)
#   gentle-ai.sh memory-import    load memories committed under .engram/
#   gentle-ai.sh memory-export    write new memories to .engram/ (commit them)
set -uo pipefail

GENTLE_AI_VERSION="v4.1.1"
ENGRAM_VERSION="v1.20.0"

if command -v go >/dev/null 2>&1; then
  PATH="$PATH:$(go env GOPATH)/bin"
fi
PATH="$PATH:$HOME/go/bin"
export PATH

install_bin() {
  local bin="$1" module="$2"
  command -v "$bin" >/dev/null 2>&1 && return 0
  command -v go >/dev/null 2>&1 || { echo "gentle-ai.sh: go not found, cannot install $bin" >&2; return 1; }
  echo "gentle-ai.sh: installing $module" >&2
  go install "$module" >&2
}

setup() {
  install_bin gentle-ai "github.com/gentleman-programming/gentle-ai/v4/cmd/gentle-ai@${GENTLE_AI_VERSION}" || return 1
  install_bin engram "github.com/Gentleman-Programming/engram/cmd/engram@${ENGRAM_VERSION}" || return 1
  if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
    echo "export PATH=\"\$PATH:$(dirname "$(command -v gentle-ai)")\"" >>"$CLAUDE_ENV_FILE"
  fi
}

cmd="${1:-}"
shift || true
case "$cmd" in
  setup) setup ;;
  run)
    install_bin gentle-ai "github.com/gentleman-programming/gentle-ai/v4/cmd/gentle-ai@${GENTLE_AI_VERSION}" || exit 0
    exec gentle-ai "$@"
    ;;
  engram)
    install_bin engram "github.com/Gentleman-Programming/engram/cmd/engram@${ENGRAM_VERSION}" || exit 1
    exec engram "$@"
    ;;
  memory-import | memory-export)
    # The Engram DB lives in ~/.engram and dies with the container, so
    # memories round-trip through compressed chunks committed in .engram/.
    command -v engram >/dev/null 2>&1 || exit 0
    cd "${CLAUDE_PROJECT_DIR:-$PWD}" || exit 0
    if [ "$cmd" = memory-import ]; then
      [ -d .engram ] && engram sync --import >/dev/null 2>&1
    else
      engram sync >/dev/null 2>&1
    fi
    exit 0
    ;;
  *) echo "usage: $0 setup | run <args> | engram <args> | memory-import | memory-export" >&2; exit 2 ;;
esac
