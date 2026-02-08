// 这个文件需要在所有 React 组件加载之前执行
// 用于抑制 useLayoutEffect 在服务端渲染时的警告

if (typeof window === "undefined") {
  // 服务端环境
  const originalError = console.error;
  const originalWarn = console.warn;

  console.error = function (...args) {
    const message = args[0];
    if (
      typeof message === "string" &&
      (message.includes("useLayoutEffect does nothing on the server") ||
        message.includes("Warning: useLayoutEffect does nothing on the server"))
    ) {
      return;
    }
    originalError.apply(console, args);
  };

  console.warn = function (...args) {
    const message = args[0];
    if (
      typeof message === "string" &&
      (message.includes("useLayoutEffect does nothing on the server") ||
        message.includes("Warning: useLayoutEffect does nothing on the server"))
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };
}
