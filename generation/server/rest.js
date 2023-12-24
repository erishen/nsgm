const express = require('express')
const moment = require('moment')
const sso = require('./apis/sso')
//const template = require('./apis/template')

const router = express.Router()

router.use((req, res, next) => {
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
    console.log(moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + fullUrl)
    next()
})

router.use('/sso', sso)

//router.use('/template', template)

router.get('/*', (req, res) => {
    res.statusCode = 200
    res.json({ name: 'REST' })
})

module.exports = router
