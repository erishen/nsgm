const express = require('express')
const bcrypt = require('bcrypt')

const router = express.Router()

// 从环境变量获取登录凭证
const getLoginCredentials = () => {
  const username = process.env.LOGIN_USERNAME || 'admin'
  let passwordHash = process.env.LOGIN_PASSWORD_HASH
  
  console.warn('[SSO] getLoginCredentials - username:', username)
  console.warn('[SSO] getLoginCredentials - passwordHash from env:', passwordHash ? `${passwordHash.substring(0, 20)}...` : 'undefined')
  
  // 如果环境变量被截断，尝试手动读取 .env 文件
  if (!passwordHash || passwordHash.length < 60) {
    console.warn('[SSO] passwordHash too short or missing, trying to read from .env')
    try {
      const fs = require('fs')
      const path = require('path')
      const envPath = path.join(process.cwd(), '.env')
      const envContent = fs.readFileSync(envPath, 'utf8')
      
      const lines = envContent.split('\n')
      for (const line of lines) {
        if (line.startsWith('LOGIN_PASSWORD_HASH=')) {
          // 移除引号和前缀
          passwordHash = line.replace('LOGIN_PASSWORD_HASH=', '').replace(/"/g, '').trim()
          console.warn('[SSO] Found passwordHash in .env:', `${passwordHash.substring(0, 20)}...`)
          break
        }
      }
    } catch (error) {
      console.warn('[SSO] 读取 .env 文件失败:', error.message)
    }
  }
  
  if (!passwordHash) {
    console.warn('[SSO] ⚠️  警告: LOGIN_PASSWORD_HASH 环境变量未设置，使用默认密码哈希')
    // 默认密码 "admin123" 的哈希值（仅用于开发环境）
    return {
      username,
      passwordHash: '$2b$10$K5O.TJLKGPmKGHJK8KzN5u8qUYKzq5vLcXlP7vGUzq5vLcXlP7vGUz'
    }
  }
  
  console.warn('[SSO] getLoginCredentials - final passwordHash:', `${passwordHash.substring(0, 20)}...`)
  return { username, passwordHash }
}

// 验证用户凭证
const validateCredentials = async (inputUsername, inputPassword) => {
  const { username, passwordHash } = getLoginCredentials()
  
  if (inputUsername !== username) {
    return false
  }
  
  try {
    return await bcrypt.compare(inputPassword, passwordHash)
  } catch (error) {
    console.error('密码验证失败:', error)
    return false
  }
}

router.get('/sessionCheck', (req, res) => {
  const { query } = req
  // const { cookieValue, redirectUrl, appId } = query

  res.json({
    name: 'sessionCheck',
    query,
    returnCode: 0,
    userAttr: {
      displayName: "System Admin"
    }
  })
})

router.get('/ticketCheck', async (req, res) => {
  const { query } = req
  const { name } = query
  
  console.warn('[SSO] ticketCheck called, name:', name)
  
  try {
    // 使用 Buffer 解码 Base64 字符串，然后使用 decodeURIComponent 处理特殊字符
    const decodedBase64 = Buffer.from(name, 'base64').toString('utf-8')
    console.warn('[SSO] Decoded Base64:', decodedBase64)
    
    const decodedName = decodeURIComponent(decodedBase64)
    console.warn('[SSO] Decoded name:', decodedName)
    
    const [inputUsername, inputPassword] = decodedName.split(',')
    console.warn('[SSO] Input username:', inputUsername, 'password length:', inputPassword?.length)
    
    const { username: expectedUsername, passwordHash } = getLoginCredentials()
    console.warn('[SSO] Expected username:', expectedUsername, 'passwordHash length:', passwordHash?.length)
    
    const isValid = await validateCredentials(inputUsername, inputPassword)
    console.warn('[SSO] Credentials valid:', isValid)
    
    if (isValid) {
      console.warn('[SSO] Login successful for user:', inputUsername)
      res.json({
        name: 'ticketCheck',
        query,
        returnCode: 0,
        userAttr: {
          displayName: "System Admin",
          username: inputUsername
        },
        cookieValue: 'login_cookie_' + Date.now(),
        cookieExpire: 7200000 // 2小时
      })
    } else {
      // 记录失败的登录尝试（用于安全审计）
      console.warn(`[SSO] 登录失败 - 用户名: ${inputUsername}, 时间: ${new Date().toISOString()}, IP: ${req.ip}`)
      
      res.json({
        name: 'ticketCheck',
        query,
        returnCode: -1,
        message: '用户名或密码错误'
      })
    }
  } catch (error) {
    console.warn('[SSO] 登录验证出错:', error)
    res.status(500).json({
      name: 'ticketCheck',
      returnCode: -1,
      message: '服务器内部错误'
    })
  }
})

module.exports = router