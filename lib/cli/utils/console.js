"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Console = void 0;
const chalk_1 = __importDefault(require("chalk"));
/**
 * 控制台输出工具类
 */
class Console {
    /**
     * 成功消息
     */
    static success(message) {
        console.log(chalk_1.default.green('✅ ') + chalk_1.default.white(message));
    }
    /**
     * 错误消息
     */
    static error(message) {
        console.log(chalk_1.default.red('❌ ') + chalk_1.default.white(message));
    }
    /**
     * 警告消息
     */
    static warning(message) {
        console.log(chalk_1.default.yellow('⚠️  ') + chalk_1.default.white(message));
    }
    /**
     * 信息消息
     */
    static info(message) {
        console.log(chalk_1.default.blue('ℹ️  ') + chalk_1.default.white(message));
    }
    /**
     * 调试消息
     */
    static debug(message) {
        console.log(chalk_1.default.gray('🐛 ') + chalk_1.default.gray(message));
    }
    /**
     * 标题
     */
    static title(message) {
        console.log(chalk_1.default.bold.blue(message));
    }
    /**
     * 副标题
     */
    static subtitle(message) {
        console.log(chalk_1.default.cyan(message));
    }
    /**
     * 突出显示
     */
    static highlight(message) {
        console.log(chalk_1.default.bold.yellow(message));
    }
    /**
     * 分隔线
     */
    static separator() {
        console.log(chalk_1.default.gray('─'.repeat(50)));
    }
    /**
     * 空行
     */
    static newLine(count = 1) {
        console.log('\n'.repeat(count - 1));
    }
    /**
     * 简单的加载动画
     */
    static spinner(text, color = 'cyan') {
        let spinnerInterval = null;
        const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        let currentFrame = 0;
        return {
            start() {
                process.stdout.write(chalk_1.default[color](`${frames[0]} ${text}`));
                spinnerInterval = setInterval(() => {
                    currentFrame = (currentFrame + 1) % frames.length;
                    process.stdout.write(`\r${chalk_1.default[color](`${frames[currentFrame]} ${text}`)}`);
                }, 100);
            },
            stop() {
                if (spinnerInterval) {
                    clearInterval(spinnerInterval);
                    spinnerInterval = null;
                    process.stdout.write(`\r${' '.repeat(text.length + 2)}\r`);
                }
            },
            succeed(message) {
                this.stop();
                Console.success(message || text);
            },
            fail(message) {
                this.stop();
                Console.error(message || text);
            },
        };
    }
    /**
     * 带边框的消息
     */
    static box(message, type = 'info') {
        const colors = {
            success: chalk_1.default.green,
            error: chalk_1.default.red,
            warning: chalk_1.default.yellow,
            info: chalk_1.default.blue,
        };
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️',
        };
        const color = colors[type];
        const icon = icons[type];
        const lines = message.split('\n');
        const maxLength = Math.max(...lines.map((line) => line.length));
        const border = '─'.repeat(maxLength + 4);
        console.log(color(`┌${border}┐`));
        console.log(color(`│ ${icon}  ${' '.repeat(maxLength - 1)} │`));
        lines.forEach((line) => {
            const padding = ' '.repeat(maxLength - line.length);
            console.log(color(`│  ${line}${padding}  │`));
        });
        console.log(color(`└${border}┘`));
    }
    /**
     * 进度条（简单版本）
     */
    static progress(current, total, description = '') {
        const percentage = Math.round((current / total) * 100);
        const completed = Math.round((current / total) * 20);
        const remaining = 20 - completed;
        const progressBar = chalk_1.default.green('█'.repeat(completed)) + chalk_1.default.gray('░'.repeat(remaining));
        const text = description ? ` ${description}` : '';
        process.stdout.write(`\r[${progressBar}] ${percentage}%${text}`);
        if (current === total) {
            console.log(); // 换行
        }
    }
}
exports.Console = Console;
