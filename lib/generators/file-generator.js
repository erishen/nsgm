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
exports.FileGenerator = void 0;
const i18n_generator_1 = require("./i18n-generator");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * 文件生成器
 * 负责将生成的内容写入到文件系统
 */
class FileGenerator {
    constructor(projectPath = ".") {
        this.projectPath = projectPath;
    }
    /**
     * 生成多语言文件
     */
    generateI18nFiles(controller, action, fields) {
        const i18nGenerator = new i18n_generator_1.I18nGenerator(controller, action, fields);
        // 定义支持的语言
        const locales = [
            { code: "zh-CN", generator: () => i18nGenerator.generateChineseTranslation() },
            { code: "en-US", generator: () => i18nGenerator.generateEnglishTranslation() },
            { code: "ja-JP", generator: () => i18nGenerator.generateJapaneseTranslation() },
        ];
        // 为每种语言生成文件
        locales.forEach((locale) => {
            const localeDir = path.join(this.projectPath, "public", "locales", locale.code);
            const filePath = path.join(localeDir, `${controller}.json`);
            // 确保目录存在
            this.ensureDirectoryExists(localeDir);
            // 生成内容
            const content = locale.generator();
            // 写入文件
            fs.writeFileSync(filePath, content, "utf8");
            console.log(`✅ 生成多语言文件: ${filePath}`);
        });
    }
    /**
     * 生成页面组件文件
     */
    generatePageFile(controller, action, _fields, content) {
        const pageDir = path.join(this.projectPath, "pages", controller);
        const filePath = path.join(pageDir, `${action}.tsx`);
        // 确保目录存在
        this.ensureDirectoryExists(pageDir);
        // 写入文件
        fs.writeFileSync(filePath, content, "utf8");
        console.log(`✅ 生成页面文件: ${filePath}`);
    }
    /**
     * 生成样式文件
     */
    generateStyleFile(controller, action) {
        const styleDir = path.join(this.projectPath, "client", "styled", controller);
        const filePath = path.join(styleDir, `${action}.ts`);
        // 确保目录存在
        this.ensureDirectoryExists(styleDir);
        const content = this.generateStyledComponentsContent(controller, action);
        // 写入文件
        fs.writeFileSync(filePath, content, "utf8");
        console.log(`✅ 生成样式文件: ${filePath}`);
    }
    /**
     * 生成Redux相关文件
     */
    generateReduxFiles(controller, action, _fields) {
        const reduxDir = path.join(this.projectPath, "client", "redux", controller, action);
        // 确保目录存在
        this.ensureDirectoryExists(reduxDir);
        // 生成actions文件
        const actionsContent = this.generateActionsContent(controller, action);
        fs.writeFileSync(path.join(reduxDir, "actions.ts"), actionsContent, "utf8");
        // 生成reducer文件
        const reducerContent = this.generateReducerContent(controller, action);
        fs.writeFileSync(path.join(reduxDir, "reducer.ts"), reducerContent, "utf8");
        console.log(`✅ 生成Redux文件: ${reduxDir}`);
    }
    /**
     * 生成服务文件
     */
    generateServiceFile(controller, action) {
        const serviceDir = path.join(this.projectPath, "client", "service", controller);
        const filePath = path.join(serviceDir, `${action}.ts`);
        // 确保目录存在
        this.ensureDirectoryExists(serviceDir);
        const content = this.generateServiceContent(controller, action);
        // 写入文件
        fs.writeFileSync(filePath, content, "utf8");
        console.log(`✅ 生成服务文件: ${filePath}`);
    }
    /**
     * 确保目录存在
     */
    ensureDirectoryExists(dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }
    /**
     * 生成样式组件内容
     */
    generateStyledComponentsContent(_controller, _action) {
        return `import styled from 'styled-components'
import { Button, Input, Table } from 'antd'

export const Container = styled.div\`
  padding: 24px;
  background: #fff;
  min-height: calc(100vh - 64px);

  .page-title {
    font-size: 24px;
    font-weight: 600;
    color: #1890ff;
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 2px solid #f0f0f0;
  }
\`

export const SearchRow = styled.div\`
  margin-bottom: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #d9d9d9;
\`

export const ModalContainer = styled.div\`
  .line {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    label {
      width: 80px;
      text-align: right;
      margin-right: 12px;
      color: #333;
      font-weight: 500;
    }

    .ant-input {
      flex: 1;
    }
  }
\`

export const StyledButton = styled(Button)<{ $primary?: boolean; $export?: boolean; $import?: boolean; $danger?: boolean }>\`
  display: flex;
  align-items: center;
  border-radius: 6px;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
  
  \${(props) =>
    props.$export &&
    \`
      background-color: #f6ffed;
      color: #52c41a;
      border-color: #b7eb8f;
      box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
      transition: all 0.3s ease;
    \`}
  
  \${(props) =>
    props.$import &&
    \`
      background-color: #e6f7ff;
      color: #1890ff;
      border-color: #91d5ff;
      box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
      transition: all 0.3s ease;
    \`}
    
  \${(props) =>
    props.$danger &&
    \`
      background-color: #fff1f0;
      border-color: #ffa39e;
      box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
      transition: all 0.3s ease;
    \`}
\`

export const StyledInput = styled(Input)\`
  width: 200px;
  border-radius: 6px;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
\`

export const StyledTable = styled(Table)\`
  margin-top: 16px;
  border-radius: 8px;
  overflow: hidden;

  .styled-pagination {
    margin-top: 16px;
    margin-bottom: 16px;
  }
  
  .table-row-light {
    background-color: #fafafa;
  }
  
  .table-row-dark {
    background-color: #ffffff;
  }
\`

export const ModalTitle = styled.div\`
  color: #1890ff;
  font-weight: 500;
\`

export const ModalInput = styled(Input)\`
  border-radius: 4px;
\`

export const IconWrapper = styled.i\`
  margin-right: 5px;
\`

export const RoundedButton = styled(Button)\`
  border-radius: 4px;
\`

export const GlobalStyle = styled.div\`
  .rounded-button {
    border-radius: 4px;
  }
\`
`;
    }
    /**
     * 生成Actions内容
     */
    generateActionsContent(controller, action) {
        const capitalizedController = controller.charAt(0).toUpperCase() + controller.slice(1);
        return `import { createAsyncThunk } from '@reduxjs/toolkit'
import { get${capitalizedController}Service } from '@/service/${controller}/${action}'

// 异步actions
export const updateSSR${capitalizedController} = createAsyncThunk(
  '${controller}${action}/updateSSR${capitalizedController}',
  async (${controller}: any) => {
    return ${controller}
  }
)

export const search${capitalizedController} = createAsyncThunk(
  '${controller}${action}/search${capitalizedController}',
  async ({ offset, limit, searchData }: { offset: number; limit: number; searchData: any }) => {
    const response = await get${capitalizedController}Service(offset, limit, searchData)
    return response.data.${controller}
  }
)

export const add${capitalizedController} = createAsyncThunk(
  '${controller}${action}/add${capitalizedController}',
  async (${controller}Data: any) => {
    // 实现添加逻辑
    return ${controller}Data
  }
)

export const mod${capitalizedController} = createAsyncThunk(
  '${controller}${action}/mod${capitalizedController}',
  async ({ id, ${controller}Data }: { id: number; ${controller}Data: any }) => {
    // 实现修改逻辑
    return { id, ${controller}Data }
  }
)

export const del${capitalizedController} = createAsyncThunk(
  '${controller}${action}/del${capitalizedController}',
  async (id: number) => {
    // 实现删除逻辑
    return id
  }
)

export const batchDel${capitalizedController} = createAsyncThunk(
  '${controller}${action}/batchDel${capitalizedController}',
  async (ids: number[]) => {
    // 实现批量删除逻辑
    return ids
  }
)
`;
    }
    /**
     * 生成Reducer内容
     */
    generateReducerContent(controller, action) {
        const capitalizedController = controller.charAt(0).toUpperCase() + controller.slice(1);
        const capitalizedAction = action.charAt(0).toUpperCase() + action.slice(1);
        return `import { createSlice } from '@reduxjs/toolkit'
import {
  updateSSR${capitalizedController},
  search${capitalizedController},
  add${capitalizedController},
  mod${capitalizedController},
  del${capitalizedController},
  batchDel${capitalizedController}
} from './actions'

interface ${capitalizedController}State {
  ${controller}: any
  firstLoadFlag: boolean
  loading: boolean
  error: string | null
}

const initialState: ${capitalizedController}State = {
  ${controller}: {
    totalCounts: 0,
    items: []
  },
  firstLoadFlag: true,
  loading: false,
  error: null
}

const ${controller}${capitalizedAction}Slice = createSlice({
  name: '${controller}${capitalizedAction}',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateSSR${capitalizedController}.fulfilled, (state, action) => {
        state.${controller} = action.payload
        state.firstLoadFlag = false
      })
      .addCase(search${capitalizedController}.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(search${capitalizedController}.fulfilled, (state, action) => {
        state.${controller} = action.payload
        state.loading = false
      })
      .addCase(search${capitalizedController}.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Search failed'
      })
      .addCase(add${capitalizedController}.fulfilled, (state, action) => {
        state.${controller}.items.push(action.payload)
        state.${controller}.totalCounts += 1
      })
      .addCase(mod${capitalizedController}.fulfilled, (state, action) => {
        const index = state.${controller}.items.findIndex((item: any) => item.id === action.payload.id)
        if (index !== -1) {
          state.${controller}.items[index] = { ...state.${controller}.items[index], ...action.payload.${controller}Data }
        }
      })
      .addCase(del${capitalizedController}.fulfilled, (state, action) => {
        state.${controller}.items = state.${controller}.items.filter((item: any) => item.id !== action.payload)
        state.${controller}.totalCounts -= 1
      })
      .addCase(batchDel${capitalizedController}.fulfilled, (state, action) => {
        state.${controller}.items = state.${controller}.items.filter((item: any) => !action.payload.includes(item.id))
        state.${controller}.totalCounts -= action.payload.length
      })
  }
})

export default ${controller}${capitalizedAction}Slice.reducer
`;
    }
    /**
     * 生成Service内容
     */
    generateServiceContent(controller, _action) {
        const capitalizedController = controller.charAt(0).toUpperCase() + controller.slice(1);
        return `import { myFetch } from '@/utils/fetch'

/**
 * ${capitalizedController} 服务
 */
export const get${capitalizedController}Service = async (offset: number = 0, limit: number = 100, searchData: any = {}) => {
  const params = new URLSearchParams({
    offset: offset.toString(),
    limit: limit.toString(),
    ...searchData
  })

  return await myFetch(\`/rest/${controller}?\${params}\`, {
    method: 'GET'
  })
}

export const add${capitalizedController}Service = async (data: any) => {
  return await myFetch(\`/rest/${controller}\`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export const update${capitalizedController}Service = async (id: number, data: any) => {
  return await myFetch(\`/rest/${controller}/\${id}\`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export const delete${capitalizedController}Service = async (id: number) => {
  return await myFetch(\`/rest/${controller}/\${id}\`, {
    method: 'DELETE'
  })
}

export const batchDelete${capitalizedController}Service = async (ids: number[]) => {
  return await myFetch(\`/rest/${controller}/batch\`, {
    method: 'DELETE',
    body: JSON.stringify({ ids })
  })
}
`;
    }
}
exports.FileGenerator = FileGenerator;
