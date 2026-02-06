import { Command } from "./types";
import { buildCommand } from "./commands/build";
import { createCommand } from "./commands/create";
import { createConfigCommand } from "./commands/create-config";
import { deleteCommand, deleteDbCommand } from "./commands/delete";
import { exportCommand } from "./commands/export";
import { helpCommand } from "./commands/help";
import { initCommand } from "./commands/init";
import { devCommand, startCommand } from "./commands/server";
import { upgradeCommand } from "./commands/upgrade";
import { versionCommand } from "./commands/version";

/**
 * CLI 命令注册表
 */
export class CommandRegistry {
  private commands: Map<string, Command> = new Map();
  private aliases: Map<string, string> = new Map();

  constructor() {
    this.registerDefaultCommands();
  }

  /**
   * 注册默认命令
   */
  private registerDefaultCommands(): void {
    const commands = [
      buildCommand,
      createCommand,
      createConfigCommand,
      deleteCommand,
      deleteDbCommand,
      exportCommand,
      helpCommand,
      initCommand,
      devCommand,
      startCommand,
      upgradeCommand,
      versionCommand,
    ];

    for (const command of commands) {
      this.register(command);
    }
  }

  /**
   * 注册命令
   */
  register(command: Command): void {
    this.commands.set(command.name, command);

    // 注册别名
    for (const alias of command.aliases) {
      this.aliases.set(alias, command.name);
    }
  }

  /**
   * 获取命令
   */
  get(name: string): Command | undefined {
    // 首先检查是否是别名
    const realName = this.aliases.get(name) || name;
    return this.commands.get(realName);
  }

  /**
   * 获取所有命令
   */
  getAll(): Command[] {
    return Array.from(this.commands.values());
  }

  /**
   * 获取所有命令（别名方法）
   */
  getAllCommands(): Command[] {
    return this.getAll();
  }

  /**
   * 检查命令是否存在
   */
  has(name: string): boolean {
    const realName = this.aliases.get(name) || name;
    return this.commands.has(realName);
  }
}
