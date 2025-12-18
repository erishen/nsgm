import { NextRouter } from "next/router";

/**
 * 跳转到指定页面，保持当前语言设置
 * @param router Next.js router 实例
 * @param path 目标路径（不包含语言前缀）
 */
export const navigateWithLocale = (router: NextRouter, path: string) => {
  // 只在客户端执行
  if (typeof window === "undefined") return;

  const currentLocale = router.locale || "zh-CN";
  const baseUrl = window.location.origin;

  let targetUrl: string;
  if (currentLocale === "zh-CN") {
    targetUrl = `${baseUrl}${path}`;
  } else {
    targetUrl = `${baseUrl}/${currentLocale}${path}`;
  }

  window.location.href = targetUrl;
};

/**
 * 跳转到登录页面，保持当前语言设置
 * @param router Next.js router 实例
 */
export const navigateToLogin = (router: NextRouter) => {
  // 只在客户端执行
  if (typeof window === "undefined") return;

  navigateWithLocale(router, "/login");
};

/**
 * 跳转到首页，保持当前语言设置
 * @param router Next.js router 实例
 * @param forceLocalePrefix 是否强制添加语言前缀（用于避免自动语言检测）
 */
export const navigateToHome = (router: NextRouter, forceLocalePrefix = false) => {
  // 只在客户端执行
  if (typeof window === "undefined") return;

  const currentLocale = router.locale || "zh-CN";
  const baseUrl = window.location.origin;

  let targetUrl: string;
  if (forceLocalePrefix || currentLocale !== "zh-CN") {
    // 强制添加语言前缀或非中文时
    targetUrl = `${baseUrl}/${currentLocale}`;
  } else {
    // 中文且不强制添加前缀
    targetUrl = baseUrl;
  }

  window.location.href = targetUrl;
};
