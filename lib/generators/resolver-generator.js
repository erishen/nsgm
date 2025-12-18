"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolverGenerator = void 0;
const base_generator_1 = require("./base-generator");
/**
 * Resolver生成器
 */
class ResolverGenerator extends base_generator_1.BaseGenerator {
    generate() {
        const selectFields = this.fields.map((f) => f.name).join(", ");
        const insertFields = this.getFormFields();
        const searchableFields = this.getSearchableFields();
        const insertFieldNames = insertFields.map((f) => f.name).join(", ");
        const insertPlaceholders = insertFields.map(() => "?").join(", ");
        const insertValues = insertFields
            .map((f) => {
            if (f.type === "integer") {
                return `valid${f.name.charAt(0).toUpperCase() + f.name.slice(1)}`;
            }
            return `data.${f.name}`;
        })
            .join(", ");
        const searchConditions = this.generateSearchConditions(searchableFields);
        const updateFields = insertFields.map((f) => `${f.name} = ?`).join(", ");
        return `const { executeQuery, executePaginatedQuery } = require('../../utils/common')
const { validateInteger, validatePagination, validateId } = require('../../utils/validation')

module.exports = {
    // 获取${this.controller}列表（分页）
    ${this.controller}: async ({ page = 0, pageSize = 10 }) => {
        try {
            const { page: validPage, pageSize: validPageSize } = validatePagination(page, pageSize);
            
            const sql = 'SELECT ${selectFields} FROM ${this.controller} LIMIT ? OFFSET ?';
            const countSql = 'SELECT COUNT(*) as counts FROM ${this.controller}';
            const values = [validPageSize, validPage * validPageSize];

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
            const validId = validateId(id);
            
            const sql = 'SELECT ${selectFields} FROM ${this.controller} WHERE id = ?';
            const values = [validId];

            console.log('根据ID查询${this.controller}:', { sql, values });
            
            const results = await executeQuery(sql, values);
            
            if (results.length === 0) {
                throw new Error(\`ID为 \${validId} 的${this.controller}不存在\`);
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
            const { page: validPage, pageSize: validPageSize } = validatePagination(page, pageSize);
            
            const values = [];
            const countValues = [];
            
            let whereSql = '';
${searchConditions}

            const sql = \`SELECT ${selectFields} FROM ${this.controller} WHERE 1=1\${whereSql} LIMIT ? OFFSET ?\`;
            const countSql = \`SELECT COUNT(*) as counts FROM ${this.controller} WHERE 1=1\${whereSql}\`;
            
            values.push(validPageSize, validPage * validPageSize);
            
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
${this.generateNewValidationCalls(insertFields)}
            
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
            
            // 验证所有数据并转换
            const validatedDatas = datas.map((data, index) => {
                try {
${this.generateBatchValidation(insertFields)}
                    return { ${this.generateBatchReturnObject(insertFields)} };
                } catch (error) {
                    throw new Error(\`第 \${index + 1} 条数据验证失败: \${error.message}\`);
                }
            });
            
            const placeholders = validatedDatas.map(() => '(${insertPlaceholders})').join(',');
            const sql = \`INSERT INTO ${this.controller} (${insertFieldNames}) VALUES \${placeholders}\`;
            const values = validatedDatas.flatMap(data => [${this.generateBatchInsertValues(insertFields)}]);
            
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
            const validId = validateId(id);
            
            if (!data) {
                throw new Error('更新数据不能为空');
            }
            
${this.generateUpdateValidation(insertFields)}
            
            const sql = 'UPDATE ${this.controller} SET ${updateFields} WHERE id = ?';
            const values = [${this.generateUpdateValues(insertFields)}, validId];
            
            console.log('更新${this.controller}:', { sql, values });
            
            const results = await executeQuery(sql, values);
            
            if (results.affectedRows === 0) {
                throw new Error(\`ID为 \${validId} 的${this.controller}不存在\`);
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
            const validId = validateId(id);
            
            const sql = 'DELETE FROM ${this.controller} WHERE id = ?';
            const values = [validId];
            
            console.log('删除${this.controller}:', { sql, values });
            
            const results = await executeQuery(sql, values);
            
            if (results.affectedRows === 0) {
                throw new Error(\`ID为 \${validId} 的${this.controller}不存在\`);
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
            
            // 验证所有ID
            const validIds = ids.map((id, index) => {
                try {
                    return validateId(id, \`第\${index + 1}个ID\`);
                } catch (error) {
                    throw new Error(\`第 \${index + 1} 个ID验证失败: \${error.message}\`);
                }
            });
            
            const placeholders = validIds.map(() => '?').join(',');
            const sql = \`DELETE FROM ${this.controller} WHERE id IN (\${placeholders})\`;
            
            console.log('批量删除${this.controller}:', { sql, values: validIds });
            
            const results = await executeQuery(sql, validIds);
            
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
            return "";
        const conditions = searchableFields.map((field) => {
            if (field.type === "varchar" || field.type === "text") {
                return `            if (data.${field.name} && data.${field.name}.trim() !== '') {
                whereSql += ' AND ${field.name} LIKE ?';
                const ${field.name}Pattern = \`%\${data.${field.name}.trim()}%\`;
                values.push(${field.name}Pattern);
                countValues.push(${field.name}Pattern);
            }`;
            }
            else if (field.type === "integer") {
                return `            if (data.${field.name} !== undefined && data.${field.name} !== null && data.${field.name} !== '') {
                // 使用通用验证工具验证 ${field.name}
                const valid${field.name.charAt(0).toUpperCase() + field.name.slice(1)} = validateInteger(data.${field.name}, '${field.name}', { min: 0, max: 150 });
                if (valid${field.name.charAt(0).toUpperCase() + field.name.slice(1)} !== undefined) {
                    whereSql += ' AND ${field.name} = ?';
                    values.push(valid${field.name.charAt(0).toUpperCase() + field.name.slice(1)});
                    countValues.push(valid${field.name.charAt(0).toUpperCase() + field.name.slice(1)});
                }
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
        return conditions.join("\n\n");
    }
    generateNewValidationCalls(insertFields) {
        return insertFields
            .map((f) => {
            if (f.type === "integer") {
                const validationOptions = f.name === "age" ? "{ min: 0, max: 150, required: true }" : "{ required: true }";
                return `            const valid${f.name.charAt(0).toUpperCase() + f.name.slice(1)} = validateInteger(data.${f.name}, '${f.name}', ${validationOptions});`;
            }
            else if (f.required) {
                return `            if (!data.${f.name}) {
                throw new Error('${f.comment || f.name}是必填字段');
            }`;
            }
            return "";
        })
            .filter((call) => call.length > 0)
            .join("\n");
    }
    generateBatchValidation(insertFields) {
        return insertFields
            .map((f) => {
            if (f.type === "integer") {
                const validationOptions = f.name === "age" ? "{ min: 0, max: 150, required: true }" : "{ required: true }";
                return `                    const valid${f.name.charAt(0).toUpperCase() + f.name.slice(1)} = validateInteger(data.${f.name}, \`第\${index + 1}条数据的${f.name}\`, ${validationOptions});`;
            }
            else if (f.required) {
                return `                    if (!data.${f.name}) {
                        throw new Error('${f.comment || f.name}是必填字段');
                    }`;
            }
            return "";
        })
            .filter((call) => call.length > 0)
            .join("\n");
    }
    generateUpdateValidation(insertFields) {
        return insertFields
            .map((f) => {
            if (f.type === "integer") {
                const validationOptions = f.name === "age" ? "{ min: 0, max: 150, required: true }" : "{ required: true }";
                return `            let valid${f.name.charAt(0).toUpperCase() + f.name.slice(1)} = data.${f.name};
            if (data.${f.name} !== undefined) {
                valid${f.name.charAt(0).toUpperCase() + f.name.slice(1)} = validateInteger(data.${f.name}, '${f.name}', ${validationOptions});
            }`;
            }
            else if (f.required) {
                return `            if (data.${f.name} !== undefined && !data.${f.name}) {
                throw new Error('${f.comment || f.name}是必填字段');
            }`;
            }
            return "";
        })
            .filter((call) => call.length > 0)
            .join("\n");
    }
    generateUpdateValues(insertFields) {
        return insertFields
            .map((f) => {
            if (f.type === "integer") {
                return `valid${f.name.charAt(0).toUpperCase() + f.name.slice(1)}`;
            }
            return `data.${f.name}`;
        })
            .join(", ");
    }
    generateBatchReturnObject(insertFields) {
        return insertFields
            .map((f) => {
            if (f.type === "integer") {
                return `${f.name}: valid${f.name.charAt(0).toUpperCase() + f.name.slice(1)}`;
            }
            return `${f.name}: data.${f.name}`;
        })
            .join(", ");
    }
    generateBatchInsertValues(insertFields) {
        return insertFields.map((f) => `data.${f.name}`).join(", ");
    }
}
exports.ResolverGenerator = ResolverGenerator;
