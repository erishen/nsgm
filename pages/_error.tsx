import React from 'react'
import { Result, Button } from 'antd'
import { NextPageContext } from 'next'

interface ErrorProps {
  statusCode?: number
}

function ErrorPage({ statusCode }: ErrorProps) {
  const getErrorMessage = () => {
    if (statusCode === 404) {
      return '页面未找到'
    } else if (statusCode === 500) {
      return '服务器错误'
    }
    return '发生了未知错误'
  }

  const getErrorTitle = () => {
    if (statusCode === 404) {
      return '404'
    } else if (statusCode === 500) {
      return '500'
    }
    return '错误'
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <Result
        status={statusCode === 404 ? '404' : '500'}
        title={getErrorTitle()}
        subTitle={getErrorMessage()}
        extra={
          <Button
            type="primary"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = '/'
              }
            }}
          >
            返回首页
          </Button>
        }
      />
    </div>
  )
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

ErrorPage.displayName = 'ErrorPage'

export default ErrorPage
