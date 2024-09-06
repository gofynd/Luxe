function isRunningOnClient() {
  if (typeof window !== "undefined") {
    return globalThis === window;
  }

  return false;
}

if (!isRunningOnClient()) {
  if (!globalThis.queueMicrotask) {
    globalThis.queueMicrotask = function queueMicrotaskPolyfil(callback) {
      Promise.resolve().then(callback);
    };
  }
  if (!globalThis.Response) {
    globalThis.Response = class Response {
      constructor() {}

      static error() {
        return {};
      }

      static json() {
        return "{}";
      }

      static redirect() {
        return {};
      }
    };
  }
}
