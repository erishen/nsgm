import type { NextApiRequest, NextApiResponse } from 'next';
import { graphqlHTTP } from 'graphql-http';
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 处理 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const result = await graphqlHTTP({
      schema,
      rootValue,
      graphiql: true,
    })(req, res);

    return result;
  } catch (error) {
    console.warn('[GraphQL] Error:', error);
    res.status(500).json({
      errors: [{ message: 'Internal server error' }],
    });
  }
}
