// 必须在所有其他导入之前执行
import "@/utils/suppressWarnings";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { Spin } from "antd";
import { appWithTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useStore } from "@/redux/store";
import { Loading } from "@/styled/common";
import LayoutComponent from "@/layout";
import ClientProviders from "@/components/ClientProviders";
import SuppressHydrationWarnings from "@/components/SuppressHydrationWarnings";
import SSRSafeAntdProvider from "@/components/SSRSafeAntdProvider";
import { login } from "@/utils/sso";
import { getAntdLocale } from "@/utils/i18n";
import { navigateToLogin } from "@/utils/navigation";
import "antd/dist/reset.css";

const theme = {
  colors: {
    primary: "#0070f3",
  },
};

const App = ({ Component, pageProps }) => {
  const store = useStore(pageProps.initialReduxState);
  const router = useRouter();
  const [ssoUser, setSsoUser] = useState(null);
  const [pageLoad, setPageLoad] = useState(false);
  const [loginChecked, setLoginChecked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState("zh-CN");

  // 检查是否为特殊页面（登录页、错误页）
  // 避免在服务器端访问 router.pathname
  const isSpecialPage =
    Component.displayName === "ErrorPage" ||
    Component.name === "ErrorPage" ||
    Component.displayName === "LoginPage" ||
    Component.name === "LoginPage";

  // Get Antd locale based on current locale
  const antdLocale = getAntdLocale(currentLocale);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // 同步当前语言
    if (typeof window !== "undefined") {
      const locale = router.locale || "zh-CN";
      setCurrentLocale(locale);
    }
  }, [router.locale]);

  useEffect(() => {
    if (!mounted) return;

    // 对于特殊页面，跳过登录检查
    if (isSpecialPage) {
      setLoginChecked(true);
      setPageLoad(true);
      return;
    }

    // 检查当前路径是否为登录页或错误页
    const isLoginPage = typeof window !== "undefined" && window.location.pathname === "/login";
    const isErrorPage =
      typeof window !== "undefined" &&
      (window.location.pathname === "/404" ||
        window.location.pathname === "/500" ||
        window.location.pathname === "/_error");

    // 如果是登录页或错误页，直接设置加载完成，不进行登录检查
    if (isLoginPage || isErrorPage) {
      setLoginChecked(true);
      setPageLoad(true);
      return;
    }

    // 检查是否有登录凭证
    const hasLoginCookie = typeof window !== "undefined" && document.cookie.includes("_cas_nsgm");

    // 如果没有登录凭证，直接跳转到登录页面（保持当前语言）
    if (!hasLoginCookie && typeof window !== "undefined") {
      navigateToLogin(router);
      return;
    }

    // 否则执行登录检查
    login((user: any) => {
      if (user) {
        setSsoUser(user);
      }
      setLoginChecked(true);
    });

    setTimeout(() => {
      setPageLoad(true);
    }, 100);
  }, [mounted, isSpecialPage]);

  return (
    <>
      <SuppressHydrationWarnings />
      <SSRSafeAntdProvider locale={antdLocale}>
        <ClientProviders theme={theme} whiteColor={true}>
          <Provider store={store}>
            {isSpecialPage ? (
              // 特殊页面（错误页、登录页）直接渲染，不使用 Layout
              <Component {...pageProps} />
            ) : !loginChecked ? (
              <Loading>
                <Spin size="large" />
              </Loading>
            ) : pageLoad ? (
              ssoUser ? (
                <LayoutComponent user={ssoUser}>
                  <Component {...pageProps} />
                </LayoutComponent>
              ) : (
                <Component {...pageProps} />
              )
            ) : (
              <Loading>
                <Spin size="large" />
              </Loading>
            )}
          </Provider>
        </ClientProviders>
      </SSRSafeAntdProvider>
    </>
  );
};

// appWithTranslation 会自动从 next.config.js 读取 i18n 配置
export default appWithTranslation(App);
