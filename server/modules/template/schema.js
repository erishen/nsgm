module.exports = {
    query: `
        template(page: Int, pageSize: Int): Templates
        templateGet(id: Int): Template
        templateSearch(page: Int, pageSize: Int, data: TemplateSearchInput): Templates
    `,
    mutation: `
        templateAdd(data: TemplateAddInput): Int
        templateBatchAdd(datas: [TemplateAddInput]): Int
        templateUpdate(id: Int, data: TemplateAddInput): Boolean
        templateDelete(id: Int): Boolean
        templateBatchDelete(ids: [Int]): Boolean
    `,
    subscription: ``,
    type: `
        type Template {
            id: Int
            name: String
        }

        type Templates {
            totalCounts: Int
            items: [Template]
        }

        input TemplateAddInput {
            name: String
        }

        input TemplateSearchInput {
            name: String
        }
    `
} 