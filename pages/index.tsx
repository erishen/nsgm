import _ from 'lodash'
import { Container } from '../client/styled/common'
import React from 'react'
import { Card, Typography, Divider, Row, Col, Tag } from 'antd'
import { CodeOutlined, BookOutlined, DatabaseOutlined, SettingOutlined } from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography

const Page = () => {
  return (
    <Container>
      <Typography style={{ padding: '24px' }}>
        <Title level={1}>NSGM CLI</Title>

        <Paragraph>
          <Row gutter={[16, 16]}>
            <Col>
              <Tag color="blue">Next</Tag>
            </Col>
            <Col>
              <Tag color="purple">Styled-components</Tag>
            </Col>
            <Col>
              <Tag color="magenta">Graphql</Tag>
            </Col>
            <Col>
              <Tag color="green">Mysql</Tag>
            </Col>
          </Row>
        </Paragraph>
        <Paragraph>全栈架构，代码模板生成，快速开发</Paragraph>

        <Card style={{ marginBottom: '24px' }}>
          <Row gutter={[24, 16]}>
            <Col xs={24} md={8}>
              <Card
                type="inner"
                title={
                  <>
                    <DatabaseOutlined /> 数据库配置
                  </>
                }
              >
                数据库采用 Mysql, 配置见 mysql.config.js
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card
                type="inner"
                title={
                  <>
                    <SettingOutlined /> 项目配置
                  </>
                }
              >
                项目配置见 project.config.js
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card
                type="inner"
                title={
                  <>
                    <CodeOutlined /> 框架配置
                  </>
                }
              >
                Next 框架配置见 next.config.js
              </Card>
            </Col>
          </Row>
        </Card>

        <Title level={2}>
          <BookOutlined /> 命令
        </Title>
        <Divider />

        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card hoverable>
              <Title level={4}>项目管理</Title>
              <ul>
                <li>
                  <Text strong>nsgm init</Text> - 初始化项目
                </li>
                <li>
                  <Text strong>nsgm upgrade</Text> - 升级项目基础文件
                </li>
              </ul>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card hoverable>
              <Title level={4}>模板操作</Title>
              <ul>
                <li>
                  <Text strong>nsgm create</Text> - 创建模板页面
                </li>
                <li>
                  <Text strong>nsgm delete</Text> - 删除模板页面
                </li>
                <li>
                  <Text strong>nsgm deletedb</Text> - 删除模板页面及数据库表
                </li>
              </ul>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card hoverable>
              <Title level={4}>运行与构建</Title>
              <ul>
                <li>
                  <Text strong>nsgm dev</Text> - 开发模式
                </li>
                <li>
                  <Text strong>nsgm start</Text> - 生产模式
                </li>
                <li>
                  <Text strong>nsgm build</Text> - 编译
                </li>
                <li>
                  <Text strong>nsgm export</Text> - 导出静态页面
                </li>
              </ul>
            </Card>
          </Col>
        </Row>

        <Title level={2} style={{ marginTop: '24px' }}>
          参数
        </Title>
        <Divider />
        <Card>
          <ul>
            <li>
              <Text strong>dictionary:</Text> 在 export/init 的时候使用, 默认 webapp, 譬如: nsgm export/init
              dictionary=webapp 或者 nsgm export/init webapp
            </li>
            <li>
              <Text strong>controller:</Text> 在 create/delete 的时候使用， 必须有。譬如：nsgm create/delete math
            </li>
            <li>
              <Text strong>action:</Text> 在 create/delete 的时候使用， 默认 manage, 跟在 controller 后面， 譬如 nsgm
              create/delete math test
            </li>
          </ul>
        </Card>
      </Typography>
    </Container>
  )
}

Page.getInitialProps = () => {
  return {}
}

export default Page
