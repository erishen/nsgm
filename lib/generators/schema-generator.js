"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaGenerator = void 0;
const base_generator_1 = require("./base-generator");
/**
 * GraphQL Schema生成器
 */
class SchemaGenerator extends base_generator_1.BaseGenerator {
    generate() {
        const capitalizedTypeName = this.getCapitalizedController();
        const pluralTypeName = `${capitalizedTypeName}s`;
        const typeFields = this.getNonSystemFields()
            .map((field) => `            ${field.name}: ${this.getGraphQLType(field.type)}`)
            .join("\n");
        const inputFields = this.getFormFields()
            .map((field) => `            ${field.name}: ${this.getGraphQLType(field.type)}`)
            .join("\n");
        const searchableFields = this.getSearchableFields();
        const searchFields = searchableFields.length > 0
            ? searchableFields.map((field) => `            ${field.name}: ${this.getGraphQLType(field.type)}`).join("\n")
            : "            name: String";
        return `module.exports = {
    query: \`
        ${this.controller}(page: Int, pageSize: Int): ${pluralTypeName}
        ${this.controller}Get(id: Int): ${capitalizedTypeName}
        ${this.controller}Search(page: Int, pageSize: Int, data: ${capitalizedTypeName}SearchInput): ${pluralTypeName}
    \`,
    mutation: \`
        ${this.controller}Add(data: ${capitalizedTypeName}AddInput): Int
        ${this.controller}BatchAdd(datas: [${capitalizedTypeName}AddInput]): Int
        ${this.controller}Update(id: Int, data: ${capitalizedTypeName}AddInput): Boolean
        ${this.controller}Delete(id: Int): Boolean
        ${this.controller}BatchDelete(ids: [Int]): Boolean
    \`,
    subscription: \`\`,
    type: \`
        type ${capitalizedTypeName} {
${typeFields}
        }

        type ${pluralTypeName} {
            totalCounts: Int
            items: [${capitalizedTypeName}]
        }

        input ${capitalizedTypeName}AddInput {
${inputFields}
        }

        input ${capitalizedTypeName}SearchInput {
${searchFields}
        }
    \`
}`;
    }
}
exports.SchemaGenerator = SchemaGenerator;
