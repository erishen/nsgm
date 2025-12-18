import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  html,body,#__next {
    height: 100%;
  }

  body {
    background-color: ${(props: any) => (props.whiteColor ? "white" : "black")};
    font-family: Helvetica;
    margin: 0;
  }
`;

export const Container = styled.div`
  margin: 20px;
`;

export const LoginContainer = styled.div`
  margin: auto;
  margin-top: 100px;
  width: 350px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;

  .ant-form-item {
    margin-bottom: 20px;
  }

  .ant-input-affix-wrapper {
    border-radius: 4px;
  }

  .ant-btn {
    height: 40px;
    border-radius: 4px;
  }
`;

export const Loading = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
`;
