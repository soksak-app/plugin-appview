const LEVELS = ["error", "warn", "info", "debug", "trace"];

/**
 * Returns `emitEvent(level, name, fields)` of the plugin `pluginId`: it stores an event named `plugin.<pluginId>.<event>`
 * through the event log of the runtime (core docs/spec/plugins.md#logging). The runtime adds the prefix and the surface.
 */
export function createEmitter(runtime, pluginId) {
  const prefix = `plugin.${pluginId}.`;
  return function emitEvent(level, name, fields) {
    if (!LEVELS.includes(level)) throw new TypeError(`emitEvent requires a level of ${LEVELS.join(", ")}, not ${String(level)}`);
    if (typeof name !== "string" || !name.startsWith(prefix)) throw new TypeError(`emitEvent requires a name that starts with ${prefix}`);
    // events: forwarded
    runtime.log[level](name.slice(prefix.length), fields);
  };
}
