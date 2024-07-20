const express = require('express')
const ExcelJS = require('exceljs')
const { templateBatchAdd } = require('../modules/template/resolver')
const router = express.Router()

router.post('/import', async (req, res) => {
    // console.log('files', req.files)
    // 从上传的文件读取数据
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.files.file.data);

    // 假设你想读取第一个工作表
    const worksheet = workbook.worksheets[0];

    // 获取表头
    const headers = [];
    worksheet.getRow(1).eachCell((cell, colNumber) => {
        headers[colNumber] = cell.value.toLowerCase();
    });

    // 获取数据
    const jsonData = [];
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber === 1) return; // 跳过表头行

        const rowData = {};
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            rowData[headers[colNumber]] = cell.value;
        });
        jsonData.push(rowData);
    });

    // console.log('jsonData', jsonData)
    templateBatchAdd({ datas: jsonData })
    res.json({ name: 'Template' })
})

module.exports = router