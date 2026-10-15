import assert from "node:assert/strict";
import test from "node:test";

const LOG = Object.fromEntries(["error", "warn", "info", "debug", "trace"].map((level) => [level, () => {}]));

/** A surface context of this test with a view, an image region and a sidecar that record what the page does. */
function surface(program) {
  const listeners = new Map();
  const view = {
    style: {},
    addEventListener(type, fn) { listeners.set(type, [...(listeners.get(type) ?? []), fn]); },
    removeEventListener() {},
    setPointerCapture() {},
    getBoundingClientRect: () => ({ left: 10, top: 20, width: 320, height: 200 }),
  };
  const page = { hidden: false };
  view.hidden = false;
  const root = { set innerHTML(value) {}, querySelector: (selector) => ({ "#view": view, "#page": page })[selector] ?? null, replaceChildren() {} };
  const loads = [];
  const documentRegion = { load: async (url) => { loads.push(url); } };
  const regionListeners = new Map();
  const region = { on(type, fn) { regionListeners.set(type, fn); return () => regionListeners.delete(type); }, focus: async () => { focused += 1; }, setCaret: async (rect) => { carets.push(rect); } };
  let focused = 0;
  const carets = [];
  const sent = [];
  let sidecarListener;
  const sidecar = { async on(id, fn) { sidecarListener = fn; return () => {}; }, async send(id, body) { sent.push(body); } };
  const statuses = new Map();
  const commands = new Map();
  const reports = [];
  const context = {
    surfaceId: "s1",
    runtime: { log: LOG, sidecar: () => sidecar, settings: { read: () => ({ program }), on: () => () => {} } },
    composition: { async create() { return { region: (name) => (name === "page" ? documentRegion : region), dispose: async () => {} }; } },
    exposure: {
      status: async (name, read, subscribe) => statuses.set(name, { read, subscribe }),
      command: async (name, fn) => commands.set(name, fn), dom: async () => {}, bind: async () => {}, delegate: async () => {},
      dispose: async () => {},
    },
    status: { report: (phase, error) => reports.push([phase, error?.message]) },
  };
  return {
    context, root, view, page, loads, sent, statuses, commands, reports, carets,
    focused: () => focused,
    fire: (type, event) => listeners.get(type).forEach((fn) => fn({ preventDefault() {}, ...event })),
    region: (type, event) => regionListeners.get(type)(event),
    message: (body) => sidecarListener(body),
  };
}

const settle = () => new Promise((resolve) => setImmediate(resolve));

test("the page opens the program of its settings and reports ready", async () => {
  const s = surface("/opt/editor");
  const { mount } = await import("../ui/appview.js");
  await mount(s.root, s.context);
  assert.deepEqual(s.sent, [{ operation: "open", command: ["/opt/editor"] }]);
  assert.deepEqual(s.reports, [["ready", undefined]]);
  assert.equal(s.statuses.get("appview.state").read().program, "/opt/editor");
});

test("a page without a program reports the missing setting as an error", async () => {
  const s = surface("none");
  const { mount } = await import("../ui/appview.js");
  await mount(s.root, s.context);
  assert.deepEqual(s.sent, []);
  assert.deepEqual(s.reports, [["error", "the setting program names no application"]]);
});

test("pointer and wheel events of the view become embed input in points of the region", async () => {
  const s = surface("/opt/editor");
  const { mount } = await import("../ui/appview.js");
  await mount(s.root, s.context);
  s.fire("pointerdown", { clientX: 40, clientY: 70, button: 0, buttons: 1, pointerId: 1, shiftKey: true, altKey: false, ctrlKey: false, metaKey: false });
  s.fire("pointermove", { clientX: 41, clientY: 72, button: -1, buttons: 1, pointerId: 1, shiftKey: false, altKey: false, ctrlKey: false, metaKey: false });
  s.fire("pointerup", { clientX: 41, clientY: 72, button: 0, buttons: 0, pointerId: 1, shiftKey: false, altKey: false, ctrlKey: false, metaKey: false });
  s.fire("wheel", { clientX: 50, clientY: 60, deltaX: 0, deltaY: -12, deltaMode: 0 });
  await settle();
  const messages = s.sent.slice(1).map((body) => body.message);
  assert.deepEqual(messages[0], { type: "pointer", phase: "down", x: 30, y: 50, button: "left", buttons: ["left"], shift: true, alt: false, ctrl: false, meta: false, input: 1 });
  assert.deepEqual(messages[1], { type: "pointer", phase: "move", x: 31, y: 52, buttons: ["left"], shift: false, alt: false, ctrl: false, meta: false, input: 2 });
  assert.equal(messages[2].phase, "up");
  assert.deepEqual(messages[2].buttons, []);
  assert.deepEqual(messages[3], { type: "scroll", x: 40, y: 40, dx: 0, dy: -12, precise: true, input: 4 });
  assert.equal(s.focused(), 0, "a press passes through without moving the keyboard; appview.focus moves it");
});

test("region keyboard events become embed key, commit, compose and focus messages", async () => {
  const s = surface("/opt/editor");
  const { mount } = await import("../ui/appview.js");
  await mount(s.root, s.context);
  await s.region("key", { key: "ArrowLeft", shift: false, alt: true, ctrl: false });
  await s.region("insert", { text: "한" });
  await s.region("compose", { text: "ㅎ", caret: 1 });
  await s.region("focus", { focused: true });
  const messages = s.sent.slice(1).map((body) => body.message);
  const key = { type: "key", key: "ArrowLeft", shift: false, alt: true, ctrl: false, meta: false, repeat: false };
  assert.deepEqual(messages, [
    { ...key, down: true }, { ...key, down: false },
    { type: "commit", text: "한" },
    { type: "compose", text: "ㅎ", caret: 1 },
    { type: "focus", focused: true },
  ]);
});

test("messages of the sidecar set the cursor, the caret and the state, and errors are reported", async () => {
  const s = surface("/opt/editor");
  const { mount } = await import("../ui/appview.js");
  await mount(s.root, s.context);
  s.message({ event: "started", pid: 42 });
  s.message({ event: "connected", toolkit: "slint" });
  s.message({ event: "cursor", shape: "resize-ew" });
  s.message({ event: "caret", x: 1, y: 2, width: 3, height: 4 });
  s.message({ event: "state", title: "project" });
  s.message({ error: "the host refused frame 3 of the region view: size" });
  s.message({ event: "exited", exit: "exit status 0" });
  await settle();
  assert.equal(s.view.style.cursor, "ew-resize");
  assert.deepEqual(s.carets, [{ x: 1, y: 2, width: 3, height: 4 }]);
  assert.deepEqual(s.statuses.get("appview.state").read(), { program: "/opt/editor", pid: 42, toolkit: "slint", cursor: "resize-ew", title: "project", exit: "exit status 0", error: "the host refused frame 3 of the region view: size" });
  assert.deepEqual(s.reports.at(-1), ["error", "the host refused frame 3 of the region view: size"]);
});

test("appview.focus focuses the region and appview.input sends one embed input message", async () => {
  const s = surface("/opt/editor");
  const { mount } = await import("../ui/appview.js");
  await mount(s.root, s.context);
  await s.commands.get("appview.focus")({});
  assert.equal(s.focused(), 1);
  const message = { type: "commit", text: "a" };
  await s.commands.get("appview.input")({ message });
  assert.deepEqual(s.sent.at(-1), { operation: "input", message });
  await assert.rejects(s.commands.get("appview.input")({ message: { type: "end" } }), /appview.input: end is not an input message/);
});

test("a program that is a web address is shown in the document region and starts no sidecar", async () => {
  const s = surface("https://example.test/editor");
  const { mount } = await import("../ui/appview.js");
  await mount(s.root, s.context);
  assert.deepEqual(s.sent, []);
  assert.deepEqual(s.loads, ["https://example.test/editor"]);
  assert.equal(s.view.hidden, true);
  assert.equal(s.page.hidden, false);
  assert.deepEqual(s.reports, [["ready", undefined]]);
});

test("a program that is a path hides the document region", async () => {
  const s = surface("/opt/editor");
  const { mount } = await import("../ui/appview.js");
  await mount(s.root, s.context);
  assert.equal(s.page.hidden, true);
  assert.equal(s.view.hidden, false);
  assert.deepEqual(s.loads, []);
});
