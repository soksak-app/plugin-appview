# The test and the pack of the application plugin (docs/features.md); pack uses sok of core.
.PHONY: test pack hooks

SOK ?= sok

# The tests use @soksak/plugin-api of the core release that package.json names.
node_modules: package.json
	pnpm install
	touch node_modules

# soksak-exposure checks the exposed names of the page against plugin.json and the declarations of core.
# soksak-engines checks that engines.soksak declares the release of that @soksak/plugin-api.
# soksak-events finds sources without an event or a reason by the census rules of core and compares events.json with
# the events of the sources.
test: node_modules
	pnpm test
	pnpm exec soksak-exposure
	pnpm exec soksak-engines
	pnpm exec soksak-events --census census.json --catalog events.json
	pnpm exec soksak-records

pack:
	@test -n "$(OUT)" || { echo "make pack OUT=<folder>" >&2; exit 2; }
	$(SOK) plugin pack . $(OUT)

# Sets this repository to use .githooks, which checks commit messages and records at commit time.
hooks:
	@git config core.hooksPath .githooks
