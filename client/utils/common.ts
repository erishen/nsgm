import getConfig from 'next/config'
import _ from 'lodash'

export const getLocalEnv = () => { 
  const nextConfig = getConfig()
  const { publicRuntimeConfig } = nextConfig
  let { env = 'uat' } = publicRuntimeConfig
  env = env.toLowerCase()
  return env
}

export const getLocalApiPrefix = () => {
  const nextConfig = getConfig()
  const { publicRuntimeConfig } = nextConfig
  let { protocol, host, port, prefix, isExport } = publicRuntimeConfig

  let localApiPrefix = ''
  
  if(!isExport){
    if (typeof window !== 'undefined') { 
      const location = window.location
      // console.log('location', location)

      protocol = location.protocol
      if (protocol.indexOf(':') != -1) { 
        protocol = protocol.split(':')[0]
      }
      host = location.hostname
      port = location.port || (protocol.indexOf('https') !== -1 ? "443" : "80")
    }
  } 

  localApiPrefix = protocol + '://' + host + ':' + port + prefix
  // console.log('localApiPrefix', localApiPrefix)
  return localApiPrefix
}

export const handleXSS = (content: string) => {
  content = content || ''
  return content.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/\'/g, '&#x27;')
}

export const checkModalObj = (modalObj: {}, ignoreKeys: any = []) => {
  let result: any = null
  _.each(modalObj, (value: any, key: string) => {
    // console.log('checkModalObj', ignoreKeys, key, ignoreKeys.join('.').indexOf(key))
    if (ignoreKeys.length === 0 || (ignoreKeys.length !== 0 && ignoreKeys.join('.').indexOf(key) === -1)) {
      if (_.trim(value) === '') {
        result = {
          key,
          reason: '不能为空'
        }
        return false
      }
    }
  })
  return result
}

export const getUrlParamByKey = (key: string) => { 
  let result = ''
  if (typeof window !== 'undefined') {
    const locationHref = window.location.href
    if (locationHref.indexOf('?') !== -1) { 
      const locationHrefArr = locationHref.split('?')
      if (locationHrefArr.length > 1) { 
        const paramsStr = locationHrefArr[1]

        let params:any = []
        if (paramsStr.indexOf('&') !== -1) {
          params = paramsStr.split('&')
        } else { 
          params.push(paramsStr)
        }
        
        _.each(params, (item, index) => { 
          if (item.indexOf('=') !== -1) { 
            const itemArr = item.split('=')
            if (itemArr[0] === key) { 
              result = itemArr[1]
              return false
            }
          }
        })
      }
    }
  }
  return result
}
