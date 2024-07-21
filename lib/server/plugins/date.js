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
    parseValue: function (value) {
        var date = (0, moment_1.default)(value);
        if (!date.isValid()) {
            throw new Error("Invalid date format");
        }
        return date.valueOf(); // Ensure this returns a number
    },
    serialize: function (value) {
        var date = (0, moment_1.default)(value);
        if (!date.isValid()) {
            throw new Error("Invalid date format");
        }
        return date.format('YYYY-MM-DD HH:mm:ss:SSS'); // Ensure this returns a string
    },
    parseLiteral: function (ast) {
        if (ast.kind === language_1.Kind.INT) {
            return parseInt(ast.value, 10);
        }
        else if (ast.kind === language_1.Kind.STRING) {
            var date = (0, moment_1.default)(ast.value);
            if (!date.isValid()) {
                throw new Error("Invalid date format");
            }
            return date.valueOf();
        }
        return null;
    }
});
exports.default = { Date: customScalarDate };
