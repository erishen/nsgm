const express = require('express')
const XLSX = require('xlsx')
const { templateBatchAdd } = require('../modules/template/resolver')
const router = express.Router()

router.post('/import', (req, res) => {
    //console.log('files', req.files)
    const workbook = XLSX.read(req.files.file.data, { type: "buffer" })
    //console.log('Sheets', workbook.Sheets)

    const datas = XLSX.utils.sheet_to_json(workbook.Sheets["Template"])
    //console.log('datas', datas)

    templateBatchAdd({ datas })
    res.json({ name: 'Template' })
})

module.exports = router