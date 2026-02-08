import { useEffect } from "react";

// 全局抑制 useLayoutEffect 警告的函数
const suppressUseLayoutEffectWarnings = () => {
  if (typeof window === "undefined" && process.env.NODE_ENV === "development") {
    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = (...args) => {
      const errorMessage = args[0];
      if (
        typeof errorMessage === "string" &&
        (errorMessage.includes("useLayoutEffect does nothing on the server") ||
          errorMessage.includes("Warning: useLayoutEffect does nothing on the server"))
      ) {
        return;
      }
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      const warnMessage = args[0];
      if (
        typeof warnMessage === "string" &&
        (warnMessage.includes("useLayoutEffect does nothing on the server") ||
          warnMessage.includes("Warning: useLayoutEffect does nothing on the server"))
      ) {
        return;
      }
      originalWarn.apply(console, args);
    };

    // 返回清理函数
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }
  return undefined;
};

// 在模块加载时立即执行
suppressUseLayoutEffectWarnings();

const SuppressHydrationWarnings = () => {
  useEffect(() => {
    // 在客户端也抑制这些警告（以防万一）
    const cleanup = suppressUseLayoutEffectWarnings();
    return cleanup;
  }, []);

  return null;
};

export default SuppressHydrationWarnings;
