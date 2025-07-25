import styled from 'styled-components'

export const Container = styled.div`
  margin: 20px;
  
  .ant-table {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s ease;
    
    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }
  }
  
  .table-row-light {
    background-color: #ffffff;
  }
  
  .table-row-dark {
    background-color: #f9f9f9;
  }
  
  .ant-table-thead > tr > th {
    background-color: #f0f5ff;
    color: #1890ff;
    font-weight: 500;
    padding: 12px 16px;
  }
  
  .ant-table-tbody > tr > td {
    padding: 12px 16px;
    transition: background-color 0.3s;
  }
  
  .page-title {
    font-size: 24px;
    font-weight: 500;
    color: #1890ff;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 100px;
      height: 3px;
      background: linear-gradient(90deg, #1890ff, #69c0ff);
      border-radius: 3px;
    }
  }
`

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
`

export const ModalContainer = styled.div`
  .line {
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    height: 50px;
    margin-bottom: 16px;

    label {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      width: 80px;
      height: 32px;
      margin-right: 16px;
      font-weight: 500;
      color: #333;
      position: relative;
      
      &:after {
        content: '';
        position: absolute;
        left: -8px;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 16px;
        background: #1890ff;
        border-radius: 3px;
      }
    }

    input {
      flex: 1;
      border-radius: 6px;
      transition: all 0.3s ease;
      
      &:hover, &:focus {
        border-color: #40a9ff;
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
      }
    }

    .row {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      .item {
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
      }
    }
  }
`