import styled from "styled-components";
import { Button, Input, Table } from "antd";

export const Container = styled.div`
  margin: 20px 0 0 0;
  padding-bottom: 32px;

  .table-row-light {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .table-row-dark {
    background: linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(243, 246, 248, 0.9) 100%);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .page-title {
    font-size: 28px;
    font-weight: 700;
    color: #1890ff;
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 2px solid #f0f0f0;
    position: relative;

    &:after {
      content: "";
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 120px;
      height: 4px;
      background: linear-gradient(90deg, #1890ff 0%, #52c41a 50%, #faad14 100%);
      border-radius: 2px;
      animation: slideIn 0.5s ease-out;
    }
  }

  @keyframes slideIn {
    from {
      width: 0;
    }
    to {
      width: 120px;
    }
  }
`;

export const SearchRow = styled.div`
  margin: 10px 0 20px 0;
  padding: 16px 20px;
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
`;

export const ModalContainer = styled.div`
  padding: 8px 0;

  .line {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    min-height: 40px;
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }

    label {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      width: 100px;
      min-height: 32px;
      margin-right: 16px;
      font-weight: 500;
      color: #333;
      position: relative;
      flex-shrink: 0;

      &:after {
        content: "";
        position: absolute;
        left: -8px;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 16px;
        background: linear-gradient(180deg, #1890ff 0%, #52c41a 100%);
        border-radius: 3px;
      }
    }

    input,
    .ant-input-affix-wrapper {
      flex: 1;
      border-radius: 8px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      min-height: 36px;

      &:hover,
      &:focus {
        border-color: #40a9ff;
        box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.15);
      }
    }

    .ant-input-affix-wrapper input {
      min-height: auto;
    }
  }
`;

// Button 样式组件
export const StyledButton = styled(Button)<{
  $primary?: boolean;
  $export?: boolean;
  $import?: boolean;
  $danger?: boolean;
}>`
  display: flex;
  align-items: center;
  border-radius: 6px;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
  ${(props) =>
    props.$export &&
    `
      background-color: #f6ffed;
      color: #52c41a;
      border-color: #b7eb8f;
      box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
      transition: all 0.3s ease;
    `}
  ${(props) =>
    props.$import &&
    `
      background-color: #e6f7ff;
      color: #1890ff;
      border-color: #91d5ff;
      box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
      transition: all 0.3s ease;
    `}
    ${(props) =>
    props.$danger &&
    `
      background-color: #fff1f0;
      border-color: #ffa39e;
      box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
      transition: all 0.3s ease;
    `}
`;

export const StyledInput = styled(Input)`
  width: 200px;
  border-radius: 6px;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
`;

export const StyledTable = styled(Table)`
  margin-top: 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    box-shadow:
      0 8px 24px rgba(0, 0, 0, 0.12),
      0 4px 12px rgba(0, 0, 0, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    transform: translateY(-2px);
  }

  .ant-table-container {
    position: relative;
    border-radius: 12px 12px 0 0;
    overflow: auto;
  }

  .ant-table-content {
    overflow: auto;
  }

  .ant-table-thead > tr > th {
    background: linear-gradient(135deg, #f0f5ff 0%, #e6f4ff 100%);
    color: #1890ff;
    font-weight: 600;
    padding: 16px;
    font-size: 14px;
    border-bottom: 2px solid #bae7ff;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #1890ff 0%, #52c41a 50%, #faad14 100%);
      opacity: 0.5;
    }

    .ant-table-column-sorter {
      color: #1890ff;
      font-size: 12px;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      margin-left: 4px;

      &:hover {
        color: #40a9ff;
        transform: scale(1.1);
      }
    }

    .ant-table-column-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline;
    }
  }

  .ant-table-tbody > tr {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-bottom: 1px solid #f0f0f0;

    &:hover > td {
      background: linear-gradient(135deg, rgba(24, 144, 255, 0.05) 0%, rgba(82, 196, 26, 0.03) 100%) !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
  }

  .ant-table-tbody > tr > td {
    padding: 14px 16px;
    color: #333;
    font-size: 14px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-bottom: 1px solid #f0f0f0;
    white-space: nowrap;
  }

  .ant-table-tbody > tr:last-child > td {
    border-bottom: none;
  }

  .ant-table-selection-column {
    width: 60px;
    text-align: center;

    .ant-checkbox-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .ant-table-cell-fix-right {
    position: sticky !important;
    right: 0;
    z-index: 2;
    background: linear-gradient(135deg, #f0f5ff 0%, #e6f4ff 100%);
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.08);
  }

  .ant-table-pagination.ant-pagination {
    margin: 20px 16px !important;
    padding: 12px 20px;
    background: linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(243, 246, 248, 0.9) 100%);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;

    .ant-pagination-total-text {
      color: #1890ff;
      font-weight: 600;
      margin-right: 16px;
      font-size: 14px;
    }
  }

  .styled-pagination {
    &.ant-pagination {
      color: #666;
    }

    .ant-pagination-item {
      border-radius: 6px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid #d9d9d9;
      background: #fff;

      a {
        color: #666 !important;
        transition: all 0.3s ease;
      }

      &:hover {
        border-color: #1890ff;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);

        a {
          color: #1890ff !important;
        }
      }

      &.ant-pagination-item-active {
        background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
        border-color: #1890ff;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
        transform: translateY(-2px);

        a {
          color: #fff !important;
        }
      }
    }

    .ant-pagination-prev,
    .ant-pagination-next {
      border-radius: 6px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        border-color: #1890ff;
        color: #1890ff;
        transform: translateY(-2px);
      }

      .ant-pagination-item-link {
        border-radius: 6px;
        transition: all 0.3s ease;
      }
    }

    .ant-pagination-jump-prev,
    .ant-pagination-jump-next {
      border-radius: 6px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        color: #1890ff;
      }
    }

    .ant-pagination-options {
      .ant-select-selector {
        border-radius: 6px !important;
        transition: all 0.3s ease;

        &:hover {
          border-color: #1890ff;
        }
      }

      .ant-pagination-options-quick-jumper input {
        border-radius: 6px !important;
        transition: all 0.3s ease;

        &:hover,
        &:focus {
          border-color: #1890ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
      }
    }
  }

  /* 横向滚动条样式 */
  .ant-table-body {
    overflow-x: auto !important;

    &::-webkit-scrollbar {
      height: 8px;
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 4px;

      &:hover {
        background: #a8a8a8;
      }
    }
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .ant-table-thead > tr > th {
      padding: 12px;
      font-size: 13px;
    }

    .ant-table-tbody > tr > td {
      padding: 12px;
      font-size: 13px;
    }

    .ant-table-pagination.ant-pagination {
      margin: 16px !important;
      padding: 10px 16px;
    }
  }
`;

export const ModalTitle = styled.div`
  color: #1890ff;
  font-weight: 600;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 8px;

  &:before {
    content: "";
    display: inline-block;
    width: 4px;
    height: 20px;
    background: linear-gradient(180deg, #1890ff 0%, #52c41a 100%);
    border-radius: 2px;
  }
`;

export const ModalInput = styled(Input)`
  border-radius: 4px;
`;

export const IconWrapper = styled.i`
  margin-right: 5px;
`;

export const RoundedButton = styled(Button)`
  border-radius: 4px;
`;

export const GlobalStyle = styled.div`
  .rounded-button {
    border-radius: 8px;
    height: 36px;
    padding: 0 20px;
    font-weight: 500;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
    }
  }

  /* 防止Modal打开时滚动条消失 */
  &.modal-open body {
    overflow: auto !important;
    padding-right: 0 !important;
  }

  /* Modal 样式优化 */
  .ant-modal-content {
    border-radius: 16px;
    overflow: hidden;
    box-shadow:
      0 24px 48px rgba(0, 0, 0, 0.15),
      0 12px 24px rgba(0, 0, 0, 0.1);
  }

  .ant-modal-header {
    padding: 20px 24px;
    border-bottom: 1px solid #f0f0f0;
    background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  }

  .ant-modal-body {
    padding: 24px;
    max-height: 60vh;
    overflow-y: auto;
  }

  .ant-modal-footer {
    padding: 16px 24px;
    border-top: 1px solid #f0f0f0;
    background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  }
`;
