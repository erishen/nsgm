import styled from 'styled-components'

export const Container = styled.div`
  margin: 20px;
`

export const SearchRow = styled.div`
  margin: 10px;
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const ModalContainer = styled.div`
  .line {
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    height: 50px;

    label {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      width: 80px;
      height: 32px;
      margin-right: 5px;
    }

    input {
      flex: 1;
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