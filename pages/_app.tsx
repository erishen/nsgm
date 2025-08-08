import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { useStore } from '@/redux/store'
import { GlobalStyle, Loading } from '@/styled/common'
import LayoutComponent from '@/layout'
import { login } from '@/utils/sso'
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
  const [loginChecked, setLoginChecked] = useState(false)

  useEffect(() => {
    // 检查当前路径是否为登录页
    const isLoginPage = typeof window !== 'undefined' && window.location.pathname === '/login'

    // 如果是登录页，直接设置加载完成
    if (isLoginPage) {
      setLoginChecked(true)
      setPageLoad(true)
      return
    }

    // 检查是否有登录凭证
    const hasLoginCookie = typeof window !== 'undefined' && document.cookie.includes('_cas_nsgm')

    // 如果没有登录凭证，直接跳转到登录页面
    if (!hasLoginCookie && typeof window !== 'undefined') {
      window.location.href = `${window.location.origin}/login`
      return
    }

    // 否则执行登录检查
    login((user: any) => {
      if (user) {
        setSsoUser(user)
      }
      setLoginChecked(true)
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
          {!loginChecked ? (
            <Loading>
              <Spin size="large" />
            </Loading>
          ) : pageLoad ? (
            ssoUser ? (
              <LayoutComponent user={ssoUser}>
                <Component {...pageProps} />
              </LayoutComponent>
            ) : (
              <Component {...pageProps} />
            )
          ) : (
            <Loading>
              <Spin size="large" />
            </Loading>
          )}
        </Provider>
      </ThemeProvider>
    </>
  )
}

App.getInitialProps = async ({ Component, ctx }) => {
  return {
    pageProps: await Component?.getInitialProps(ctx)
  }
}

export default App
