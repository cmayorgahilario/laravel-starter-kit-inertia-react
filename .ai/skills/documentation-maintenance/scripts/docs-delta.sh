#!/usr/bin/env bash
# docs-delta.sh — shows what changed in the code and is not yet reflected in the docs.
#
# Runs ONLY on the integration branch (develop). The .last-doc-commit pointer marks
# "the develop docs are up to date up to here". It does not run on feature branches or
# on master: that way no ephemeral hash gets saved and the state file never enters a
# merge conflict.
#
# It compares against the last commit marked as reviewed. If there is no prior state,
# the delta is computed from the start of the repository (empty tree).
#
# Usage (while on develop):
#   bash docs-delta.sh           # prints the delta (does not modify state)
#   bash docs-delta.sh --stat    # delta with statistics (+/- per file)
#   bash docs-delta.sh --mark    # saves HEAD as the "last reviewed commit"
#
# Bash on the HOST, no Sail.

set -euo pipefail

# Allowed integration branch. Change this if your base branch has a different name.
INTEGRATION_BRANCH="develop"

# Repo root so the script works from any cwd.
ROOT="$(git rev-parse --show-toplevel)"
STATE_FILE="$ROOT/.ai/skills/documentation-maintenance/.last-doc-commit"

# Guard: integration branch only.
CURRENT_BRANCH="$(git symbolic-ref --short -q HEAD || true)"
if [ "$CURRENT_BRANCH" != "$INTEGRATION_BRANCH" ]; then
  echo "🚫 docs-delta runs only on '$INTEGRATION_BRANCH' (you are on '${CURRENT_BRANCH:-detached HEAD}')." >&2
  echo "   Switch to '$INTEGRATION_BRANCH' after integrating the feature and run it again." >&2
  exit 1
fi

# Git empty-tree hash: "delta from the start" when there is no prior state.
EMPTY_TREE="$(git hash-object -t tree /dev/null)"

HEAD_COMMIT="$(git rev-parse HEAD)"

mode="show"
diff_flag="--name-status"
for arg in "$@"; do
  case "$arg" in
    --mark) mode="mark" ;;
    --stat) diff_flag="--stat" ;;
    -h|--help)
      sed -n '2,18p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *)
      echo "docs-delta: unknown argument '$arg'" >&2
      exit 2
      ;;
  esac
done

# Starting point of the comparison.
if [ -f "$STATE_FILE" ] && [ -s "$STATE_FILE" ]; then
  BASE="$(tr -d '[:space:]' < "$STATE_FILE")"
  # The saved commit may have vanished (rebase/squash/fresh clone).
  if ! git cat-file -e "${BASE}^{commit}" 2>/dev/null; then
    echo "⚠️  The saved commit ($BASE) no longer exists in this repo; using the start of history." >&2
    BASE="$EMPTY_TREE"
  fi
else
  BASE="$EMPTY_TREE"
fi

if [ "$mode" = "mark" ]; then
  printf '%s\n' "$HEAD_COMMIT" > "$STATE_FILE"
  echo "✅ Marked: documentation reviewed up to $HEAD_COMMIT"
  echo "   State: $STATE_FILE"
  exit 0
fi

# "show" mode: print the delta between BASE and HEAD.
if [ "$BASE" = "$EMPTY_TREE" ]; then
  echo "📍 No saved commit — delta from the start of history to HEAD ($HEAD_COMMIT)"
else
  echo "📍 Delta from $BASE to HEAD ($HEAD_COMMIT)"
fi

if [ "$BASE" = "$HEAD_COMMIT" ]; then
  echo "   (no changes: you are already at the marked commit)"
  exit 0
fi

echo "---"
git diff "$diff_flag" "$BASE" "$HEAD_COMMIT"
echo "---"
echo "When you finish updating the documentation: bash $0 --mark"
