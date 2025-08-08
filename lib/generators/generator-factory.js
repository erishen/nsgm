"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratorFactory = void 0;
const sql_generator_1 = require("./sql-generator");
const schema_generator_1 = require("./schema-generator");
const resolver_generator_1 = require("./resolver-generator");
const service_generator_1 = require("./service-generator");
/**
 * 代码生成器工厂
 * 统一管理所有代码生成器
 */
class GeneratorFactory {
    /**
     * 创建所有必要的代码生成器
     */
    static createGenerators(controller, action, fields) {
        return {
            sql: new sql_generator_1.SQLGenerator(controller, action, fields),
            schema: new schema_generator_1.SchemaGenerator(controller, action, fields),
            resolver: new resolver_generator_1.ResolverGenerator(controller, action, fields),
            service: new service_generator_1.ServiceGenerator(controller, action, fields)
        };
    }
}
exports.GeneratorFactory = GeneratorFactory;
