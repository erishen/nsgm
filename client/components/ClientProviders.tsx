import { useEffect, useState, ReactNode, FC } from "react";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "@/styled/common";

interface ClientProvidersProps {
  children: ReactNode;
  theme: any;
  whiteColor?: boolean;
}

const ClientProviders: FC<ClientProvidersProps> = ({ children, theme, whiteColor = true }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // 使用更安全的客户端检测
    setIsClient(true);
  }, []);

  // 在服务端渲染时，使用一个占位符来保持结构一致性
  // 但不渲染可能引起 useLayoutEffect 警告的组件
  return (
    <ThemeProvider theme={theme}>
      {isClient && <GlobalStyle whiteColor={whiteColor} />}
      {children}
    </ThemeProvider>
  );
};

export default ClientProviders;
