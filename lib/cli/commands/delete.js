"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDbCommand = exports.deleteCommand = void 0;
const parser_1 = require("../parser");
const utils_1 = require("../utils");
const generate_1 = require("../../generate");
exports.deleteCommand = {
    name: 'delete',
    aliases: ['-d', '--delete'],
    description: '删除控制器和操作',
    usage: 'nsgm delete [controller] [action] [dictionary] [options]',
    examples: ['nsgm delete', 'nsgm delete user', 'nsgm delete user list', 'nsgm delete user all myproject'],
    options: [
        {
            name: 'controller',
            description: '控制器名称',
            required: false,
            type: 'string',
        },
        {
            name: 'action',
            description: '操作名称',
            default: 'all',
            type: 'string',
        },
        {
            name: 'dictionary',
            description: '项目目录',
            default: '',
            type: 'string',
        },
        {
            name: 'interactive',
            description: '使用交互式向导',
            default: true,
            type: 'boolean',
        },
    ],
    execute: async (options) => {
        try {
            let deleteDatabase = false;
            // 智能判断是否使用交互模式：如果用户提供了 controller 参数，则自动使用非交互模式
            if (options.controller && options.controller.trim() !== '') {
                options.interactive = false;
            }
            // 如果启用交互模式
            if (options.interactive) {
                const wizardResult = await utils_1.Prompt.deleteControllerWizard();
                utils_1.Console.separator();
                utils_1.Console.title('📋 删除确认');
                utils_1.Console.info(`项目目录: ${wizardResult.dictionary}`);
                utils_1.Console.info(`控制器名称: ${wizardResult.controller}`);
                utils_1.Console.info(`删除范围: ${wizardResult.action === 'all' ? '所有相关文件' : '指定操作'}`);
                utils_1.Console.info(`删除数据库: ${wizardResult.deleteDatabase ? '是' : '否'}`);
                utils_1.Console.separator();
                const confirmed = await utils_1.Prompt.confirm('确认删除？此操作不可恢复！', false);
                if (!confirmed) {
                    utils_1.Console.warning('删除操作已取消');
                    process.exit(0);
                }
                // 更新选项
                options.controller = wizardResult.controller;
                options.action = wizardResult.action;
                options.dictionary = wizardResult.dictionary;
                deleteDatabase = wizardResult.deleteDatabase;
            }
            // 验证必需参数（仅在非交互模式下）
            if (!options.interactive) {
                const missing = parser_1.ArgumentParser.validateRequired(options, ['controller']);
                if (missing.length > 0) {
                    utils_1.Console.error(`缺少必需参数: ${missing.join(', ')}`);
                    utils_1.Console.info('使用方法:');
                    utils_1.Console.info('  交互模式: nsgm delete');
                    utils_1.Console.info('  命令行模式: nsgm delete [controller] [action] [dictionary]');
                    process.exit(1);
                }
            }
            const finalOptions = parser_1.ArgumentParser.applyDefaults(options, {
                action: 'all',
                dictionary: '',
            });
            utils_1.Console.highlight(`🗑️ 删除控制器: ${finalOptions.controller}`);
            utils_1.Console.info(`📝 操作: ${finalOptions.action}`);
            if (finalOptions.dictionary) {
                utils_1.Console.info(`📁 目录: ${finalOptions.dictionary}`);
            }
            const spinner = utils_1.Console.spinner('正在删除文件...', 'red');
            spinner.start();
            try {
                await new Promise((resolve) => setTimeout(resolve, 500));
                (0, generate_1.deleteFiles)(finalOptions.controller, finalOptions.action, deleteDatabase, finalOptions.dictionary);
                spinner.succeed('删除完成!');
                utils_1.Console.newLine();
                utils_1.Console.box(`控制器 "${finalOptions.controller}" 已删除成功!\n\n` +
                    `操作: ${finalOptions.action}\n` +
                    `路径: ${finalOptions.dictionary || './'}${deleteDatabase ? '\n数据库表: 已删除' : ''}`, 'success');
            }
            catch (error) {
                spinner.fail('删除失败');
                throw error;
            }
        }
        catch (error) {
            utils_1.Console.error(`删除失败: ${error}`);
            process.exit(1);
        }
    },
};
exports.deleteDbCommand = {
    name: 'deletedb',
    aliases: ['-db', '--deletedb'],
    description: '删除控制器、操作和相关数据库',
    usage: 'nsgm deletedb <controller> [action]',
    examples: ['nsgm deletedb user', 'nsgm deletedb user list'],
    options: [
        {
            name: 'controller',
            description: '控制器名称',
            required: true,
            type: 'string',
        },
        {
            name: 'action',
            description: '操作名称',
            default: 'all',
            type: 'string',
        },
    ],
    execute: async (options) => {
        try {
            // 验证必需参数
            const missing = parser_1.ArgumentParser.validateRequired(options, ['controller']);
            if (missing.length > 0) {
                console.error(`❌ 缺少必需参数: ${missing.join(', ')}`);
                console.log('使用方法: nsgm deletedb <controller> [action]');
                process.exit(1);
            }
            const finalOptions = parser_1.ArgumentParser.applyDefaults(options, {
                action: 'all',
            });
            console.log(`🗑️  删除控制器和数据库: ${finalOptions.controller}`);
            console.log(`📝 操作: ${finalOptions.action}`);
            (0, generate_1.deleteFiles)(finalOptions.controller, finalOptions.action, true, '');
            console.log('✅ 删除完成!');
        }
        catch (error) {
            console.error('❌ 删除失败:', error);
            process.exit(1);
        }
    },
};
