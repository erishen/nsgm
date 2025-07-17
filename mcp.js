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

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.log("NSGM MCP Server 已启动");
}

main(); 