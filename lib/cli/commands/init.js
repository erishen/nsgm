"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCommand = void 0;
const parser_1 = require("../parser");
const utils_1 = require("../utils");
const generate_1 = require("../../generate");
exports.initCommand = {
    name: 'init',
    aliases: ['-i', '--init'],
    description: '初始化 NSGM 项目',
    usage: 'nsgm init [dictionary] [options]',
    examples: ['nsgm init', 'nsgm init myproject', 'nsgm init --dictionary=myproject'],
    options: [
        {
            name: 'dictionary',
            description: '项目目录',
            default: '.',
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
            let projectConfig;
            // 智能判断是否使用交互模式：如果用户提供了 dictionary 参数且不是默认值，则自动使用非交互模式
            if (options.dictionary && options.dictionary !== '.') {
                options.interactive = false;
            }
            // 如果启用交互模式
            if (options.interactive) {
                const wizardResult = await utils_1.Prompt.initWizard();
                utils_1.Console.separator();
                utils_1.Console.title('📋 项目配置确认');
                utils_1.Console.info(`项目目录: ${wizardResult.projectName}`);
                utils_1.Console.info(`项目描述: ${wizardResult.description}`);
                utils_1.Console.info(`作者: ${wizardResult.author}`);
                utils_1.Console.info(`数据库: ${wizardResult.database ? '是' : '否'}`);
                utils_1.Console.info(`功能: ${wizardResult.features.join(', ')}`);
                utils_1.Console.separator();
                const confirmed = await utils_1.Prompt.confirm('确认创建项目？', true);
                if (!confirmed) {
                    utils_1.Console.warning('项目创建已取消');
                    process.exit(0);
                }
                options.dictionary = wizardResult.projectName;
                projectConfig = wizardResult;
            }
            const finalOptions = parser_1.ArgumentParser.applyDefaults(options, {
                dictionary: '.',
            });
            // 检查是否需要跳过初始化（保持原有逻辑）
            let initFlag = true;
            const argvArr = process.argv;
            const argvArrLen = argvArr.length;
            let fileName = '';
            if (argvArrLen > 2) {
                fileName = argvArr[2];
            }
            else if (argvArrLen > 1) {
                fileName = argvArr[1];
            }
            if (fileName !== '') {
                if (fileName.indexOf('\\') !== -1) {
                    fileName = fileName.replace(/\\/g, '/');
                }
                const fileNameArr = fileName.split('/');
                const fileNameArrLen = fileNameArr.length;
                const fileNameStr = fileNameArr[fileNameArrLen - 1];
                if (fileNameStr === 'app') {
                    initFlag = false;
                }
                for (const item of fileNameArr) {
                    if (item === 'pm2') {
                        initFlag = false;
                        break;
                    }
                }
            }
            if (initFlag) {
                const spinner = utils_1.Console.spinner('正在初始化项目...', 'cyan');
                spinner.start();
                try {
                    await new Promise((resolve) => setTimeout(resolve, 1000)); // 模拟初始化时间
                    (0, generate_1.initFiles)(finalOptions.dictionary || '.', false, projectConfig);
                    spinner.succeed(`项目初始化完成! 目录: ${finalOptions.dictionary}`);
                    utils_1.Console.newLine();
                    utils_1.Console.box(`项目已成功创建到 ${finalOptions.dictionary} 目录\n\n` +
                        `下一步:\n` +
                        `1. cd ${finalOptions.dictionary}\n` +
                        `2. npm run dev\n\n` +
                        `默认登录账号: admin/admin123\n` +
                        `如需修改密码: npm run generate-password yourNewPassword\n` +
                        `然后修改 .env 中的 LOGIN_PASSWORD_HASH`, 'success');
                }
                catch (error) {
                    spinner.fail('项目初始化失败');
                    throw error;
                }
            }
            else {
                utils_1.Console.warning('跳过初始化（检测到特殊环境）');
            }
            process.exit(0);
        }
        catch (error) {
            utils_1.Console.error(`初始化失败: ${error}`);
            process.exit(1);
        }
    },
};
