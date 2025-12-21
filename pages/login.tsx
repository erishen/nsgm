import MarkdownIt from "markdown-it";
import _ from "lodash";
import { LoginContainer } from "../client/styled/common";
// import getConfig from 'next/config'
import { useState, useEffect } from "react";
import { Input, Button, Form, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { directLogin } from "../client/utils/sso";
import { getLocalApiPrefix } from "../client/utils/common";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { navigateToHome } from "@/utils/navigation";

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

// const nextConfig = getConfig()
// const { publicRuntimeConfig } = nextConfig
// const { env } = publicRuntimeConfig

const renderArr: any = [];

renderArr.push("NSGM");

const Page = ({ html }) => {
  const { t } = useTranslation("login");
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [mounted, setMounted] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    setMounted(true);
    // 显示调试信息
    const apiPrefix = getLocalApiPrefix();
    setDebugInfo(`API: ${apiPrefix}`);
  }, []);

  const createMarkup = () => {
    return {
      __html: html,
    };
  };

  const doLogin = () => {
    if (!mounted || typeof window === "undefined") return;

    if (userName === "") {
      message.error(t("login.errors.usernameRequired"));
      return;
    }
    if (userPassword === "") {
      message.error(t("login.errors.passwordRequired"));
      return;
    }

    const result = directLogin(userName, userPassword, (user) => {
      if (user && mounted) {
        // 跳转到首页，保持当前语言设置，强制添加语言前缀避免自动检测
        navigateToHome(router, true);
      }
    });

    // 检查是否是 Promise
    if (result && typeof (result as any).then === "function") {
      (result as Promise<any>).then((loginResult) => {
        setDebugInfo(`Login result: ${JSON.stringify(loginResult)}`);
        if (!loginResult.success) {
          message.error(loginResult.message);
        }
      });
    } else {
      // 直接返回的结果
      const syncResult = result as { success: boolean; message?: string };
      setDebugInfo(`Login result: ${JSON.stringify(syncResult)}`);
      if (!syncResult.success) {
        message.error(syncResult.message || t("login.errors.loginFailed"));
      }
    }
  };

  const doChangeName = (e) => {
    setUserName(_.trim(e.target.value));
  };

  const doChangePassword = (e) => {
    setUserPassword(_.trim(e.target.value));
  };

  return (
    <LoginContainer>
      <div style={{ position: "absolute", top: "20px", right: "20px" }}>
        <LanguageSwitcher />
      </div>
      {debugInfo && (
        <div
          style={{
            position: "absolute",
            top: "60px",
            right: "20px",
            fontSize: "12px",
            color: "#999",
            maxWidth: "300px",
            wordBreak: "break-all",
          }}
        >
          {debugInfo}
        </div>
      )}
      <div dangerouslySetInnerHTML={createMarkup()} />
      <Typography.Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
        {t("login.title")}
      </Typography.Title>
      <Form layout="vertical" style={{ width: "100%" }}>
        <Form.Item>
          <Input
            prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder={t("login.username")}
            size="large"
            value={userName}
            onChange={doChangeName}
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item>
          <Input.Password
            prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder={t("login.password")}
            size="large"
            value={userPassword}
            onChange={doChangePassword}
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={doLogin} size="large" block>
            {t("login.loginButton")}
          </Button>
        </Form.Item>
      </Form>
    </LoginContainer>
  );
};

export const getServerSideProps = async ({ locale }) => {
  const currentLocale = locale || "zh-CN";

  // 处理 markdown 内容
  let html = "";
  _.each(renderArr, (item) => {
    html += md.render(item);
  });

  const path = require("path");
  const i18nConfig = {
    i18n: {
      defaultLocale: "zh-CN",
      locales: ["zh-CN", "en-US", "ja-JP"],
    },
    localePath: path.resolve(process.cwd(), "public/locales"),
  };

  return {
    props: {
      html,
      ...(await serverSideTranslations(currentLocale, ["common", "layout", "login"], i18nConfig)),
    },
  };
};

Page.displayName = "LoginPage";

export default Page;
