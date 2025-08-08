import styled from 'styled-components'

export const Container = styled.div`
  .main-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .header {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 20px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    z-index: 10;

    .logo {
      width: 120px;
      height: 31px;
      margin-right: 24px;
      display: flex;
      align-items: center;
    }

    .main-menu {
      flex: 1;
    }

    .user-actions {
      display: flex;
      align-items: center;
      margin-left: auto;
      height: 100%;

      .ant-space {
        display: flex;
        align-items: center;
        height: 100%;
      }

      .action-icon {
        color: rgba(255, 255, 255, 0.85);
        font-size: 20px;
        cursor: pointer;
        transition: color 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 32px;
        width: 32px;

        &:hover {
          color: #fff;
        }
      }

      .user-dropdown {
        cursor: pointer;
        padding: 0 8px;
        display: flex;
        align-items: center;

        .username {
          color: rgba(255, 255, 255, 0.85);
          margin-left: 8px;
        }
      }
    }
  }

  .sidebar {
    box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);
    background: #f5f7fa;
    border-right: 1px solid #ebeef5;

    .side-menu {
      border-right: none;
      background: #f5f7fa;

      .ant-menu-item {
        margin: 0;
        border-radius: 0;

        &:hover {
          background-color: #e6f7ff;
        }

        &.ant-menu-item-selected {
          background-color: #e6f7ff;
          border-right: 3px solid #1890ff;
          font-weight: 500;
        }
      }

      .ant-menu-submenu-title {
        &:hover {
          background-color: #e6f7ff;
        }
      }

      .ant-menu-submenu-selected > .ant-menu-submenu-title {
        color: #1890ff;
        font-weight: 500;
      }
    }
  }

  .content-layout {
    padding: 0 24px 24px;
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;

    .breadcrumb-container {
      margin: 16px 0;
      font-size: 14px;
    }

    .content-container {
      padding: 24px;
      margin: 0;
      flex: 1;
      min-height: 280px;
      background: #fff;
      border-radius: 4px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
    }
  }

  .site-layout-background {
    background: #fff;
  }

  .ant-layout-sider-trigger {
    background: #e6f7ff;
    color: #1890ff;
    border-top: 1px solid #ebeef5;
    border-right: 1px solid #ebeef5;

    &:hover {
      background: #bae7ff;
    }
  }
`
