import axios from 'axios'
import { setCookie, getCookie, delCookie } from './cookie'
import { getUrlParamByKey, getLocalApiPrefix, getLocalEnv } from './common'
import _ from 'lodash'

const env = getLocalEnv()

const LOGIN_COOKIE_ID = env + '_cas_nsgm'
const LOGIN_COOKIE_USER = env + '_nsgm_user'

const getPrincipalUrl = () => { 
  const url = getLocalApiPrefix() + '/rest/sso/sessionCheck'
  return url
}

const getValidateUrl = () => { 
  const url = getLocalApiPrefix() + '/rest/sso/ticketCheck'
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
          
          _.each(paramArr, (item, index) => {
            if (item.indexOf('=') !== -1) {
              const itemArr = item.split('=')
              const itemArrLen = itemArr.length

              const key = itemArr[0]
              let value = ''
              if (itemArrLen > 1)
                value = itemArr[1]
              
              if ('ticket' !== key) {
                newParamStr += key + '=' + value + '&'
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
      if(newParamStr !== '')
        newHref = locationHrefArrFirst + '?' + newParamStr
      else
        newHref = locationHrefArrFirst
    } else { 
      newHref = locationHref
    }
  }

  // console.log('newHref', newHref)
  return encodeURIComponent(newHref)
}

const jumpToLogin = () => { 
  delCookie(LOGIN_COOKIE_ID)
  delCookie(LOGIN_COOKIE_USER)
  
  if (typeof window !== 'undefined') {
    window.location.href = window.location.origin + '/login'
  }
}

const jumpToLogout = () => { 
  delCookie(LOGIN_COOKIE_ID)
  delCookie(LOGIN_COOKIE_USER)
  
  if (typeof window !== 'undefined') {
    window.location.href = window.location.origin
  }
}

const principalLogin = (cookie:string, callback:any) => { 
  let url = getPrincipalUrl()

  if (typeof window !== 'undefined') {
    url += '?cookieValue=' + cookie + '&redirectUrl=' + handleLocationHref()
  }

  console.log('principalLogin_url', url)
  axios.get(url, { params: { credentials: 'include' } }).then((res:any) => {
    console.log('principalLogin_res', res)
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
  }).catch((e) => {
    console.log('principalLogin_exception', e)
    jumpToLogin()
  })
}

const storeLoginUser = (userAttr:any, callback:any) => { 
  console.log('storeLoginUser', userAttr)

  if (userAttr) {
    const user = JSON.stringify(userAttr, ['city', 'company', 'department', 'displayName', 'employee', 'mail', 'name', 'sn'])
    setCookie(LOGIN_COOKIE_USER, user, null)
    callback && callback(JSON.parse(user))
  } else { 
    callback && callback()
  }
}

const storeLogin = (cookie:any, cookieExpire:any, userAttr:any, callback:any) => { 
  console.log('storeLogin_cookie', cookie)

  if (cookie) { 
    setCookie(LOGIN_COOKIE_ID, cookie, cookieExpire)
  }

  storeLoginUser(userAttr, callback)
}

const validateLogin = (ticket:string, name:string = '', callback:any) => { 
  let url = getValidateUrl()

  if (typeof window !== 'undefined') {
    url += '?ticket=' + ticket

    if(name !== ''){
      url += '&name=' + name
    }
  }
  
  console.log('validateLogin_url', url)
  axios.get(url, { params: { credentials: 'include' } }).then((res:any) => {
    console.log('validateLogin_res', res)

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
  }).catch((e) => {
    console.log('validateLogin_exception', e)
  })
}

export const login = (callback:any) => { 
  const cookieLoginValue = getCookie(LOGIN_COOKIE_ID)
  console.log('cookieLoginValue', cookieLoginValue)

  if(typeof window !== 'undefined'){
    const locationHref = window.location.href

    if(locationHref.indexOf('/login') === -1){

      if (cookieLoginValue !== '') {
        principalLogin(cookieLoginValue, callback)
      } else { 
        const urlParamTicket = getUrlParamByKey('ticket')
        const urlParamName = getUrlParamByKey('name')
        console.log('urlParamTicket', urlParamTicket, urlParamName)

        if (urlParamTicket !== '') {
          validateLogin(urlParamTicket, urlParamName, callback)
        } else { 
          jumpToLogin()
        }
      }
    }
  }
}

export const logout = () => { 
  jumpToLogout()
}

