const express = require('express')
const dayjs = require('dayjs')
const sso = require('./apis/sso')
//const template = require('./apis/template')

const router = express.Router()

router.use((req, res, next) => {
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
    console.log(dayjs().format('YYYY-MM-DD HH:mm:ss') + ' ' + fullUrl)
    next()
})

router.use('/sso', sso)

//router.use('/template', template)

router.get('/*', (req, res) => {
    res.statusCode = 200
    res.json({ name: 'REST' })
})

module.exports = router
