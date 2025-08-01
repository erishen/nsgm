# Prisma 迁移指南

## 1. 安装 Prisma

```bash
npm install prisma @prisma/client
npx prisma init
```

## 2. 配置 Prisma Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Template {
  id          Int      @id @default(autoincrement())
  name        String   @db.VarChar(100)
  create_date DateTime @default(now()) @db.Timestamp(3)
  update_date DateTime @default(now()) @updatedAt @db.Timestamp(3)

  @@map("template")
}
```

## 3. 环境变量配置

```env
# .env
DATABASE_URL="mysql://root:password@127.0.0.1:3306/crm_demo"
```

## 4. 改写 resolver.js

```javascript
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// 输入验证函数保持不变
const validatePagination = (page, pageSize) => {
  if (page < 0 || pageSize <= 0 || pageSize > 100) {
    throw new Error('分页参数无效')
  }
}

const validateId = (id) => {
  if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
    throw new Error('ID参数无效')
  }
}

const validateName = (name) => {
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('名称参数无效')
  }
}

module.exports = {
  // 获取模板列表（分页）
  template: async ({ page = 0, pageSize = 10 }) => {
    try {
      const pageNum = parseInt(page, 10) || 0
      const pageSizeNum = parseInt(pageSize, 10) || 10

      validatePagination(pageNum, pageSizeNum)

      const [items, totalCount] = await Promise.all([
        prisma.template.findMany({
          select: { id: true, name: true },
          skip: pageNum * pageSizeNum,
          take: pageSizeNum
        }),
        prisma.template.count()
      ])

      return {
        totalCounts: totalCount,
        items
      }
    } catch (error) {
      console.error('获取模板列表失败:', error.message)
      throw error
    }
  },

  // 根据ID获取模板
  templateGet: async ({ id }) => {
    try {
      validateId(id)

      const template = await prisma.template.findUnique({
        where: { id: parseInt(id) },
        select: { id: true, name: true }
      })

      if (!template) {
        throw new Error(`ID为 ${id} 的模板不存在`)
      }

      return template
    } catch (error) {
      console.error('获取模板失败:', error.message)
      throw error
    }
  },

  // 搜索模板（分页）
  templateSearch: async ({ page = 0, pageSize = 10, data = {} }) => {
    try {
      validatePagination(page, pageSize)

      const { name } = data
      const where = name && name.trim() !== '' ? { name: { contains: name.trim() } } : {}

      const [items, totalCount] = await Promise.all([
        prisma.template.findMany({
          where,
          select: { id: true, name: true },
          skip: page * pageSize,
          take: pageSize
        }),
        prisma.template.count({ where })
      ])

      return {
        totalCounts: totalCount,
        items
      }
    } catch (error) {
      console.error('搜索模板失败:', error.message)
      throw error
    }
  },

  // 添加模板
  templateAdd: async ({ data }) => {
    try {
      const { name } = data || {}
      validateName(name)

      const result = await prisma.template.create({
        data: { name: name.trim() }
      })

      return result.id
    } catch (error) {
      console.error('添加模板失败:', error.message)
      throw error
    }
  },

  // 批量添加模板
  templateBatchAdd: async ({ datas }) => {
    try {
      if (!Array.isArray(datas) || datas.length === 0) {
        throw new Error('批量添加数据不能为空')
      }

      const templateData = datas.map((item) => {
        const { name } = item || {}
        validateName(name)
        return { name: name.trim() }
      })

      const result = await prisma.template.createMany({
        data: templateData
      })

      return result.count
    } catch (error) {
      console.error('批量添加模板失败:', error.message)
      throw error
    }
  },

  // 更新模板
  templateUpdate: async ({ id, data }) => {
    try {
      validateId(id)
      const { name } = data || {}

      if (!name) {
        throw new Error('更新数据不能为空')
      }

      validateName(name)

      const result = await prisma.template.update({
        where: { id: parseInt(id) },
        data: { name: name.trim() }
      })

      return true
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error(`ID为 ${id} 的模板不存在`)
      }
      console.error('更新模板失败:', error.message)
      throw error
    }
  },

  // 删除模板
  templateDelete: async ({ id }) => {
    try {
      validateId(id)

      await prisma.template.delete({
        where: { id: parseInt(id) }
      })

      return true
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error(`ID为 ${id} 的模板不存在`)
      }
      console.error('删除模板失败:', error.message)
      throw error
    }
  },

  // 批量删除模板
  templateBatchDelete: async ({ ids }) => {
    try {
      if (!Array.isArray(ids) || ids.length === 0) {
        throw new Error('批量删除的ID列表不能为空')
      }

      ids.forEach((id) => validateId(id))

      const result = await prisma.template.deleteMany({
        where: {
          id: { in: ids.map((id) => parseInt(id)) }
        }
      })

      if (result.count === 0) {
        throw new Error('没有找到要删除的模板')
      }

      return true
    } catch (error) {
      console.error('批量删除模板失败:', error.message)
      throw error
    }
  }
}
```

## 5. 优缺点对比

### 原生 SQL 方式

**优点：**

- 性能最优
- SQL 灵活性高
- 学习成本低（团队熟悉 SQL）

**缺点：**

- 缺乏类型安全
- 手动处理数据库连接
- 容易出现 SQL 注入风险

### Prisma 方式

**优点：**

- 类型安全，编译时检查
- 自动生成客户端
- 内置连接池管理
- 数据库迁移工具
- 现代化开发体验

**缺点：**

- 学习成本
- 性能可能略低于原生 SQL
- 复杂查询可能需要原生 SQL

## 6. 迁移建议

如果决定迁移，建议：

1. **先在新功能中使用 Prisma**
2. **保持现有 API 接口不变**
3. **逐步重构现有模块**
4. **充分测试确保功能正常**

## 7. 混合使用

也可以考虑混合使用：

- 简单 CRUD 操作使用 Prisma
- 复杂查询仍使用原生 SQL
