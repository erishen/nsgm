import styled from "styled-components";
import { Layout, Menu, Breadcrumb } from "antd";

const { Header, Content, Sider } = Layout;

export const Container = styled.div`
  .main-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
`;

export const FlexLayout = styled(Layout)`
  display: flex;
  flex: 1;
  margin-top: 64px;
  position: relative;
`;

export const StyledSider = styled(Sider)`
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 12px -2px rgba(0, 0, 0, 0.15);
  z-index: 100;
  position: fixed;
  left: 0;
  top: 64px;
  bottom: 0;
  height: calc(100vh - 64px);
  background: #fff;
  border-right: 1px solid #e8e9ea;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.06) 20%,
      rgba(0, 0, 0, 0.06) 80%,
      transparent 100%
    );
  }
`;

export const SideMenu = styled(Menu)`
  height: 100%;
  border-right: 0;
  padding: 8px 0;
`;

export const ContentLayout = styled(Layout).withConfig({
  shouldForwardProp: (prop) => prop !== "collapsed",
})<{ collapsed?: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
  position: relative;
  z-index: 1;
  margin-left: ${(props) => (props.collapsed ? "80px" : "228px")};
  padding: 0 16px 24px;
  min-height: 100vh;
  transition: margin-left 0.2s ease;
`;

export const StyledHeader = styled(Header)`
  display: flex;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  background: #001529;

  .logo {
    margin-right: 24px;
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;

    &::before {
      content: "";
      position: absolute;
      left: -12px;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 32px;
      background: linear-gradient(135deg, #1890ff 0%, #722ed1 50%, #13c2c2 100%);
      border-radius: 2px;
      transition: all 0.3s ease;
    }

    &:hover {
      transform: translateX(2px);

      &::before {
        height: 36px;
        background: linear-gradient(135deg, #40a9ff 0%, #9254de 50%, #36cfc9 100%);
        box-shadow: 0 0 15px rgba(64, 169, 255, 0.6);
      }

      .logo-text {
        color: #69c0ff;
        text-shadow: 0 0 20px rgba(105, 192, 255, 0.5);
        transform: scale(1.05);
      }
    }

    .logo-text {
      font-size: 28px;
      font-weight: 800;
      color: #fff;
      font-family: "Arial", "Microsoft YaHei", sans-serif;
      letter-spacing: 3px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
      background-clip: text;
      -webkit-background-clip: text;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
  }

  .main-menu {
    flex: 1;
  }

  .user-actions {
    display: flex;
    align-items: center;

    .action-icon {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.85);
      cursor: pointer;
      padding: 0 8px;
      transition: color 0.3s;

      &:hover {
        color: #fff;
      }
    }

    .user-dropdown {
      cursor: pointer;
      padding: 0 8px;

      .username {
        color: rgba(255, 255, 255, 0.85);
        margin-left: 8px;
      }
    }
  }
`;

export const StyledBreadcrumb = styled(Breadcrumb)`
  margin: 20px 0;
  padding: 0;
  font-size: 14px;

  .ant-breadcrumb-link {
    color: #666;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      color: #1890ff;
    }
  }

  .ant-breadcrumb-separator {
    color: #bbb;
    margin: 0 8px;
  }

  .ant-breadcrumb > span:last-child .ant-breadcrumb-link {
    color: #1890ff;
    font-weight: 600;
  }
`;

export const StyledContent = styled(Content)`
  margin: 0;
  padding: 32px 32px 32px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 4px 16px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  position: relative;
  z-index: 1;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  flex: 1;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #1890ff 0%, #722ed1 25%, #13c2c2 50%, #52c41a 75%, #faad14 100%);
    border-radius: 16px 16px 0 0;
  }

  &::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(24, 144, 255, 0.02) 0%, transparent 50%);
    pointer-events: none;
    transition: all 0.4s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.98);
    box-shadow:
      0 12px 48px rgba(0, 0, 0, 0.12),
      0 8px 24px rgba(0, 0, 0, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
    transform: translateY(-2px);

    &::after {
      background: radial-gradient(circle, rgba(24, 144, 255, 0.04) 0%, transparent 50%);
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    padding: 24px;
    border-radius: 12px;

    &::before {
      border-radius: 12px 12px 0 0;
    }
  }

  @media (max-width: 480px) {
    padding: 20px;
    border-radius: 10px;

    &::before {
      border-radius: 10px 10px 0 0;
    }
  }
`;
