import MarkdownIt from 'markdown-it'
import _ from 'lodash'
import { Container } from '../client/styled/common'
import getConfig from 'next/config'
import React from 'react'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

const nextConfig = getConfig()
const { publicRuntimeConfig } = nextConfig
const { env } = publicRuntimeConfig

const renderArr: any = []

renderArr.push('# NSGM CLI ' + env)
renderArr.push('- 技术栈: [Next](https://github.com/vercel/next.js), [Styled-components](https://github.com/styled-components/styled-components), [Graphql](https://graphql.org/), [Mysql](https://www.mysql.com/)')
renderArr.push('- 全栈架构，代码模板生成，快速开发')
renderArr.push('- 数据库采用 Mysql, 配置见 mysql.config.js')
renderArr.push('- 项目配置见 project.config.js')
renderArr.push('- Next 框架配置见 next.config.js')

renderArr.push('## 命令')
renderArr.push('- nsgm init     初始化项目')
renderArr.push('- nsgm upgrade  升级项目基础文件')
renderArr.push('- nsgm create   创建模板页面')
renderArr.push('- nsgm delete   删除模板页面')
renderArr.push('- nsgm deletedb 删除模板页面及数据库表')
renderArr.push('- nsgm dev      开发模式')
renderArr.push('- nsgm start    生产模式')
renderArr.push('- nsgm build    编译')
renderArr.push('- nsgm export   导出静态页面')

renderArr.push('## 参数')
renderArr.push('- dictionary: 在 export/init 的时候使用, 默认 webapp, 譬如: nsgm export/init dictionary=webapp 或者 nsgm export/init webapp')
renderArr.push('- controller: 在 create/delete 的时候使用， 必须有。譬如：nsgm create/delete math')
renderArr.push('- action:     在 create/delete 的时候使用， 默认 manage, 跟在 controller 后面， 譬如 nsgm create/delete math test')


const Page = ({ html }) => {

  const createMarkup = () => {
    return {
      __html: html
    }
  }

  return (
    <Container>
      <div dangerouslySetInnerHTML={createMarkup()} />
    </Container>
  )
}

Page.getInitialProps = () => {
  let html = ''
  _.each(renderArr, (item, index) => {
    html += md.render(item)
  })

  return {
    html
  }
}

export default Page