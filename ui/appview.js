import { createEmitter } from "./events.js";
import { checkInput, cursor, pointer, region as regionMessages, scroll } from "./input.js";

// The view is the element of the image region; the application draws it, so the view has no background of its own.
const css = `:host{display:block;height:100%;background:transparent;position:relative}#view,#page{position:absolute;inset:0;outline:0}[hidden]{display:none}`;

export async function mount(root, context) {
  root.innerHTML = `<style>${css}</style><div id="view" data-expose="appview.view" data-command="appview.focus" tabindex="0"></div>` +
    `<div id="page" data-expose="appview.page" hidden></div>`;
  const view = root.querySelector("#view");
  const page = root.querySelector("#page");
  // The value none of the setting program states that no application is chosen; an http or https address is a web
  // application, which a document region shows without a sidecar.
  const settings = context.runtime.settings.read();
  // The setting arguments holds the arguments of the program as a JSON array of strings, so a path with spaces keeps
  // its form; another value is an error and starts nothing.
  let args = null;
  try {
    const parsed = JSON.parse(settings.arguments);
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) args = parsed;
  } catch {
    // reported below: the value is not JSON
  }
  const program = settings.program === "none" || args === null ? null : settings.program;
  const web = program !== null && /^https?:\/\//.test(program);
  // A shown image region holds the composition until its first frame, so only a running application shows it.
  view.hidden = web || program === null;
  page.hidden = !web;
  const sidecar = context.runtime.sidecar();
  // The host finishes the composition only after the first frame of the image region, which the application draws, so
  // the page subscribes to the sidecar and opens the application before it creates the composition; a message that
  // needs the region waits for it.
  let regionReady;
  const imageRegion = new Promise((resolve) => { regionReady = resolve; });
  const emitEvent = createEmitter(context.runtime, "appview");
  let state = { program, pid: null, toolkit: null, cursor: "default", title: null, exit: null, error: null };
  const watchers = new Set();
  const changed = (fields) => { state = { ...state, ...fields }; watchers.forEach((fn) => fn(state)); };
  const report = (text) => {
    changed({ error: text });
    emitEvent("warn", "plugin.appview.error", { error: text });
    context.status.report("error", new Error(text));
  };
  let inputs = 0;
  const send = (message) => {
    emitEvent("trace", "plugin.appview.input", { type: message.type });
    return sidecar.send(context.surfaceId, { operation: "input", message }).catch((error) => report(`input: ${error.message}`));
  };
  await sidecar.on(context.surfaceId, (body) => {
    emitEvent("debug", "plugin.appview.message", { event: body.event ?? "error" });
    if (body.error !== undefined) return report(body.error);
    if (body.event === "started") return changed({ pid: body.pid, exit: null });
    if (body.event === "connected") return changed({ toolkit: body.toolkit });
    if (body.event === "cursor") {
      try {
        view.style.cursor = cursor(body.shape);
        return changed({ cursor: body.shape });
      } catch (error) {
        return report(error.message);
      }
    }
    if (body.event === "caret") {
      return imageRegion.then((image) => image.setCaret({ x: body.x, y: body.y, width: body.width, height: body.height })).catch((error) => report(`caret: ${error.message}`));
    }
    if (body.event === "state") return changed({ title: body.title });
    if (body.event === "exited") return changed({ exit: body.exit });
    return report(`unknown message of the sidecar ${JSON.stringify(body)}`);
  });
  if (program !== null && !web) {
    emitEvent("info", "plugin.appview.open", { program });
    await sidecar.send(context.surfaceId, { operation: "open", command: [program, ...args] });
  }
  const composition = await context.composition.create({ regions: { view, page }, overlays: {} });
  const image = composition.region("view");
  regionReady(image);
  await Promise.all([
    context.exposure.status("appview.state", () => state, (fn) => { watchers.add(fn); return () => watchers.delete(fn); }),
    context.exposure.command("appview.focus", async () => { await (await imageRegion).focus(); return null; }),
    context.exposure.command("appview.input", async ({ message }) => { await send(checkInput(message)); return null; }),
    context.exposure.dom("appview.view", view),
    context.exposure.dom("appview.page", page),
  ]);
  await context.exposure.delegate(root);
  await context.exposure.bind(view, "appview.focus", () => ({}), { event: "pointerdown" });
  const rect = () => view.getBoundingClientRect();
  for (const [type, phase] of [["pointerdown", "down"], ["pointermove", "move"], ["pointerup", "up"]]) {
    view.addEventListener(type, (event) => {
      if (type === "pointerdown") view.setPointerCapture(event.pointerId);
      send(pointer(phase, event, rect(), ++inputs));
    });
  }
  view.addEventListener("wheel", (event) => { event.preventDefault(); send(scroll(event, rect(), ++inputs)); }, { passive: false });
  for (const type of ["key", "insert", "compose", "focus"]) {
    image.on(type, async (event) => { for (const message of regionMessages(type, event)) await send(message); });
  }
  image.on("error", (event) => report(`native image: ${event.reason}`));
  if (args === null) {
    report(`the setting arguments is not a JSON array of strings: ${settings.arguments}`);
    return { dispose: () => composition.dispose() };
  }
  if (program === null) {
    report("the setting program names no application");
    return { dispose: () => composition.dispose() };
  }
  if (web) {
    await composition.region("page").load(program);
    context.status.report("ready");
    return { dispose: async () => { await composition.dispose(); await context.exposure.dispose(); root.replaceChildren(); } };
  }
  context.status.report("ready");
  return {
    focus: () => image.focus(),
    async dispose() {
      await composition.dispose();
      await context.exposure.dispose();
      root.replaceChildren();
    },
  };
}
