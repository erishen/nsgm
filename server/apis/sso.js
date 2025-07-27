const express = require('express')

const router = express.Router()

router.get('/sessionCheck', (req, res) => {
  const { query } = req
  const { cookieValue, redirectUrl, appId } = query

  res.json({
    name: 'sessionCheck',
    query,
    returnCode: 0,
    userAttr: {
      displayName: "Erishen"
    }
  })
})

router.get('/ticketCheck', (req, res) => {
  const { query } = req
  const { ticket, name } = query
  // 使用 Buffer 解码 Base64 字符串，然后使用 decodeURIComponent 处理特殊字符
  const decodedBase64 = Buffer.from(name, 'base64').toString('utf-8')
  const decodedName = decodeURIComponent(decodedBase64)

  console.log('name', name, decodedName)

  if (decodedName === "erishen,123456") {
    res.json({
      name: 'ticketCheck',
      query,
      returnCode: 0,
      userAttr: {
        displayName: "Erishen"
      },
      cookieValue: 'login_cookie',
      cookieExpire: 10000
    })
  } else {
    res.json({
      name: 'ticketCheck',
      query,
      returnCode: -1
    })
  }
})

module.exports = router