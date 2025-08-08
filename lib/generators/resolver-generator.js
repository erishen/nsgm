"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolverGenerator = void 0;
const base_generator_1 = require("./base-generator");
/**
 * Resolver生成器
 */
class ResolverGenerator extends base_generator_1.BaseGenerator {
    generate() {
        const selectFields = this.fields.map((f) => f.name).join(', ');
        const insertFields = this.getFormFields();
        const searchableFields = this.getSearchableFields();
        const insertFieldNames = insertFields.map((f) => f.name).join(', ');
        const insertPlaceholders = insertFields.map(() => '?').join(', ');
        const insertValues = insertFields.map((f) => `data.${f.name}`).join(', ');
        const searchConditions = this.generateSearchConditions(searchableFields);
        const validateFunctions = this.generateValidateFunctions(insertFields);
        const updateFields = insertFields.map((f) => `${f.name} = ?`).join(', ');
        const updateValues = insertFields.map((f) => `data.${f.name}`).join(', ');
        return `const { executeQuery, executePaginatedQuery } = require('../../utils/common')

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

${validateFunctions}

module.exports = {
    // 获取${this.controller}列表（分页）
    ${this.controller}: async ({ page = 0, pageSize = 10 }) => {
        try {
            const pageNum = parseInt(page, 10) || 0;
            const pageSizeNum = parseInt(pageSize, 10) || 10;
            
            validatePagination(pageNum, pageSizeNum);
            
            const sql = 'SELECT ${selectFields} FROM ${this.controller} LIMIT ? OFFSET ?';
            const countSql = 'SELECT COUNT(*) as counts FROM ${this.controller}';
            const values = [pageSizeNum, pageNum * pageSizeNum];

            console.log('执行分页查询:', { sql, values, countSql });
            
            return await executePaginatedQuery(sql, countSql, values);
        } catch (error) {
            console.error('获取${this.controller}列表失败:', error.message);
            throw error;
        }
    },

    // 根据ID获取${this.controller}
    ${this.controller}Get: async ({ id }) => {
        try {
            validateId(id);
            
            const sql = 'SELECT ${selectFields} FROM ${this.controller} WHERE id = ?';
            const values = [id];

            console.log('根据ID查询${this.controller}:', { sql, values });
            
            const results = await executeQuery(sql, values);
            
            if (results.length === 0) {
                throw new Error(\`ID为 \${id} 的${this.controller}不存在\`);
            }
            
            return results[0];
        } catch (error) {
            console.error('获取${this.controller}失败:', error.message);
            throw error;
        }
    },

    // 搜索${this.controller}（分页）
    ${this.controller}Search: async ({ page = 0, pageSize = 10, data = {} }) => {
        try {
            validatePagination(page, pageSize);
            
            const values = [];
            const countValues = [];
            
            let whereSql = '';
${searchConditions}

            const sql = \`SELECT ${selectFields} FROM ${this.controller} WHERE 1=1\${whereSql} LIMIT ? OFFSET ?\`;
            const countSql = \`SELECT COUNT(*) as counts FROM ${this.controller} WHERE 1=1\${whereSql}\`;
            
            values.push(pageSize, page * pageSize);
            
            console.log('搜索${this.controller}:', { sql, values, countSql, countValues });
            
            return await executePaginatedQuery(sql, countSql, values, countValues);
        } catch (error) {
            console.error('搜索${this.controller}失败:', error.message);
            throw error;
        }
    },

    // 添加${this.controller}
    ${this.controller}Add: async ({ data }) => {
        try {
${this.generateValidationCalls(insertFields)}
            
            const sql = 'INSERT INTO ${this.controller} (${insertFieldNames}) VALUES (${insertPlaceholders})';
            const values = [${insertValues}];
            
            console.log('添加${this.controller}:', { sql, values });
            
            const results = await executeQuery(sql, values);
            return results.insertId;
        } catch (error) {
            console.error('添加${this.controller}失败:', error.message);
            throw error;
        }
    },

    // 批量添加${this.controller}
    ${this.controller}BatchAdd: async ({ datas }) => {
        try {
            if (!Array.isArray(datas) || datas.length === 0) {
                throw new Error('批量添加数据不能为空');
            }
            
            // 验证所有数据
            datas.forEach(data => {
${this.generateBatchValidationCalls(insertFields)}
            });
            
            const placeholders = datas.map(() => '(${insertPlaceholders})').join(',');
            const sql = \`INSERT INTO ${this.controller} (${insertFieldNames}) VALUES \${placeholders}\`;
            const values = datas.flatMap(data => [${insertValues}]);
            
            console.log('批量添加${this.controller}:', { sql, values });
            
            const results = await executeQuery(sql, values);
            return results.insertId;
        } catch (error) {
            console.error('批量添加${this.controller}失败:', error.message);
            throw error;
        }
    },

    // 更新${this.controller}
    ${this.controller}Update: async ({ id, data }) => {
        try {
            validateId(id);
            
            if (!data) {
                throw new Error('更新数据不能为空');
            }
            
${this.generateUpdateValidationCalls(insertFields)}
            
            const sql = 'UPDATE ${this.controller} SET ${updateFields} WHERE id = ?';
            const values = [${updateValues}, id];
            
            console.log('更新${this.controller}:', { sql, values });
            
            const results = await executeQuery(sql, values);
            
            if (results.affectedRows === 0) {
                throw new Error(\`ID为 \${id} 的${this.controller}不存在\`);
            }
            
            return true;
        } catch (error) {
            console.error('更新${this.controller}失败:', error.message);
            throw error;
        }
    },

    // 删除${this.controller}
    ${this.controller}Delete: async ({ id }) => {
        try {
            validateId(id);
            
            const sql = 'DELETE FROM ${this.controller} WHERE id = ?';
            const values = [id];
            
            console.log('删除${this.controller}:', { sql, values });
            
            const results = await executeQuery(sql, values);
            
            if (results.affectedRows === 0) {
                throw new Error(\`ID为 \${id} 的${this.controller}不存在\`);
            }
            
            return true;
        } catch (error) {
            console.error('删除${this.controller}失败:', error.message);
            throw error;
        }
    },

    // 批量删除${this.controller}
    ${this.controller}BatchDelete: async ({ ids }) => {
        try {
            if (!Array.isArray(ids) || ids.length === 0) {
                throw new Error('批量删除的ID列表不能为空');
            }
            
            ids.forEach(id => validateId(id));
            
            const placeholders = ids.map(() => '?').join(',');
            const sql = \`DELETE FROM ${this.controller} WHERE id IN (\${placeholders})\`;
            
            console.log('批量删除${this.controller}:', { sql, values: ids });
            
            const results = await executeQuery(sql, ids);
            
            if (results.affectedRows === 0) {
                throw new Error('没有找到要删除的${this.controller}');
            }
            
            return true;
        } catch (error) {
            console.error('批量删除${this.controller}失败:', error.message);
            throw error;
        }
    }
}`;
    }
    generateSearchConditions(searchableFields) {
        if (searchableFields.length === 0)
            return '';
        const conditions = searchableFields.map((field) => {
            if (field.type === 'varchar' || field.type === 'text') {
                return `            if (data.${field.name} && data.${field.name}.trim() !== '') {
                whereSql += ' AND ${field.name} LIKE ?';
                const ${field.name}Pattern = \`%\${data.${field.name}.trim()}%\`;
                values.push(${field.name}Pattern);
                countValues.push(${field.name}Pattern);
            }`;
            }
            else {
                return `            if (data.${field.name} !== undefined && data.${field.name} !== null) {
                whereSql += ' AND ${field.name} = ?';
                values.push(data.${field.name});
                countValues.push(data.${field.name});
            }`;
            }
        });
        return conditions.join('\n\n');
    }
    generateValidateFunctions(insertFields) {
        return insertFields
            .filter((f) => f.required)
            .map((field) => {
            const capitalizedName = field.name.charAt(0).toUpperCase() + field.name.slice(1);
            if (field.type === 'varchar' || field.type === 'text') {
                return `const validate${capitalizedName} = (${field.name}) => {
    if (!${field.name} || typeof ${field.name} !== 'string' || ${field.name}.trim().length === 0) {
        throw new Error('${field.comment || field.name}参数无效');
    }
};`;
            }
            else {
                return `const validate${capitalizedName} = (${field.name}) => {
    if (${field.name} === undefined || ${field.name} === null) {
        throw new Error('${field.comment || field.name}参数无效');
    }
};`;
            }
        })
            .join('\n\n');
    }
    generateValidationCalls(insertFields) {
        return insertFields
            .filter((f) => f.required)
            .map((f) => {
            const capitalizedName = f.name.charAt(0).toUpperCase() + f.name.slice(1);
            return `            validate${capitalizedName}(data.${f.name});`;
        })
            .join('\n');
    }
    generateBatchValidationCalls(insertFields) {
        return insertFields
            .filter((f) => f.required)
            .map((f) => {
            const capitalizedName = f.name.charAt(0).toUpperCase() + f.name.slice(1);
            return `                validate${capitalizedName}(data.${f.name});`;
        })
            .join('\n');
    }
    generateUpdateValidationCalls(insertFields) {
        return insertFields
            .filter((f) => f.required)
            .map((f) => {
            const capitalizedName = f.name.charAt(0).toUpperCase() + f.name.slice(1);
            return `            if (data.${f.name} !== undefined) validate${capitalizedName}(data.${f.name});`;
        })
            .join('\n');
    }
}
exports.ResolverGenerator = ResolverGenerator;
