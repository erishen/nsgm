"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCommand = exports.devCommand = void 0;
const index_1 = require("../../index");
exports.devCommand = {
    name: 'dev',
    aliases: [],
    description: '开发模式启动服务器',
    usage: 'nsgm dev',
    examples: ['nsgm dev'],
    execute: async (_options) => {
        console.log('🚀 启动开发服务器...');
        (0, index_1.startExpress)({ dev: true }, undefined, 'dev');
    },
};
exports.startCommand = {
    name: 'start',
    aliases: [],
    description: '生产模式启动服务器',
    usage: 'nsgm start',
    examples: ['nsgm start'],
    execute: async (_options) => {
        console.log('🌟 启动生产服务器...');
        (0, index_1.startExpress)({ dev: false }, undefined, 'start');
    },
};
