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
  // console.log('name', name, atob(name))

  if(atob(name) === "erishen,123456"){
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