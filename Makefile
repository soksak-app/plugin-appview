# The test and the pack of the application plugin (docs/features.md); pack uses sok of core.
.PHONY: test pack hooks

SOK ?= sok

# The tests use @soksak/plugin-api of the core release that package.json names.
node_modules: package.json
	pnpm install
	touch node_modules

# The plugin has no surface and declares no exposure: the shared page names its status, commands and dom entries by the
# id of the connector plugin that mounts it, which declares them, so soksak-exposure runs in each connector repository.
# soksak-engines checks that engines.soksak declares the release of that @soksak/plugin-api.
# soksak-events finds sources without an event or a reason by the census rules of core; the events of the shared page
# carry the id of the connector plugin, whose events.json declares them, so this plugin has no event catalog.
test: node_modules
	pnpm test
	pnpm exec soksak-engines
	pnpm exec soksak-events --census census.json
	pnpm exec soksak-records

pack:
	@test -n "$(OUT)" || { echo "make pack OUT=<folder>" >&2; exit 2; }
	$(SOK) plugin pack . $(OUT)

# Sets this repository to use .githooks, which checks commit messages and records at commit time.
hooks:
	@git config core.hooksPath .githooks
