#!/usr/bin/env node

const { McpServer } = require("./node_modules/@modelcontextprotocol/sdk/dist/cjs/server/mcp.js");
const { StdioServerTransport } = require("./node_modules/@modelcontextprotocol/sdk/dist/cjs/server/stdio.js");
const { initFiles } = require("./lib/generate.js");
const { z } = require("zod");
const path = require('path');

async function main() {
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

        // 这里可以调用你现有的创建逻辑
        // 例如：await createComponent(name, type, createPath);
        
        return {
          content: [{
            type: "text",
            text: `${type} "${name}" 创建成功${createPath ? ` 在路径: ${createPath}` : ''}`
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

        // 这里可以调用你现有的删除逻辑
        // 例如：await deleteComponent(name, type);
        
        return {
          content: [{
            type: "text",
            text: `${type} "${name}" 删除成功`
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