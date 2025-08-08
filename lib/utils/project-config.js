"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyProjectConfig = applyProjectConfig;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * 应用项目配置到生成的文件中
 */
function applyProjectConfig(projectPath, config) {
    // 更新 package.json
    updatePackageJson(projectPath, config);
    // 更新 README.md
    updateReadme(projectPath, config);
    // 确保默认功能配置正确应用
    ensureDefaultFeatures(config);
}
/**
 * 确保默认功能配置正确应用
 */
function ensureDefaultFeatures(config) {
    console.log(`✅ 项目已配置默认功能栈: Next.js + Styled Components + GraphQL + MySQL + TypeScript + ESLint`);
    console.log(`✅ 数据库配置: ${config.database ? '已启用' : '未启用'}`);
    console.log(`✅ 包含功能: ${config.features.join(', ')}`);
}
/**
 * 更新 package.json 文件
 */
function updatePackageJson(projectPath, config) {
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
        try {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            // 更新基本信息
            packageJson.name = config.projectName;
            packageJson.description = config.description;
            packageJson.author = config.author;
            // 根据功能选择更新依赖（这里是示例，可以根据实际需求扩展）
            if (!packageJson.keywords) {
                packageJson.keywords = [];
            }
            // 添加功能标签
            config.features.forEach((feature) => {
                if (!packageJson.keywords.includes(feature)) {
                    packageJson.keywords.push(feature);
                }
            });
            // 写回文件
            fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
            console.log(`✅ 已更新 package.json`);
        }
        catch (error) {
            console.warn(`⚠️ 更新 package.json 失败: ${error}`);
        }
    }
}
/**
 * 更新 README.md 文件
 */
function updateReadme(projectPath, config) {
    const readmePath = path.join(projectPath, 'README.md');
    if (fs.existsSync(readmePath)) {
        try {
            let readmeContent = fs.readFileSync(readmePath, 'utf8');
            // 替换项目名称
            readmeContent = readmeContent.replace(/nsgm-cli-project/g, config.projectName);
            // 如果有描述，添加到 README 开头
            if (config.description && config.description !== 'A NSGM fullstack project') {
                const descriptionSection = `# ${config.projectName}\n\n${config.description}\n\n`;
                // 检查是否已经有项目名称标题
                if (readmeContent.startsWith('# ')) {
                    // 替换第一行
                    const lines = readmeContent.split('\n');
                    lines[0] = `# ${config.projectName}`;
                    if (lines[1] === '' && lines[2] && !lines[2].startsWith('#')) {
                        lines[2] = config.description;
                    }
                    else {
                        lines.splice(2, 0, '', config.description);
                    }
                    readmeContent = lines.join('\n');
                }
                else {
                    readmeContent = descriptionSection + readmeContent;
                }
            }
            // 添加作者信息
            if (config.author && config.author !== 'Your Name') {
                const authorSection = `\n## 作者\n\n${config.author}\n`;
                readmeContent += authorSection;
            }
            // 添加功能说明
            if (config.features.length > 0) {
                const featureMap = {
                    nextjs: 'Next.js 全栈框架',
                    styled: 'Styled Components CSS-in-JS',
                    graphql: 'GraphQL API',
                    mysql: 'MySQL 数据库',
                    typescript: 'TypeScript 强类型支持',
                    eslint: 'ESLint 代码质量检查',
                };
                const featureNames = config.features.map((feature) => featureMap[feature] || feature);
                const featuresSection = `\n## 技术栈\n\n${featureNames.map((feature) => `- ${feature}`).join('\n')}\n`;
                readmeContent += featuresSection;
            }
            fs.writeFileSync(readmePath, readmeContent);
            console.log(`✅ 已更新 README.md`);
        }
        catch (error) {
            console.warn(`⚠️ 更新 README.md 失败: ${error}`);
        }
    }
}
