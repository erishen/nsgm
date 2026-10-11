#!/usr/bin/env node

const { McpServer } = require("@modelcontextprotocol/sdk/dist/cjs/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/dist/cjs/server/stdio.js");
const { initFiles, createFiles, deleteFiles } = require("./lib/generate.js");
const { z } = require("zod");
const path = require('path');

async function main() {
  // nsgm generate 内部大量 console.log 直接写到 stdout，
  // 会污染 MCP 的 stdio JSON-RPC 协议流。整体重定向到 stderr。
  console.log = (...args) => console.error(...args);

  const server = new McpServer({
    name: "nsgm-mcp-server",
    version: "1.0.0"
  });

  server.tool(
    "init",
    {
      dictionary: z.string().describe("项目初始化目录"),
    },
    async ({ dictionary = 'mcp-test' }) => {
      try {
        const PROJECT_ROOT = process.env.MCP_PROJECT_ROOT;
        if (!PROJECT_ROOT) {
          throw new Error('必须设置 MCP_PROJECT_ROOT 环境变量');
        }
        if (PROJECT_ROOT === '/' || PROJECT_ROOT.startsWith('/readonly')) {
          throw new Error('不允许在根目录或只读目录下生成文件，请设置 MCP_PROJECT_ROOT 环境变量');
        }

        let targetDir = PROJECT_ROOT;
        if (dictionary) {
          if (path.isAbsolute(dictionary)) {
            throw new Error('dictionary 只能是相对路径，不能是绝对路径');
          }
          const resolved = path.resolve(PROJECT_ROOT, dictionary);
          if (!resolved.startsWith(PROJECT_ROOT)) {
            throw new Error('不允许越出 PROJECT_ROOT 目录');
          }
          targetDir = resolved;
        }

        await initFiles(targetDir);
        return {
          content: [{
            type: "text",
            text: `项目初始化完成: ${targetDir}`
          }]
        };
      } catch (err) {
        return {
          content: [{
            type: "text",
            text: err.message,
            dictionary
          }], isError: true
        };
      }
    }
  );

  // 添加项目创建工具
  server.tool(
    "create",
    {
      name: z.string().describe("要创建的组件/页面/模块名称"),
      type: z.enum(["component", "page", "module", "api"]).describe("创建类型: component(组件), page(页面), module(模块), api(接口)"),
      path: z.string().optional().describe("可选的创建路径，相对于项目根目录")
    },
    async ({ name, type, path: createPath }) => {
      try {
        const PROJECT_ROOT = process.env.MCP_PROJECT_ROOT;
        if (!PROJECT_ROOT) {
          throw new Error('必须设置 MCP_PROJECT_ROOT 环境变量');
        }
        if (PROJECT_ROOT === '/' || PROJECT_ROOT.startsWith('/readonly')) {
          throw new Error('不允许在根目录或只读目录下生成文件，请设置 MCP_PROJECT_ROOT 环境变量');
        }

        // 计算目标目录：PROJECT_ROOT 为基底，createPath 仅允许相对子目录
        let targetDir = PROJECT_ROOT;
        if (createPath) {
          if (path.isAbsolute(createPath)) {
            throw new Error('path 只能是相对路径，不能是绝对路径');
          }
          const resolved = path.resolve(PROJECT_ROOT, createPath);
          if (!resolved.startsWith(PROJECT_ROOT)) {
            throw new Error('不允许越出 PROJECT_ROOT 目录');
          }
          targetDir = resolved;
        }

        // 底层 generate.createFiles(controller, action, dictionary, fields, type)：
        // name -> controller，type -> action（动作名，出现在 page/module 文件名中），
        // targetDir -> dictionary（绝对路径，靠 path.join 绝对路径覆盖落到项目），
        // 末尾 type -> 分层过滤（page/component=前端组，module/api=后端组，api 额外注入 rest 路由）。
        // 默认 CRUD 字段由底层提供（不传 fields）。
        createFiles(name, type, targetDir, undefined, type);

        return {
          content: [{
            type: "text",
            text:
              `已在 ${targetDir} 为资源 "${name}" 生成动作 "${type}" 的 CRUD 脚手架` +
              `（pages / client/redux / client/service / server/modules / server/sql 等）。\n` +
              `注：底层会按 nsgm 的 MySQL 配置尝试执行建表 SQL，如未配置本地 MySQL 或不想自动建表，` +
              `该步骤会报错但不影响文件生成，可手动执行生成的 server/sql/${name}.sql。`
          }]
        };
      } catch (err) {
        return {
          content: [{
            type: "text",
            text: `创建失败: ${err.message}`
          }], 
          isError: true
        };
      }
    }
  );

  // 添加项目删除工具
  server.tool(
    "delete",
    {
      name: z.string().describe("要删除的组件/页面/模块名称"),
      type: z.enum(["component", "page", "module", "api"]).describe("删除类型"),
      confirm: z.boolean().default(false).describe("确认删除")
    },
    async ({ name, type, confirm }) => {
      try {
        if (!confirm) {
          return {
            content: [{
              type: "text",
              text: `请确认删除 ${type} "${name}"，设置 confirm 为 true`
            }]
          };
        }

        const PROJECT_ROOT = process.env.MCP_PROJECT_ROOT;
        if (!PROJECT_ROOT) {
          throw new Error('必须设置 MCP_PROJECT_ROOT 环境变量');
        }
        if (PROJECT_ROOT === '/' || PROJECT_ROOT.startsWith('/readonly')) {
          throw new Error('不允许在根目录或只读目录下删除文件，请设置 MCP_PROJECT_ROOT 环境变量');
        }

        // 底层 generate.deleteFiles(controller, action, deleteDBFlag, dictionary)：
        // name -> controller，type -> action，PROJECT_ROOT -> dictionary（绝对路径）。
        // deleteDBFlag 传 false：MCP 场景不自动 DROP 表，避免意外破坏数据库。
        deleteFiles(name, type, false, PROJECT_ROOT);

        return {
          content: [{
            type: "text",
            text: `已在 ${PROJECT_ROOT} 删除资源 "${name}" 的动作 "${type}" 相关文件（pages / client / server 等）。`
          }]
        };
      } catch (err) {
        return {
          content: [{
            type: "text",
            text: `删除失败: ${err.message}`
          }], 
          isError: true
        };
      }
    }
  );

  // 添加项目信息查询工具
  server.tool(
    "info",
    {
      target: z.enum(["project", "dependencies", "scripts"]).describe("查询目标: project(项目信息), dependencies(依赖), scripts(脚本)")
    },
    async ({ target }) => {
      try {
        const PROJECT_ROOT = process.env.MCP_PROJECT_ROOT;
        if (!PROJECT_ROOT) {
          throw new Error('必须设置 MCP_PROJECT_ROOT 环境变量');
        }

        const fs = require('fs');
        const packageJsonPath = path.join(PROJECT_ROOT, 'package.json');
        
        if (!fs.existsSync(packageJsonPath)) {
          throw new Error('未找到 package.json 文件');
        }

        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        let result = '';
        switch (target) {
          case 'project': {
            result = `项目目录: ${packageJson.name}
版本: ${packageJson.version}
描述: ${packageJson.description || '无描述'}`;
            break;
          }
          case 'dependencies': {
            const deps = Object.keys(packageJson.dependencies || {});
            const devDeps = Object.keys(packageJson.devDependencies || {});
            result = `生产依赖 (${deps.length}): ${deps.join(', ')}
开发依赖 (${devDeps.length}): ${devDeps.join(', ')}`;
            break;
          }
          case 'scripts': {
            const scripts = Object.entries(packageJson.scripts || {})
              .map(([key, value]) => `${key}: ${value}`)
              .join('\n');
            result = `可用脚本:\n${scripts}`;
            break;
          }
        }
        
        return {
          content: [{
            type: "text",
            text: result
          }]
        };
      } catch (err) {
        return {
          content: [{
            type: "text",
            text: `查询失败: ${err.message}`
          }], 
          isError: true
        };
      }
    }
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.log("NSGM MCP Server 已启动");
}

main(); 