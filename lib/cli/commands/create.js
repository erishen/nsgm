"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommand = void 0;
const parser_1 = require("../parser");
const utils_1 = require("../utils");
const generate_1 = require("../../generate");
exports.createCommand = {
    name: 'create',
    aliases: ['-c', '--create'],
    description: '创建控制器和操作',
    usage: 'nsgm create [controller] [action] [dictionary] [options]',
    examples: ['nsgm create', 'nsgm create user', 'nsgm create user manage', 'nsgm create user manage myproject'],
    options: [
        {
            name: 'controller',
            description: '控制器名称',
            required: false,
            type: 'string'
        },
        {
            name: 'action',
            description: '操作名称',
            default: 'manage',
            type: 'string'
        },
        {
            name: 'dictionary',
            description: '项目目录',
            default: '',
            type: 'string'
        },
        {
            name: 'interactive',
            description: '使用交互式向导',
            default: true,
            type: 'boolean'
        }
    ],
    execute: async (options) => {
        try {
            // 智能判断是否使用交互模式：如果用户提供了 controller 参数，则自动使用非交互模式
            if (options.controller && options.controller.trim() !== '') {
                options.interactive = false;
            }
            // 如果启用交互模式
            if (options.interactive) {
                const wizardResult = await utils_1.Prompt.createControllerWizard();
                utils_1.Console.separator();
                utils_1.Console.title('📋 控制器配置确认');
                utils_1.Console.info(`控制器名称: ${wizardResult.controller}`);
                utils_1.Console.info(`功能模块: 完整CRUD + 导入导出 + 批量删除`);
                utils_1.Console.info(`描述: ${wizardResult.description}`);
                utils_1.Console.info(`项目目录: ${wizardResult.dictionary}`);
                utils_1.Console.info(`数据库表: ${wizardResult.includeDatabase ? '是' : '否'}`);
                if (wizardResult.includeDatabase && wizardResult.fields.length > 0) {
                    const fieldNames = wizardResult.fields.map((field) => field.name).join(', ');
                    utils_1.Console.info(`字段: ${fieldNames}`);
                }
                utils_1.Console.separator();
                const confirmed = await utils_1.Prompt.confirm('确认创建控制器？', true);
                if (!confirmed) {
                    utils_1.Console.warning('控制器创建已取消');
                    process.exit(0);
                }
                // 更新选项
                options.controller = wizardResult.controller;
                options.action = wizardResult.action;
                options.dictionary = wizardResult.dictionary;
                options.fields = wizardResult.fields;
            }
            // 验证必需参数（仅在非交互模式下）
            if (!options.interactive) {
                const missing = parser_1.ArgumentParser.validateRequired(options, ['controller']);
                if (missing.length > 0) {
                    utils_1.Console.error(`缺少必需参数: ${missing.join(', ')}`);
                    utils_1.Console.info('使用方法:');
                    utils_1.Console.info('  交互模式: nsgm create');
                    utils_1.Console.info('  命令行模式: nsgm create [controller] [action] [dictionary]');
                    process.exit(1);
                }
            }
            const finalOptions = parser_1.ArgumentParser.applyDefaults(options, {
                action: 'manage',
                dictionary: ''
            });
            utils_1.Console.highlight(`🎯 创建控制器: ${finalOptions.controller}`);
            utils_1.Console.info(`📝 操作: ${finalOptions.action}`);
            if (finalOptions.dictionary) {
                utils_1.Console.info(`📁 目录: ${finalOptions.dictionary}`);
            }
            const spinner = utils_1.Console.spinner('正在创建文件...', 'green');
            spinner.start();
            try {
                // 模拟创建过程
                await new Promise((resolve) => setTimeout(resolve, 800));
                (0, generate_1.createFiles)(finalOptions.controller, finalOptions.action, finalOptions.dictionary, finalOptions.fields);
                spinner.succeed('控制器创建完成!');
                utils_1.Console.newLine();
                utils_1.Console.box(`控制器 "${finalOptions.controller}" 已创建成功!\n\n` +
                    `操作: ${finalOptions.action}\n` +
                    `路径: ${finalOptions.dictionary || './'}`, 'success');
            }
            catch (error) {
                spinner.fail('控制器创建失败');
                throw error;
            }
        }
        catch (error) {
            utils_1.Console.error(`创建失败: ${error}`);
            process.exit(1);
        }
    }
};
