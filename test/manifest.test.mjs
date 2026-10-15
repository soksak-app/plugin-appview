import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { validateManifest } from "@soksak/plugin-api";

const manifest = JSON.parse(readFileSync(new URL("../plugin.json", import.meta.url), "utf8"));
const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

test("plugin.json satisfies the manifest format", () => {
  assert.equal(validateManifest(manifest), manifest);
});

test("the package publishes the manifest and every shared module of appview.surface", () => {
  for (const file of ["plugin.json", ...Object.values(manifest.extends.surface.modules)]) {
    assert.ok(pkg.files.includes(file), file);
    assert.ok(existsSync(new URL(`../${file}`, import.meta.url)), file);
  }
});
