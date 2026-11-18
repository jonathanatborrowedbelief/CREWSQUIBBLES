#!/bin/zsh
# Lists user-visible brand leftovers. Usage: rebrand/census.sh [paths...]  (default: whole repo). Append | wc -l for a count.
cd "$(dirname "$0")/.." || exit 1
[ $# -eq 0 ] && set -- .
if command -v rg >/dev/null 2>&1 && [[ $(whence -w rg) != *function* ]]; then r() { command rg "$@"; }
else CL=$(ls -t ~/.local/share/claude/versions/* | head -1); r() { ARGV0=rg "$CL" "$@"; }; fi
r -n --no-heading \
  -e '\b(OpenMausBot|MausBot|OpenMaus|SupaMaus|Maus|MAUS)\b' \
  -e 'openmausbot\.(com|org)|mausbot\.(com|si|page)|milind-soni|milindsoni' \
  --glob '!{node_modules,.git,third_party,docs,apps,cloudflare,announcements,rebrand,.github,.claude,.tmpexp,.oss-scanner,evals}/**' \
  --glob '!**/{node_modules,vendor,test,testing,fixtures,package-fixtures,e2e}/**' \
  --glob '!**/*-goldens/**' --glob '!**/*.{test,node-test,e2e.test}.*' --glob '!**/*-preview.*' \
  --glob '!{README,CONTRIBUTING,DESIGN,LICENSING,SECURITY,AGENTS,CLA}.md' \
  --glob '!{NOTICE,LICENSE,pnpm-lock.yaml,tsconfig.tsbuildinfo}' \
  --glob '!src/locales/{de,es,fr,hi,it,ja,ko,pl,pt-br,ru,tr,uk,vi,zh,zh-tw}.json' \
  --glob '!src/locales/source-hashes.json' "$@" \
  | r -v ':[0-9]+:\s*(//|\*(\s|/|$)|/\*|\{/\*|#)'
