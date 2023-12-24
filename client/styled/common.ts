import styled, { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  html,body,#__next {
    height: 100%;
    border: 1px solid white;
  }

  body {
    background-color: ${(props: any) => (props.whiteColor ? 'white' : 'black')};
    font-family: Helvetica;
    margin: 0;
  }
`

export const Container = styled.div`
  margin: 20px;
`

export const LoginContainer = styled.div`
   margin: auto;
   margin-top: 200px;
   width: 250px;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: flex-start;
   border: 1px solid gray;
   border-radius: 5px;
   padding: 20px;

  .row {
    width: 100%;
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    .user-input {
      width: 210px;
      margin-bottom: 5px;
    }
  }

  .right {
    margin-top: 10px;
    justify-content: flex-end;
  }
`

export const Loading = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
`

