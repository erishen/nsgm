import React from "react";
import { ConfigProvider } from "antd";

interface SSRSafeAntdProviderProps {
  children: React.ReactNode;
  locale?: any;
}

const SSRSafeAntdProvider: React.FC<SSRSafeAntdProviderProps> = ({ children, locale }) => {
  // 在服务端渲染时，我们仍然使用 ConfigProvider，但使用简化的配置
  return (
    <ConfigProvider
      locale={locale}
      theme={{
        // 确保服务端渲染的一致性
        cssVar: false,
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default SSRSafeAntdProvider;
