import { createEmitter } from "./events.js";
import { checkInput, cursor, pointer, region as regionMessages, scroll } from "./input.js";

// The view is the element of the image region; the application draws it, so the view has no background of its own.
const css = `:host{display:block;height:100%;background:transparent;position:relative}#view{position:absolute;inset:0;outline:0}`;

export async function mount(root, context) {
  root.innerHTML = `<style>${css}</style><div id="view" data-expose="app.view" data-command="app.focus" tabindex="0"></div>`;
  const view = root.querySelector("#view");
  const composition = await context.composition.create({ regions: { view }, overlays: {} });
  const image = composition.region("view");
  const sidecar = context.runtime.sidecar();
  const emitEvent = createEmitter(context.runtime, "app");
  // The value none of the setting program states that no application is chosen.
  const setting = context.runtime.settings.read().program;
  const program = setting === "none" ? null : setting;
  let state = { program, pid: null, toolkit: null, cursor: "default", title: null, exit: null, error: null };
  const watchers = new Set();
  const changed = (fields) => { state = { ...state, ...fields }; watchers.forEach((fn) => fn(state)); };
  const report = (text) => {
    changed({ error: text });
    emitEvent("warn", "plugin.app.error", { error: text });
    context.status.report("error", new Error(text));
  };
  let inputs = 0;
  const send = (message) => {
    emitEvent("trace", "plugin.app.input", { type: message.type });
    return sidecar.send(context.surfaceId, { operation: "input", message }).catch((error) => report(`input: ${error.message}`));
  };
  await Promise.all([
    context.exposure.status("app.state", () => state, (fn) => { watchers.add(fn); return () => watchers.delete(fn); }),
    context.exposure.command("app.focus", async () => { await image.focus(); return null; }),
    context.exposure.command("app.input", async ({ message }) => { await send(checkInput(message)); return null; }),
    context.exposure.dom("app.view", view),
  ]);
  await context.exposure.delegate(root);
  await context.exposure.bind(view, "app.focus", () => ({}), { event: "pointerdown" });
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
  await sidecar.on(context.surfaceId, (body) => {
    emitEvent("debug", "plugin.app.message", { event: body.event ?? "error" });
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
      return image.setCaret({ x: body.x, y: body.y, width: body.width, height: body.height }).catch((error) => report(`caret: ${error.message}`));
    }
    if (body.event === "state") return changed({ title: body.title });
    if (body.event === "exited") return changed({ exit: body.exit });
    return report(`unknown message of the sidecar ${JSON.stringify(body)}`);
  });
  if (program === null) {
    report("the setting program names no application");
    return { dispose: () => composition.dispose() };
  }
  emitEvent("info", "plugin.app.open", { program });
  await sidecar.send(context.surfaceId, { operation: "open", command: [program] });
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
