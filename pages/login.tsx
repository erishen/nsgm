import MarkdownIt from "markdown-it";
import _ from "lodash";
import { LoginContainer } from "../client/styled/common";
// import getConfig from 'next/config'
import React, { useState, useEffect } from "react";
import { Input, Button, Form, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { directLogin } from "../client/utils/sso";
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
  const { t } = useTranslation(["login"]);
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const createMarkup = () => {
    return {
      __html: html,
    };
  };

  const doLogin = () => {
    if (!mounted || typeof window === "undefined") return;

    if (userName === "") {
      message.error(t("login:login.errors.usernameRequired"));
      return;
    }
    if (userPassword === "") {
      message.error(t("login:login.errors.passwordRequired"));
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
        if (!loginResult.success) {
          message.error(loginResult.message);
        }
      });
    } else {
      // 直接返回的结果
      const syncResult = result as { success: boolean; message?: string };
      if (!syncResult.success) {
        message.error(syncResult.message || t("login:login.errors.loginFailed"));
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
      <div dangerouslySetInnerHTML={createMarkup()} />
      <Typography.Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
        {t("login:login.title")}
      </Typography.Title>
      <Form layout="vertical" style={{ width: "100%" }}>
        <Form.Item>
          <Input
            prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder={t("login:login.username")}
            size="large"
            value={userName}
            onChange={doChangeName}
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item>
          <Input.Password
            prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder={t("login:login.password")}
            size="large"
            value={userPassword}
            onChange={doChangePassword}
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={doLogin} size="large" block>
            {t("login:login.loginButton")}
          </Button>
        </Form.Item>
      </Form>
    </LoginContainer>
  );
};

export const getServerSideProps = async ({ locale }) => {
  // 确保 locale 有默认值，避免 serverSideTranslations 报错
  const currentLocale = locale || "zh-CN";

  // 处理 markdown 内容
  let html = "";
  _.each(renderArr, (item) => {
    html += md.render(item);
  });

  return {
    props: {
      html,
      ...(await serverSideTranslations(currentLocale, ["common", "layout", "login"])),
    },
  };
};

Page.displayName = "LoginPage";

export default Page;
