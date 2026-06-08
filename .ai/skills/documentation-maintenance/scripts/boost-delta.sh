#!/usr/bin/env bash
# boost-delta.sh — list Laravel Boost guideline sections that are NEW or CHANGED
# since the last BOOST-SYNC, so the docs skill only re-processes what changed.
#
# It splits .ai/boost-guidelines.md by the "=== <key> rules ===" headers, hashes
# each section body, and compares against the recorded hashes in .boost-state.json.
#
# Usage:
#   bash .ai/skills/documentation-maintenance/scripts/boost-delta.sh         # print changed/new section keys
#   bash .ai/skills/documentation-maintenance/scripts/boost-delta.sh --all   # print every section key + status
#
# Pure bash + sha256sum on the HOST; does not need Sail. It NEVER writes state:
# the skill updates .boost-state.json itself after distilling.

set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
GUIDELINES="$ROOT/.ai/boost-guidelines.md"
STATE="$ROOT/.ai/skills/documentation-maintenance/.boost-state.json"

MODE="${1:-changed}"

if [ ! -f "$GUIDELINES" ]; then
    echo "No guidelines file at $GUIDELINES — nothing to sync (run boost:update first)." >&2
    exit 0
fi

# Extract section keys (the text between '=== ' and ' rules ===').
mapfile -t KEYS < <(grep -oE '^=== .+ rules ===$' "$GUIDELINES" | sed -E 's/^=== (.+) rules ===$/\1/')

if [ "${#KEYS[@]}" -eq 0 ]; then
    echo "No '=== <key> rules ===' sections found in $GUIDELINES." >&2
    exit 0
fi

# Hash of a section body = everything from its header up to the next header (or EOF).
section_hash() {
    local key="$1"
    awk -v target="=== ${key} rules ===" '
        $0 == target {capture=1; next}
        /^=== .+ rules ===$/ {if (capture) exit}
        capture {print}
    ' "$GUIDELINES" | sha256sum | cut -d" " -f1
}

stored_hash() {
    local key="$1"
    [ -f "$STATE" ] || { echo ""; return; }
    # Minimal JSON read without jq: find "<key> rules": { ... "hash": "..." }.
    grep -oE "\"${key} rules\"[^}]*\"hash\"[[:space:]]*:[[:space:]]*\"[a-f0-9]+\"" "$STATE" 2>/dev/null \
        | grep -oE '"hash"[[:space:]]*:[[:space:]]*"[a-f0-9]+"' \
        | grep -oE '[a-f0-9]{64}' || echo ""
}

for key in "${KEYS[@]}"; do
    cur="$(section_hash "$key")"
    old="$(stored_hash "$key")"
    if [ "$cur" = "$old" ]; then
        status="unchanged"
    elif [ -z "$old" ]; then
        status="new"
    else
        status="changed"
    fi

    if [ "$MODE" = "--all" ]; then
        printf '%-12s %s\n' "$status" "$key"
    elif [ "$status" != "unchanged" ]; then
        printf '%s\t%s\n' "$status" "$key"
    fi
done
