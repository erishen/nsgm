"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageGenerator = void 0;
const base_generator_1 = require("./base-generator");
/**
 * 页面生成器
 * 基于现有的 pages/template/manage.tsx 模板生成页面组件
 */
class PageGenerator extends base_generator_1.BaseGenerator {
    generate() {
        const capitalizedController = this.getCapitalizedController();
        const capitalizedAction = this.getCapitalizedAction();
        // 获取各种字段类型
        const listFields = this.getDisplayFields();
        const formFields = this.getFormFields();
        const searchFields = this.getSearchableFields();
        // 生成键值标题映射
        const keyTitles = this.generateKeyTitles();
        // 生成表格列定义
        const tableColumns = this.generateTableColumns(listFields);
        // 生成表单字段
        const modalFields = this.generateModalFields(formFields);
        // 生成搜索字段（取第一个可搜索字段作为主要搜索）
        const mainSearchField = searchFields.length > 0 ? searchFields[0] : null;
        return `import React, { useState, useEffect } from 'react'
import { ConfigProvider, Table, Modal, Button, Input, Space, Upload, message } from 'antd'
import { Container, SearchRow, ModalContainer } from '@/styled/${this.controller}/${this.action}'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import {
  add${capitalizedController},
  mod${capitalizedController},
  del${capitalizedController},
  updateSSR${capitalizedController},
  search${capitalizedController},
  batchDel${capitalizedController}
} from '@/redux/${this.controller}/${this.action}/actions'
import { get${capitalizedController}Service } from '@/service/${this.controller}/${this.action}'
import { RootState, AppDispatch } from '@/redux/store'
import _ from 'lodash'
import locale from 'antd/lib/locale/zh_CN'
import { handleXSS, checkModalObj } from '@/utils/common'
import { UploadOutlined } from '@ant-design/icons'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { createCSRFUploadProps } from '@/utils/fetch'

const pageSize = 100

const keyTitles = {
${keyTitles}
}

// styled-components
const StyledButton = styled(Button)<{ $primary?: boolean; $export?: boolean; $import?: boolean; $danger?: boolean }>\`
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
\`${mainSearchField
            ? `
const StyledInput = styled(Input)\`
  width: 200px;
  border-radius: 6px;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
\``
            : ''}
const StyledTable = styled(Table)\`
  margin-top: 16px;
  border-radius: 8px;
  overflow: hidden;

  .styled-pagination {
    margin-top: 16px;
    margin-bottom: 16px;
  }
\`
const ModalTitle = styled.div\`
  color: #1890ff;
  font-weight: 500;
\`
const ModalInput = styled(Input)\`
  border-radius: 4px;
\`
const IconWrapper = styled.i\`
  margin-right: 5px;
\`
const RoundedButton = styled(Button)\`
  border-radius: 4px;
\`
const GlobalStyle = styled.div\`
  .rounded-button {
    border-radius: 4px;
  }
\`

const Page = ({ ${this.controller} }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [isModalVisiable, setIsModalVisible] = useState(false)
  const [modalId, setModalId] = useState(0)
${this.generateModalStates()}${mainSearchField ? "\n  const [searchKeyword, setSearchKeyword] = useState('')" : ''}
  const [batchDelIds, setBatchDelIds] = useState([])

  useEffect(() => {
    dispatch(updateSSR${capitalizedController}(${this.controller}))
  }, [dispatch])

  const ${this.controller}${capitalizedAction} = useSelector((state: RootState) => state.${this.controller}${capitalizedAction})

  if (!${this.controller}${capitalizedAction}.firstLoadFlag) {
    ${this.controller} = ${this.controller}${capitalizedAction}.${this.controller}
  }

  const { totalCounts, items: ${this.controller}Items } = _.cloneDeep(${this.controller})

  _.each(${this.controller}Items, (item) => {
    const { id } = item
    item.key = id
  })

  const dataSource = ${this.controller}Items
  const columns: any = [
${tableColumns},
    {
      title: '操作',
      dataIndex: '',
      width: '25%',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <Space size="small">
            <RoundedButton
              type="primary"
              size="small"
              onClick={() => {
                update${capitalizedController}(record)
              }}
            >
              修改
            </RoundedButton>
            <RoundedButton
              danger
              size="small"
              onClick={() => {
                const { id } = record
                delete${capitalizedController}(id)
              }}
            >
              删除
            </RoundedButton>
          </Space>
        )
      }
    }
  ]

  const rowSelection = {
    onChange: (selectedRowKeys: any) => {
      setBatchDelIds(selectedRowKeys)
    }
  }

  const create${capitalizedController} = () => {
    setModalId(0)
${this.generateModalResetStates()}
    showModal()
  }

  const update${capitalizedController} = (record: any) => {
    const { id${this.generateRecordDestructuring()} } = record

    setModalId(id)
${this.generateModalSetStates()}
    showModal()
  }

  const delete${capitalizedController} = (id: number) => {
    Modal.confirm({
      title: '提示',
      content: '确认删除吗',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch(del${capitalizedController}(id))
        Modal.destroyAll()
      }
    })
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const getMessageTitle = (key: string) => {
    let result = keyTitles[key]
    if (result == undefined) result = key
    return result
  }

  const handleOk = () => {
    const modalObj = {
${this.generateModalObj()}
    }

    const checkResult = checkModalObj(modalObj)

    if (!checkResult) {
      if (modalId == 0) {
        // 新增
        dispatch(add${capitalizedController}(modalObj))
      } else {
        dispatch(mod${capitalizedController}(modalId, modalObj))
      }

      setIsModalVisible(false)
    } else {
      message.info(getMessageTitle(checkResult.key) + checkResult.reason)
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const doSearch = () => {
    ${mainSearchField
            ? `const searchData = { ${mainSearchField.name}: handleXSS(searchKeyword) }`
            : 'const searchData = {}'}
    dispatch(search${capitalizedController}(0, pageSize, searchData))
  }

  const export${capitalizedController} = () => {
    if (${this.controller}Items.length > 0) {
      const wb = new ExcelJS.Workbook()
      const ws = wb.addWorksheet('${capitalizedController}')
      const jsonData = _.map(${this.controller}Items, (item) => _.omit(item, ['key']))

      // 提取表头
      const headers = Object.keys(jsonData[0])

      // 将 JSON 数据转换为二维数组
      const data = [headers, ...jsonData.map((item) => headers.map((header) => item[header]))]

      // 将数据写入工作表
      ws.addRows(data)

      // 设置表头样式加粗
      ws.getRow(1).eachCell((cell) => {
        cell.font = { bold: true }
      })

      // 设置列宽
      ws.columns = [
${this.generateExcelColumns()}
      ]

      wb.xlsx
        .writeBuffer()
        .then((data) => {
          const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          saveAs(blob, '${capitalizedController}.xlsx')
        })
        .catch(() => {
          // 导出失败
        })
    } else {
      message.info('没有数据无需导出')
    }
  }

  const uploadProps = createCSRFUploadProps('/rest/${this.controller}/import', {
    name: 'file',
    onSuccess: (fileName) => {
      message.success(\`\${fileName} 文件上传成功\`)
      window.location.reload()
    },
    onError: (fileName) => {
      message.error(\`\${fileName} 文件上传失败\`)
    },
    beforeUpload: (file) => {
      const isExcel =
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel'
      if (!isExcel) {
        message.error('只能上传 Excel 文件!')
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        message.error('文件大小不能超过 2MB!')
        return false
      }
      return true
    }
  })

  const batchDelete${capitalizedController} = () => {
    if (batchDelIds.length > 0) {
      Modal.confirm({
        title: '提示',
        content: '确认批量删除吗',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          dispatch(batchDel${capitalizedController}(batchDelIds))
          Modal.destroyAll()
        }
      })
    } else {
      message.info('没有数据不能批量删除')
    }
  }

  return (
    <Container>
      <GlobalStyle />
      <div className="page-title">${capitalizedController} 管理</div>
      <ConfigProvider locale={locale}>
        <SearchRow>
          <Space size="middle" wrap>
            <Space size="small">
              <StyledButton type="primary" onClick={create${capitalizedController}} $primary>
                <IconWrapper className="fa fa-plus"></IconWrapper>
                新增
              </StyledButton>
              ${mainSearchField
            ? `<StyledInput
                value={searchKeyword}
                placeholder="请输入${mainSearchField.comment || mainSearchField.name}搜索"
                allowClear
                onChange={(e) => setSearchKeyword(e.target.value)}
                onPressEnter={doSearch}
              />`
            : ''}
              <StyledButton type="primary" onClick={doSearch} $primary>
                <IconWrapper className="fa fa-search"></IconWrapper>
                搜索
              </StyledButton>
            </Space>
            <Space size="small">
              <StyledButton onClick={export${capitalizedController}} icon={<UploadOutlined rotate={180} />} $export>
                导出
              </StyledButton>
              <Upload {...uploadProps}>
                <StyledButton icon={<UploadOutlined />} $import>
                  导入
                </StyledButton>
              </Upload>
              <StyledButton danger onClick={batchDelete${capitalizedController}} $danger>
                批量删除
              </StyledButton>
            </Space>
          </Space>
        </SearchRow>
        <StyledTable
          rowSelection={{
            type: 'checkbox',
            ...rowSelection
          }}
          dataSource={dataSource}
          columns={columns}
          bordered
          rowClassName={(_, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
          pagination={{
            total: totalCounts,
            pageSize: pageSize,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total) => \`共 \${total} 条记录\`,
            onChange: (page, pageSize) => {
              ${mainSearchField
            ? `const searchData = { ${mainSearchField.name}: handleXSS(searchKeyword) }`
            : 'const searchData = {}'}
              dispatch(search${capitalizedController}(page - 1, pageSize, searchData))
            },
            className: 'styled-pagination'
          }}
        />
        <Modal
          title={<ModalTitle>{\`\${modalId == 0 ? '新增' : '修改'} ${capitalizedController}\`}</ModalTitle>}
          open={isModalVisiable}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="确认"
          cancelText="取消"
          centered
          maskClosable={false}
          destroyOnHidden
          okButtonProps={{ className: 'rounded-button' }}
          cancelButtonProps={{ className: 'rounded-button' }}
        >
          <ModalContainer>
${modalFields}
          </ModalContainer>
        </Modal>
      </ConfigProvider>
    </Container>
  )
}

Page.getInitialProps = async () => {
  let ${this.controller} = null

  await get${capitalizedController}Service(0, pageSize).then((res: any) => {
    const { data } = res
    ${this.controller} = data.${this.controller}
  })

  return {
    ${this.controller}
  }
}

export default Page`;
    }
    /**
     * 生成键值标题映射
     */
    generateKeyTitles() {
        return this.getFormFields()
            .map((field) => {
            return `  ${field.name}: '${field.comment || field.name}'`;
        })
            .join(',\n');
    }
    /**
     * 生成模态框状态变量
     */
    generateModalStates() {
        return this.getFormFields()
            .map((field) => {
            const capitalizedName = field.name.charAt(0).toUpperCase() + field.name.slice(1);
            return `  const [modal${capitalizedName}, setModal${capitalizedName}] = useState('')`;
        })
            .join('\n');
    }
    /**
     * 生成记录解构
     */
    generateRecordDestructuring() {
        const fields = this.getFormFields().map((field) => field.name);
        return fields.length > 0 ? `, ${fields.join(', ')}` : '';
    }
    /**
     * 生成模态框重置状态
     */
    generateModalResetStates() {
        return this.getFormFields()
            .map((field) => {
            const capitalizedName = field.name.charAt(0).toUpperCase() + field.name.slice(1);
            return `    setModal${capitalizedName}('')`;
        })
            .join('\n');
    }
    /**
     * 生成模态框设置状态
     */
    generateModalSetStates() {
        return this.getFormFields()
            .map((field) => {
            const capitalizedName = field.name.charAt(0).toUpperCase() + field.name.slice(1);
            return `    setModal${capitalizedName}(${field.name})`;
        })
            .join('\n');
    }
    /**
     * 生成模态框对象
     */
    generateModalObj() {
        return this.getFormFields()
            .map((field) => {
            const capitalizedName = field.name.charAt(0).toUpperCase() + field.name.slice(1);
            return `      ${field.name}: handleXSS(modal${capitalizedName})`;
        })
            .join(',\n');
    }
    /**
     * 生成模态框字段
     */
    generateModalFields(fields) {
        return fields
            .map((field) => {
            const capitalizedName = field.name.charAt(0).toUpperCase() + field.name.slice(1);
            return `            <div className="line">
              <label>{keyTitles.${field.name}}：</label>
              <ModalInput
                value={modal${capitalizedName}}
                placeholder="请输入${field.comment || field.name}"
                allowClear
                ${field === fields[0] ? 'autoFocus' : ''}
                onChange={(e) => setModal${capitalizedName}(e.target.value)}
              />
            </div>`;
        })
            .join('\n');
    }
    /**
     * 生成Excel列配置
     */
    generateExcelColumns() {
        const displayFields = this.getDisplayFields();
        return displayFields
            .map((field, index) => {
            const width = field.type === 'text' ? 50 : field.type === 'integer' ? 15 : 30;
            return `        { header: '${(field.comment || field.name).toUpperCase()}', key: 'header${index + 1}', width: ${width} }`;
        })
            .join(',\n');
    }
    generateTableColumns(fields) {
        return fields
            .map((field) => {
            let column = `    {\n      title: '${field.comment || field.name}',\n      dataIndex: '${field.name}',\n      key: '${field.name}'`;
            // 根据字段类型设置特定属性
            if (field.type === 'timestamp' || field.type === 'date' || field.type === 'datetime') {
                column += `,\n      render: (text: string) => text ? new Date(text).toLocaleString() : '-'`;
            }
            else if (field.type === 'integer' || field.type === 'decimal') {
                column += `,\n      align: 'right' as const`;
            }
            column += '\n    }';
            return column;
        })
            .join(',\n');
    }
}
exports.PageGenerator = PageGenerator;
