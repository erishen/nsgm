"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_graphql_1 = require("express-graphql");
var graphql_1 = require("graphql");
var fs_1 = __importDefault(require("fs"));
var lodash_1 = __importDefault(require("lodash"));
var path_1 = require("path");
var date_1 = __importDefault(require("./plugins/date"));
var defaultPath = (0, path_1.resolve)(__dirname, './modules/');
var typeDefFileName = 'schema.js';
var resolverFileName = 'resolver.js';
var curFolder = process.cwd();
var outModulesPath = (0, path_1.resolve)(curFolder + '/server/modules/');
var handleOutPlugins = function () {
    var result = {};
    var outPluginsPath = (0, path_1.resolve)(curFolder + '/server/plugins/');
    if (fs_1.default.existsSync(outPluginsPath)) {
        var list = fs_1.default.readdirSync(outPluginsPath);
        list.forEach(function (item) {
            var resolverPath = (0, path_1.resolve)(outPluginsPath + '/' + item);
            var stat = fs_1.default.statSync(resolverPath);
            var isFile = stat.isFile();
            if (isFile) {
                result = __assign({}, require(resolverPath));
            }
        });
    }
    return result;
};
function generateTypeDefsAndResolvers() {
    var querySchemes = [
        "\n        _: Boolean\n    "
    ];
    var mutationSchemes = [
        "\n        _: Boolean\n    "
    ];
    var subscriptionSchemes = [
        "\n        _: Boolean\n    "
    ];
    var typeSchemes = [];
    var resolvers = __assign(__assign({}, date_1.default), handleOutPlugins());
    var scalars = lodash_1.default.keys(resolvers);
    var scalarStr = '';
    lodash_1.default.each(scalars, function (item, index) {
        scalarStr += 'scalar ' + item + '\n    ';
    });
    // console.log('resolvers', resolvers, _.keys(resolvers), scalarStr)
    var _generateAllComponentRecursive = function (path) {
        if (path === void 0) { path = defaultPath; }
        if (fs_1.default.existsSync(path)) {
            var list = fs_1.default.readdirSync(path);
            list.forEach(function (item) {
                var resolverPath = path + '/' + item;
                var stat = fs_1.default.statSync(resolverPath);
                var isDir = stat.isDirectory();
                var isFile = stat.isFile();
                if (isDir) {
                    _generateAllComponentRecursive(resolverPath);
                }
                else if (isFile && item === typeDefFileName) {
                    // console.log('resolverPath1', resolverPath)
                    var schemaObj = require(resolverPath);
                    if (schemaObj.default !== undefined)
                        schemaObj = schemaObj.default;
                    var query = schemaObj.query, mutation = schemaObj.mutation, subscription = schemaObj.subscription, type = schemaObj.type;
                    if (query !== '')
                        querySchemes.push(query);
                    if (mutation !== '')
                        mutationSchemes.push(mutation);
                    if (subscription !== '')
                        subscriptionSchemes.push(subscription);
                    if (type !== '')
                        typeSchemes.push(type);
                }
                else if (isFile && item === resolverFileName) {
                    // console.log('resolverPath2', resolverPath)
                    var resolversObj_1 = require(resolverPath);
                    if (resolversObj_1.default !== undefined)
                        resolversObj_1 = resolversObj_1.default;
                    Object.keys(resolversObj_1).forEach(function (k) {
                        if (!resolvers[k])
                            resolvers[k] = {};
                        resolvers[k] = resolversObj_1[k];
                    });
                }
            });
        }
    };
    _generateAllComponentRecursive();
    _generateAllComponentRecursive(outModulesPath);
    return { querySchemes: querySchemes, mutationSchemes: mutationSchemes, subscriptionSchemes: subscriptionSchemes, typeSchemes: typeSchemes, resolvers: resolvers, scalarStr: scalarStr };
}
var _a = generateTypeDefsAndResolvers(), querySchemesV = _a.querySchemes, mutationSchemesV = _a.mutationSchemes, subscriptionSchemesV = _a.subscriptionSchemes, typeSchemesV = _a.typeSchemes, resolversV = _a.resolvers, scalarStrV = _a.scalarStr;
var schemaStr = "\n    ".concat(scalarStrV, "\n\n    type Query { \n        ").concat(querySchemesV.join('\n'), " \n    }\n\n    type Mutation { \n        ").concat(mutationSchemesV.join('\n'), " \n    }\n\n    type Subscription { \n        ").concat(subscriptionSchemesV.join('\n'), " \n    }\n\n    ").concat(typeSchemesV.join('\n'), "\n");
exports.default = (function (command) {
    if (command === 'dev') {
        console.log('schemaStr', schemaStr);
        console.log('resolvers', resolversV);
    }
    return (0, express_graphql_1.graphqlHTTP)({
        schema: (0, graphql_1.buildSchema)(schemaStr),
        rootValue: resolversV,
        graphiql: true
    });
});
