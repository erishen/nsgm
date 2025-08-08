"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionCommand = void 0;
exports.versionCommand = {
    name: 'version',
    aliases: ['-v', '--version'],
    description: '显示版本信息',
    usage: 'nsgm version',
    examples: ['nsgm version', 'nsgm -v'],
    execute: async () => {
        try {
            const { version } = require('../../../package.json');
            console.log(`📦 NSGM CLI 版本: ${version}`);
            // 显示额外的环境信息
            console.log(`🔧 Node.js 版本: ${process.version}`);
            console.log(`💻 运行平台: ${process.platform} ${process.arch}`);
            process.exit(0);
        }
        catch (error) {
            console.error('❌ 无法获取版本信息:', error);
            process.exit(1);
        }
    }
};
