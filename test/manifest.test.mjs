import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { validateManifest } from "@soksak/plugin-api";

const manifest = JSON.parse(readFileSync(new URL("../plugin.json", import.meta.url), "utf8"));
const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

test("plugin.json satisfies the manifest format", () => {
  assert.equal(validateManifest(manifest), manifest);
});

test("the package publishes the manifest, the events and every module of the page", () => {
  for (const file of ["plugin.json", "events.json", manifest.surface.module, "ui/input.js", "ui/events.js"]) {
    assert.ok(pkg.files.includes(file), file);
    assert.ok(existsSync(new URL(`../${file}`, import.meta.url)), file);
  }
});
