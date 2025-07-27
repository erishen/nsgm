import MarkdownIt from 'markdown-it'
import _ from 'lodash'
import { LoginContainer } from '../client/styled/common'
// import getConfig from 'next/config'
import React, { useState } from 'react'
import { getLocalEnv } from '../client/utils/common'
import { Input, Button, Form, Typography, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { directLogin } from '../client/utils/sso'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

// const nextConfig = getConfig()
// const { publicRuntimeConfig } = nextConfig
// const { env } = publicRuntimeConfig

const renderArr: any = []

renderArr.push('Login')

const Page = ({ html }) => {
  const [userName, setUserName] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const env = getLocalEnv()
  const LOGIN_COOKIE_ID = env + '_cas_nsgm'
  const LOGIN_COOKIE_USER = env + '_nsgm_user'

  const createMarkup = () => {
    return {
      __html: html
    }
  }

  const doLogin = () => {
    if (typeof window !== "undefined") {
      if (userName === '') {
        message.error('请输入用户名');
        return;
      }
      if (userPassword === '') {
        message.error('请输入密码');
        return;
      }

      directLogin(userName, userPassword, (user) => {
        if (user) {
          window.location.href = window.location.origin;
        }
      }).then(result => {
        if (!result.success) {
          message.error(result.message);
        }
      });
    }
  }

  const doChangeName = (e) => {
    setUserName(_.trim(e.target.value))
  }

  const doChangePassword = (e) => {
    setUserPassword(_.trim(e.target.value))
  }

  return (
    <LoginContainer>
      <div dangerouslySetInnerHTML={createMarkup()} />
      <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>系统登录</Typography.Title>
      <Form layout="vertical" style={{ width: '100%' }}>
        <Form.Item>
          <Input
            prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="用户名"
            size="large"
            value={userName}
            onChange={doChangeName}
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item>
          <Input.Password
            prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="密码"
            size="large"
            value={userPassword}
            onChange={doChangePassword}
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={doLogin} size="large" block>
            登录
          </Button>
        </Form.Item>
      </Form>
    </LoginContainer>
  )
}

Page.getInitialProps = () => {
  let html = ''
  _.each(renderArr, (item, index) => {
    html += md.render(item)
  })

  console.log("Generated HTML:", html);

  return {
    html
  }
}

export default Page