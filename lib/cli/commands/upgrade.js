"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upgradeCommand = void 0;
const parser_1 = require("../parser");
const generate_1 = require("../../generate");
exports.upgradeCommand = {
    name: 'upgrade',
    aliases: ['-u', '--upgrade'],
    description: '升级 NSGM 项目',
    usage: 'nsgm upgrade [dictionary]',
    examples: ['nsgm upgrade', 'nsgm upgrade myproject'],
    options: [
        {
            name: 'dictionary',
            description: '项目目录名称',
            default: '',
            type: 'string'
        }
    ],
    execute: async (options) => {
        try {
            const finalOptions = parser_1.ArgumentParser.applyDefaults(options, {
                dictionary: ''
            });
            console.log('⬆️  升级 NSGM 项目...');
            if (finalOptions.dictionary) {
                console.log(`📁 目录: ${finalOptions.dictionary}`);
            }
            (0, generate_1.initFiles)(finalOptions.dictionary, true);
            console.log('✅ 升级完成!');
            process.exit(0);
        }
        catch (error) {
            console.error('❌ 升级失败:', error);
            process.exit(1);
        }
    }
};
