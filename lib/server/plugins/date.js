"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const language_1 = require("graphql/language");
const graphql_1 = require("graphql");
const customScalarDate = new graphql_1.GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue: (value) => {
        const date = (0, dayjs_1.default)(value);
        if (!date.isValid()) {
            throw new Error("Invalid date format");
        }
        return date.valueOf(); // Ensure this returns a number
    },
    serialize: (value) => {
        const date = (0, dayjs_1.default)(value);
        if (!date.isValid()) {
            throw new Error("Invalid date format");
        }
        return date.format("YYYY-MM-DD HH:mm:ss:SSS"); // Ensure this returns a string
    },
    parseLiteral: (ast) => {
        if (ast.kind === language_1.Kind.INT) {
            return parseInt(ast.value, 10);
        }
        else if (ast.kind === language_1.Kind.STRING) {
            const date = (0, dayjs_1.default)(ast.value);
            if (!date.isValid()) {
                throw new Error("Invalid date format");
            }
            return date.valueOf();
        }
        return null;
    },
});
exports.default = { Date: customScalarDate };
