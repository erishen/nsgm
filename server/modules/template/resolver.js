const { getConnection } = require('../../utils/common')
const _ = require('lodash')

module.exports = {
    template: ({ page = 0, pageSize = 10 }) => {
        return new Promise((resolve, reject)=>{
            getConnection().then((connection)=>{
                const sql = 'SELECT id, name from template LIMIT ? OFFSET ?'
                const countSql = 'SELECT count(*) as counts from template'
                const values = [pageSize, page * pageSize]

                console.log('sql', sql, values, countSql)

                connection.query(sql, values, (error, results, fields) => {
                    if (error) throw error
                    console.log('results', results)
                    
                    connection.query(countSql, (countError, countResults, countFields) => {
                        if (countError) throw countError
                        const totalCounts = countResults[0].counts
                        console.log('totalCounts', totalCounts)

                        resolve({
                            totalCounts,
                            items: results
                        })
                        connection.end()
                    })
                })
            })
        })
    }, 
    templateGet: ({ id }) => {
        console.log('templateGet', id)
        return new Promise((resolve, reject)=>{
            getConnection().then((connection)=>{
                let sql = 'SELECT id, name from template WHERE 1=1'
                let values = []

                if(id !== undefined){
                    sql += ' AND id=? '
                    values.push(id)
                } 

                console.log('sql', sql, values)
                connection.query(sql, values, (error, results, fields) => {
                    if (error) throw error
                    console.log('results', results)

                    if(results.length > 0)
                        resolve(results[0])
                    else
                        reject()
                    connection.end()
                })
            })
        })
    },
    templateSearch: ({ page = 0, pageSize = 10, data }) => {
        console.log('templateSearch', page, pageSize, data)
        const { name } = data
        return new Promise((resolve, reject)=>{
            getConnection().then((connection)=>{
                const values = []
                const countsValues = []

                let whereSql = ''
                if(name !== undefined && name !== ''){
                    whereSql += ' AND name like ? '
                    values.push('%' + name + '%')
                    countsValues.push('%' + name + '%')
                }

                const sql = 'SELECT id, name from template WHERE 1=1 ' + whereSql + ' LIMIT ? OFFSET ?'
                const countSql = 'SELECT count(*) as counts from template WHERE 1=1 ' + whereSql

                values.push(pageSize)
                values.push(page * pageSize)
                
                console.log('sql', sql, values, countSql)

                connection.query(sql, values, (error, results, fields) => {
                    if (error) throw error
                    console.log('results', results)
                    
                    connection.query(countSql, countsValues, (countError, countResults, countFields) => {
                        if (countError) throw countError
                        const totalCounts = countResults[0].counts
                        console.log('totalCounts', totalCounts)

                        resolve({
                            totalCounts,
                            items: results
                        })
                        connection.end()
                    })
                })
            })
        })
    }, 
    templateAdd: ({ data }) => {
        console.log('templateAdd', data)
        const { name } = data
        return new Promise((resolve, reject)=>{
            getConnection().then((connection)=>{

                let sql = 'INSERT INTO template (name) values (?)'
                let values = [name]
                
                console.log('sql', sql, values)
                connection.query(sql, values, (error, results, fields) => {
                    if (error) throw error
                    console.log('results', results)

                    resolve(results.insertId)
                    connection.end()
                })
            })
        })
    },
    templateBatchAdd: ({ datas }) => {
        console.log('templateBatchAdd', datas)
        return new Promise((resolve, reject)=>{
            getConnection().then((connection)=>{

                let sql = 'INSERT INTO template (name) values '
                let values = []

                _.each(datas, (item, index)=>{
                    sql += '(?),'
                    const { name } = item
                    values.push(name)
                })

                sql = sql.substring(0, sql.length - 1)
                
                console.log('sql', sql, values)
                connection.query(sql, values, (error, results, fields) => {
                    if (error) throw error
                    console.log('results', results)

                    resolve(results.insertId)
                    connection.end()
                })
            })
        })
    },
    templateUpdate: ({ id, data }) => {
        console.log('templateUpdate', id, data)
        const { name } = data
        return new Promise((resolve, reject)=>{
            getConnection().then((connection)=>{
                let sql = 'UPDATE template SET'
                let values = []

                if(name !== undefined){
                    sql += ' name=?, '
                    values.push(name)
                }

                sql += ' id=? WHERE id=? '
                values.push(id)
                values.push(id)

                console.log('sql', sql, values)
                connection.query(sql, values, (error, results, fields) => {
                    if (error) throw error
                    console.log('results', results)

                    resolve(true)
                    connection.end()
                })
            })
        })
    },
    templateDelete: ({ id }) => {
        console.log('templateDelete', id)
        return new Promise((resolve, reject)=>{
            getConnection().then((connection)=>{
                const sql = 'DELETE FROM template WHERE id=?'
                const values = [id]
                console.log('sql', sql, values)

                connection.query(sql, values, (error, results, fields) => {
                    if (error) throw error
                    console.log('results', results)

                    resolve(true)
                    connection.end()
                })
            })
        })
    },
    templateBatchDelete: ({ ids }) => {
        console.log('templateBatchDelete', ids)
        return new Promise((resolve, reject)=>{
            getConnection().then((connection)=>{
                let sql = 'DELETE FROM template WHERE id in ('

                const idsLen = ids.length

                if(idsLen > 0){
                    for(let i = 0; i < idsLen; i++){
                        sql += '?,'
                    }
    
                    sql = sql.substring(0, sql.length - 1)
                    sql += ')'
    
                    const values = ids
                    console.log('sql', sql, values)
    
                    connection.query(sql, values, (error, results, fields) => {
                        if (error) throw error
                        console.log('results', results)
    
                        resolve(true)
                        connection.end()
                    })
                }
                else 
                    reject()
            })
        })
    }
}