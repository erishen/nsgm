"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandRegistry = void 0;
const build_1 = require("./commands/build");
const create_1 = require("./commands/create");
const create_config_1 = require("./commands/create-config");
const delete_1 = require("./commands/delete");
const export_1 = require("./commands/export");
const help_1 = require("./commands/help");
const init_1 = require("./commands/init");
const server_1 = require("./commands/server");
const upgrade_1 = require("./commands/upgrade");
const version_1 = require("./commands/version");
/**
 * CLI 命令注册表
 */
class CommandRegistry {
    constructor() {
        this.commands = new Map();
        this.aliases = new Map();
        this.registerDefaultCommands();
    }
    /**
     * 注册默认命令
     */
    registerDefaultCommands() {
        const commands = [
            build_1.buildCommand,
            create_1.createCommand,
            create_config_1.createConfigCommand,
            delete_1.deleteCommand,
            delete_1.deleteDbCommand,
            export_1.exportCommand,
            help_1.helpCommand,
            init_1.initCommand,
            server_1.devCommand,
            server_1.startCommand,
            upgrade_1.upgradeCommand,
            version_1.versionCommand,
        ];
        for (const command of commands) {
            this.register(command);
        }
    }
    /**
     * 注册命令
     */
    register(command) {
        this.commands.set(command.name, command);
        // 注册别名
        for (const alias of command.aliases) {
            this.aliases.set(alias, command.name);
        }
    }
    /**
     * 获取命令
     */
    get(name) {
        // 首先检查是否是别名
        const realName = this.aliases.get(name) || name;
        return this.commands.get(realName);
    }
    /**
     * 获取所有命令
     */
    getAll() {
        return Array.from(this.commands.values());
    }
    /**
     * 获取所有命令（别名方法）
     */
    getAllCommands() {
        return this.getAll();
    }
    /**
     * 检查命令是否存在
     */
    has(name) {
        const realName = this.aliases.get(name) || name;
        return this.commands.has(realName);
    }
}
exports.CommandRegistry = CommandRegistry;
