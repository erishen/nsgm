import MarkdownIt from 'markdown-it'
import _ from 'lodash'
import { LoginContainer } from '../client/styled/common'
// import getConfig from 'next/config'
import React, { useState } from 'react'
import { handleXSS } from '../client/utils/common'

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

  const createMarkup = () => {
    return {
      __html: html
    }
  }

  const doLogin = () => {
    if (typeof window !== "undefined") {
      let locationHref = window.location.origin + "?ticket=XXX"
      if (userName !== '') {
        locationHref += "&name=" + btoa(handleXSS(userName + "," + userPassword))
        window.location.href = locationHref
      }
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
      <input type="text" style={{ opacity: 0, position: "absolute", width: 0, height: 0 }}></input>
      <input type="password" style={{ opacity: 0, position: "absolute", width: 0, height: 0 }}></input>
      <div className='row'>
        <input type="text" name="user-name" className='user-input' autoComplete='off' onChange={doChangeName} value={userName}></input>
      </div>
      <div className='row'>
        <input type="password" name="user-password" className='user-input' autoComplete='off' onChange={doChangePassword} value={userPassword}></input>
      </div>
      <div className='row right'>
        <button onClick={doLogin}>login</button>
      </div>
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