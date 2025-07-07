const { executeQuery, executePaginatedQuery } = require('../../utils/common')

// 输入验证函数
const validatePagination = (page, pageSize) => {
    if (page < 0 || pageSize <= 0 || pageSize > 100) {
        throw new Error('分页参数无效');
    }
};

const validateId = (id) => {
    if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
        throw new Error('ID参数无效');
    }
};

const validateName = (name) => {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        throw new Error('名称参数无效');
    }
};

module.exports = {
    // 获取模板列表（分页）
    template: async ({ page = 0, pageSize = 10 }) => {
        try {
            // 确保参数是数字类型
            const pageNum = parseInt(page, 10) || 0;
            const pageSizeNum = parseInt(pageSize, 10) || 10;
            
            validatePagination(pageNum, pageSizeNum);
            
            const sql = 'SELECT id, name FROM template LIMIT ? OFFSET ?';
            const countSql = 'SELECT COUNT(*) as counts FROM template';
            const values = [pageSizeNum, pageNum * pageSizeNum];

            console.log('执行分页查询:', { 
                sql, 
                values, 
                valueTypes: values.map(v => typeof v),
                countSql 
            });
            
            return await executePaginatedQuery(sql, countSql, values);
        } catch (error) {
            console.error('获取模板列表失败:', error.message);
            throw error;
        }
    }, 
    // 根据ID获取模板
    templateGet: async ({ id }) => {
        try {
            validateId(id);
            
            const sql = 'SELECT id, name FROM template WHERE id = ?';
            const values = [id];

            console.log('根据ID查询模板:', { sql, values });
            
            const results = await executeQuery(sql, values);
            
            if (results.length === 0) {
                throw new Error(`ID为 ${id} 的模板不存在`);
            }
            
            return results[0];
        } catch (error) {
            console.error('获取模板失败:', error.message);
            throw error;
        }
    },

    // 搜索模板（分页）
    templateSearch: async ({ page = 0, pageSize = 10, data = {} }) => {
        try {
            validatePagination(page, pageSize);
            
            const { name } = data;
            const values = [];
            const countValues = [];
            
            let whereSql = '';
            if (name && name.trim() !== '') {
                whereSql = ' AND name LIKE ?';
                const namePattern = `%${name.trim()}%`;
                values.push(namePattern);
                countValues.push(namePattern);
            }

            const sql = `SELECT id, name FROM template WHERE 1=1${whereSql} LIMIT ? OFFSET ?`;
            const countSql = `SELECT COUNT(*) as counts FROM template WHERE 1=1${whereSql}`;
            
            values.push(pageSize, page * pageSize);
            
            console.log('搜索模板:', { sql, values, countSql, countValues });
            
            return await executePaginatedQuery(sql, countSql, values, countValues);
        } catch (error) {
            console.error('搜索模板失败:', error.message);
            throw error;
        }
    },

    // 添加模板
    templateAdd: async ({ data }) => {
        try {
            const { name } = data || {};
            validateName(name);
            
            const sql = 'INSERT INTO template (name) VALUES (?)';
            const values = [name.trim()];
            
            console.log('添加模板:', { sql, values });
            
            const results = await executeQuery(sql, values);
            return results.insertId;
        } catch (error) {
            console.error('添加模板失败:', error.message);
            throw error;
        }
    },

    // 批量添加模板
    templateBatchAdd: async ({ datas }) => {
        try {
            if (!Array.isArray(datas) || datas.length === 0) {
                throw new Error('批量添加数据不能为空');
            }
            
            // 验证所有名称
            const names = datas.map(item => {
                const { name } = item || {};
                validateName(name);
                return name.trim();
            });
            
            const placeholders = names.map(() => '(?)').join(',');
            const sql = `INSERT INTO template (name) VALUES ${placeholders}`;
            
            console.log('批量添加模板:', { sql, values: names });
            
            const results = await executeQuery(sql, names);
            return results.insertId;
        } catch (error) {
            console.error('批量添加模板失败:', error.message);
            throw error;
        }
    },

    // 更新模板
    templateUpdate: async ({ id, data }) => {
        try {
            validateId(id);
            const { name } = data || {};
            
            if (!name) {
                throw new Error('更新数据不能为空');
            }
            
            validateName(name);
            
            const sql = 'UPDATE template SET name = ? WHERE id = ?';
            const values = [name.trim(), id];
            
            console.log('更新模板:', { sql, values });
            
            const results = await executeQuery(sql, values);
            
            if (results.affectedRows === 0) {
                throw new Error(`ID为 ${id} 的模板不存在`);
            }
            
            return true;
        } catch (error) {
            console.error('更新模板失败:', error.message);
            throw error;
        }
    },

    // 删除模板
    templateDelete: async ({ id }) => {
        try {
            validateId(id);
            
            const sql = 'DELETE FROM template WHERE id = ?';
            const values = [id];
            
            console.log('删除模板:', { sql, values });
            
            const results = await executeQuery(sql, values);
            
            if (results.affectedRows === 0) {
                throw new Error(`ID为 ${id} 的模板不存在`);
            }
            
            return true;
        } catch (error) {
            console.error('删除模板失败:', error.message);
            throw error;
        }
    },

    // 批量删除模板
    templateBatchDelete: async ({ ids }) => {
        try {
            if (!Array.isArray(ids) || ids.length === 0) {
                throw new Error('批量删除的ID列表不能为空');
            }
            
            // 验证所有ID
            ids.forEach(id => validateId(id));
            
            const placeholders = ids.map(() => '?').join(',');
            const sql = `DELETE FROM template WHERE id IN (${placeholders})`;
            
            console.log('批量删除模板:', { sql, values: ids });
            
            const results = await executeQuery(sql, ids);
            
            if (results.affectedRows === 0) {
                throw new Error('没有找到要删除的模板');
            }
            
            return true;
        } catch (error) {
            console.error('批量删除模板失败:', error.message);
            throw error;
        }
    }
}