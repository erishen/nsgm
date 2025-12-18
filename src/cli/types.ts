/**
 * CLI 类型定义
 */

export * from "./types/project";

export interface CommandOptions {
  dictionary?: string;
  controller?: string;
  action?: string;
  [key: string]: any;
}

export interface Command {
  name: string;
  aliases: string[];
  description: string;
  usage?: string;
  examples?: string[];
  options?: CommandOption[];
  execute: (options: CommandOptions) => Promise<void> | void;
}

export interface CommandOption {
  name: string;
  alias?: string;
  description: string;
  required?: boolean;
  default?: any;
  type?: "string" | "number" | "boolean";
}

export interface ParsedArgs {
  command: string;
  options: CommandOptions;
}
