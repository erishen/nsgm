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
    
    // 根据ID获取模板 - 使用 DataLoader 优化
    templateGet: async ({ id }, context) => {
        try {
            validateId(id);
            
            console.log('🚀 使用 DataLoader 根据ID查询模板:', { id });
            
            // 使用 DataLoader 批量加载，自动去重和缓存
            const result = await context.dataloaders.template.byId.load(Number(id));
            
            if (!result) {
                throw new Error(`ID为 ${id} 的模板不存在`);
            }
            
            return result;
        } catch (error) {
            console.error('获取模板失败:', error.message);
            throw error;
        }
    },

    // 批量获取模板 - 新增方法，展示 DataLoader 批量能力
    templateBatchGet: async ({ ids }, context) => {
        try {
            if (!Array.isArray(ids) || ids.length === 0) {
                throw new Error('ID列表不能为空');
            }
            
            // 验证所有ID
            const validIds = ids.map(id => {
                validateId(id);
                return Number(id);
            });
            
            console.log('🚀 使用 DataLoader 批量查询模板:', { ids: validIds });
            
            // DataLoader 自动批量处理，一次查询获取所有数据
            const results = await context.dataloaders.template.byId.loadMany(validIds);
            
            // 过滤掉 null 结果（未找到的记录）
            return results.filter(result => result !== null && !(result instanceof Error));
        } catch (error) {
            console.error('批量获取模板失败:', error.message);
            throw error;
        }
    },

    // 搜索模板（分页）- 使用 DataLoader 优化搜索
    templateSearch: async ({ page = 0, pageSize = 10, data = {} }, context) => {
        try {
            validatePagination(page, pageSize);
            
            const { name } = data;
            
            // 如果有名称搜索，尝试使用 DataLoader 搜索缓存
            if (name && name.trim() !== '') {
                console.log('🚀 使用 DataLoader 搜索模板:', { searchTerm: name.trim() });
                
                try {
                    // 使用 DataLoader 进行搜索（这里会缓存搜索结果）
                    const searchResults = await context.dataloaders.template.searchByName.load(name.trim());
                    
                    // 手动分页处理
                    const totalCounts = searchResults.length;
                    const startIndex = page * pageSize;
                    const endIndex = startIndex + pageSize;
                    const items = searchResults.slice(startIndex, endIndex);
                    
                    return {
                        totalCounts,
                        items
                    };
                } catch (dataLoaderError) {
                    console.warn('DataLoader 搜索失败，回退到直接查询:', dataLoaderError.message);
                    // 如果 DataLoader 失败，回退到原始查询方式
                }
            }
            
            // 原始查询方式（作为备用）
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
            
            console.log('搜索模板（备用查询）:', { sql, values, countSql, countValues });
            
            return await executePaginatedQuery(sql, countSql, values, countValues);
        } catch (error) {
            console.error('搜索模板失败:', error.message);
            throw error;
        }
    },

    // 添加模板 - 添加 DataLoader 缓存清理
    templateAdd: async ({ data }, context) => {
        try {
            const { name } = data || {};
            validateName(name);
            
            const sql = 'INSERT INTO template (name) VALUES (?)';
            const values = [name.trim()];
            
            console.log('添加模板:', { sql, values });
            
            const results = await executeQuery(sql, values);
            const insertId = results.insertId;
            
            // 预加载新数据到 DataLoader 缓存
            if (insertId && context?.dataloaders?.template) {
                const newTemplate = { id: insertId, name: name.trim() };
                context.dataloaders.template.prime(insertId, newTemplate);
                console.log('🚀 新模板已预加载到 DataLoader 缓存:', newTemplate);
            }
            
            return insertId;
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

    // 更新模板 - 添加 DataLoader 缓存清理
    templateUpdate: async ({ id, data }, context) => {
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
            
            // 清除 DataLoader 缓存，确保下次查询获取最新数据
            if (context?.dataloaders?.template) {
                context.dataloaders.template.clearById(Number(id));
                console.log('🧹 已清除 DataLoader 缓存:', { id });
            }
            
            return true;
        } catch (error) {
            console.error('更新模板失败:', error.message);
            throw error;
        }
    },

    // 删除模板 - 添加 DataLoader 缓存清理
    templateDelete: async ({ id }, context) => {
        try {
            validateId(id);
            
            const sql = 'DELETE FROM template WHERE id = ?';
            const values = [id];
            
            console.log('删除模板:', { sql, values });
            
            const results = await executeQuery(sql, values);
            
            if (results.affectedRows === 0) {
                throw new Error(`ID为 ${id} 的模板不存在`);
            }
            
            // 清除 DataLoader 缓存
            if (context?.dataloaders?.template) {
                context.dataloaders.template.clearById(Number(id));
                console.log('🧹 已清除 DataLoader 缓存:', { id });
            }
            
            return true;
        } catch (error) {
            console.error('删除模板失败:', error.message);
            throw error;
        }
    },

    // 批量删除模板 - 添加 DataLoader 缓存清理
    templateBatchDelete: async ({ ids }, context) => {
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
            
            // 批量清除 DataLoader 缓存
            if (context?.dataloaders?.template) {
                ids.forEach(id => {
                    context.dataloaders.template.clearById(Number(id));
                });
                console.log('🧹 已批量清除 DataLoader 缓存:', { ids });
            }
            
            return true;
        } catch (error) {
            console.error('批量删除模板失败:', error.message);
            throw error;
        }
    }
}