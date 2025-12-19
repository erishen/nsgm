import type { NextApiRequest, NextApiResponse } from 'next';
import { createHandler } from 'graphql-http/lib/use/next';
import { buildSchema } from 'graphql';

// 简单的 GraphQL schema
const schema = buildSchema(`
  type Query {
    hello: String
    template(page: Int, pageSize: Int): TemplateResult
  }

  type TemplateResult {
    totalCounts: Int
    items: [Template]
  }

  type Template {
    id: String
    name: String
  }
`);

// GraphQL resolvers
const rootValue = {
  hello: () => 'Hello World!',
  template: ({ page = 0, pageSize = 10 }: { page?: number; pageSize?: number }) => {
    // 返回示例数据
    return {
      totalCounts: 0,
      items: [],
    };
  },
};

export default createHandler({
  schema,
  rootValue,
  graphiql: true,
});
