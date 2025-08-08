import axios from 'axios'
import { setCookie, getCookie, delCookie } from './cookie'
import { getUrlParamByKey, getLocalApiPrefix, getLocalEnv, handleXSS } from './common'
import _ from 'lodash'

const env = getLocalEnv()

const LOGIN_COOKIE_ID = `${env}_cas_nsgm`
const LOGIN_COOKIE_USER = `${env}_nsgm_user`

const getPrincipalUrl = () => {
  const url = `${getLocalApiPrefix()}/rest/sso/sessionCheck`
  return url
}

const getValidateUrl = () => {
  const url = `${getLocalApiPrefix()}/rest/sso/ticketCheck`
  return url
}

const handleLocationHref = () => {
  let newHref = ''
  if (typeof window !== 'undefined') {
    const locationHref = window.location.href
    if (locationHref.indexOf('?') !== -1) {
      const locationHrefArr = locationHref.split('?')
      const locationHrefArrLen = locationHrefArr.length

      let newParamStr = ''

      if (locationHrefArrLen > 1) {
        const paramStr = locationHrefArr[1]
        if (paramStr.indexOf('&') !== -1) {
          const paramArr = paramStr.split('&')

          _.each(paramArr, (item) => {
            if (item.indexOf('=') !== -1) {
              const itemArr = item.split('=')
              const itemArrLen = itemArr.length

              const key = itemArr[0]
              let value = ''
              if (itemArrLen > 1) value = itemArr[1]

              if ('ticket' !== key) {
                newParamStr += `${key}=${value}&`
              }
            }
          })

          newParamStr = newParamStr.substring(0, newParamStr.length - 1)
        } else {
          if (paramStr.indexOf('ticket') === -1) {
            newParamStr = paramStr
          }
        }
      }

      const locationHrefArrFirst = locationHrefArr[0]
      if (newParamStr !== '') newHref = `${locationHrefArrFirst}?${newParamStr}`
      else newHref = locationHrefArrFirst
    } else {
      newHref = locationHref
    }
  }
  return encodeURIComponent(newHref)
}

const jumpToLogin = () => {
  delCookie(LOGIN_COOKIE_ID)
  delCookie(LOGIN_COOKIE_USER)

  if (typeof window !== 'undefined') {
    window.location.href = `${window.location.origin}/login`
  }
}

const principalLogin = (cookie: string, callback: any) => {
  let url = getPrincipalUrl()

  if (typeof window !== 'undefined') {
    url += `?cookieValue=${cookie}&redirectUrl=${handleLocationHref()}`
  }

  axios
    .get(url, { params: { credentials: 'include' } })
    .then((res: any) => {
      const { data } = res
      if (data) {
        const { returnCode, userAttr } = data
        if (returnCode !== 0) {
          jumpToLogin()
        } else {
          storeLoginUser(userAttr, callback)
        }
      } else {
        jumpToLogin()
      }
    })
    .catch((e) => {
      console.error('principalLogin_exception', e)
      jumpToLogin()
    })
}

const storeLoginUser = (userAttr: any, callback: any) => {
  if (userAttr) {
    const user = JSON.stringify(userAttr, [
      'city',
      'company',
      'department',
      'displayName',
      'employee',
      'mail',
      'name',
      'sn'
    ])
    setCookie(LOGIN_COOKIE_USER, user, null)
    callback?.(JSON.parse(user))
  } else {
    callback?.()
  }
}

const storeLogin = (cookie: any, cookieExpire: any, userAttr: any, callback: any) => {
  if (cookie) {
    setCookie(LOGIN_COOKIE_ID, cookie, cookieExpire)
  }

  storeLoginUser(userAttr, callback)
}

const validateLogin = (ticket: string, name = '', callback: any) => {
  let url = getValidateUrl()

  if (typeof window !== 'undefined') {
    url += `?ticket=${ticket}`

    if (name !== '') {
      url += `&name=${name}`
    }
  }

  axios
    .get(url, { params: { credentials: 'include' } })
    .then((res: any) => {
      if (res) {
        const { data } = res
        if (data) {
          const { cookieValue, cookieExpire, returnCode, userAttr } = data
          if (returnCode === 0) {
            storeLogin(cookieValue, cookieExpire, userAttr, callback)
          } else {
            jumpToLogin()
          }
        } else {
          jumpToLogin()
        }
      } else {
        jumpToLogin()
      }
    })
    .catch((e) => {
      console.error('validateLogin_exception', e)
    })
}

export const login = (callback: any) => {
  const cookieLoginValue = getCookie(LOGIN_COOKIE_ID)

  if (typeof window !== 'undefined') {
    const locationHref = window.location.href

    // 如果已经在登录页面，不需要进行登录检查
    if (locationHref.indexOf('/login') !== -1) {
      callback?.()
      return
    }

    // 如果没有登录凭证，立即跳转到登录页面
    if (cookieLoginValue === '') {
      const urlParamTicket = getUrlParamByKey('ticket')
      const urlParamName = getUrlParamByKey('name')

      if (urlParamTicket !== '') {
        validateLogin(urlParamTicket, urlParamName, callback)
      } else {
        // 没有ticket参数，直接跳转到登录页
        jumpToLogin()
        // 不执行回调，因为页面将被重定向
        return
      }
    } else {
      // 有登录凭证，验证登录状态
      principalLogin(cookieLoginValue, callback)
    }
  } else {
    callback?.()
  }
}

export const directLogin = (userName: string, userPassword: string, callback: any) => {
  if (userName === '') {
    return { success: false, message: '请输入用户名' }
  }
  if (userPassword === '') {
    return { success: false, message: '请输入密码' }
  }

  // 使用 encodeURIComponent 处理可能的特殊字符，然后再进行 Base64 编码
  const safeStr = handleXSS(`${userName},${userPassword}`)
  const encodedName = btoa(encodeURIComponent(safeStr))
  const url = `${getLocalApiPrefix()}/rest/sso/ticketCheck?ticket=XXX&name=${encodedName}`

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data && data.returnCode === 0) {
        // 登录成功，设置cookie
        if (typeof window !== 'undefined') {
          storeLogin(data.cookieValue, data.cookieExpire, data.userAttr, callback)
          return { success: true }
        }
      }
      return { success: false, message: '用户名或密码错误' }
    })
    .catch((error) => {
      console.error('登录请求失败:', error)
      return { success: false, message: '登录请求失败，请稍后重试' }
    })
}

export const logout = () => {
  jumpToLogin()
}
