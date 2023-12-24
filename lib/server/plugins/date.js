"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var moment_1 = __importDefault(require("moment"));
var language_1 = require("graphql/language");
var graphql_1 = require("graphql");
var customScalarDate = new graphql_1.GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue: function (value) { return (0, moment_1.default)(value).valueOf(); },
    serialize: function (value) { return (0, moment_1.default)(value).format('YYYY-MM-DD HH:mm:ss:SSS'); },
    parseLiteral: function (ast) { return (ast.kind === language_1.Kind.INT ? parseInt(ast.value, 10) : null); }
});
exports.default = { Date: customScalarDate };
