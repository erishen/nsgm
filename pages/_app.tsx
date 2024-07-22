import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { useStore } from '../client/redux/store'
import { GlobalStyle, Loading } from '../client/styled/common'
import LayoutComponent from '../client/layout'
import { login } from '../client/utils/sso'
import { Spin } from 'antd'
import 'antd/dist/reset.css'

const theme = {
  colors: {
    primary: '#0070f3'
  }
}

const App = ({ Component, pageProps }) => {
  const store = useStore(pageProps.initialReduxState)
  const [ssoUser, setSsoUser] = useState(null)
  const [pageLoad, setPageLoad] = useState(false)

  useEffect(() => {
    login((user: any) => {
      if (user) {
        // console.log('checkLogin_user', user)
        setSsoUser(user)
      }
    })

    setTimeout(() => {
      setPageLoad(true)
    }, 100)
  }, [])

  return (
    <>
      <GlobalStyle whiteColor={true} />
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          {
            pageLoad ?
              ssoUser ? <LayoutComponent user={ssoUser}>
                <Component {...pageProps} />
              </LayoutComponent> :
                <Component {...pageProps} /> :
              <Loading>
                <Spin size="large" />
              </Loading>
          }
        </Provider>
      </ThemeProvider>
    </>
  )
}

App.getInitialProps = async ({ Component, ctx }) => {
  // console.log('app_ctx', ctx)

  return {
    pageProps: await Component?.getInitialProps(ctx)
  }
}

export default App