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
        // 生成表格列定义
        const tableColumns = this.generateTableColumns(listFields);
        // 生成表单字段
        const modalFields = this.generateModalFields(formFields);
        // 生成搜索字段（取第一个可搜索字段作为主要搜索）
        const mainSearchField = searchFields.length > 0 ? searchFields[0] : null;
        return `import React, { useState, useEffect } from 'react'
import { ConfigProvider, Modal, Space, Upload, message } from 'antd'
import {
  Container,
  SearchRow,
  ModalContainer,
  StyledButton,
  StyledInput,
  StyledTable,
  ModalTitle,
  ModalInput,
  IconWrapper,
  RoundedButton,
  GlobalStyle,
} from '@/styled/${this.controller}/${this.action}'
import { useDispatch, useSelector } from 'react-redux'
import {
  add${capitalizedController},
  mod${capitalizedController},
  del${capitalizedController},
  updateSSR${capitalizedController},
  search${capitalizedController},
  batchDel${capitalizedController},
} from '@/redux/${this.controller}/${this.action}/actions'
import { get${capitalizedController}Service } from '@/service/${this.controller}/${this.action}'
import { RootState, AppDispatch } from '@/redux/store'
import _ from 'lodash'
import { useTranslation } from 'next-i18next'
import { getAntdLocale } from '@/utils/i18n'
import { useRouter } from 'next/router'
import { handleXSS, checkModalObj } from '@/utils/common'
import { UploadOutlined } from '@ant-design/icons'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { createCSRFUploadProps } from '@/utils/fetch'

const pageSize = 100

const Page = ({ ${this.controller} }) => {
  const { t } = useTranslation(['common', '${this.controller}'])
  const router = useRouter()
  const antdLocale = getAntdLocale(router.locale || 'zh-CN')
  const dispatch = useDispatch<AppDispatch>()
  const [isModalVisiable, setIsModalVisible] = useState(false)
  const [modalId, setModalId] = useState(0)
${this.generateModalStates()}${mainSearchField ? `\n  const [search${mainSearchField.name.charAt(0).toUpperCase() + mainSearchField.name.slice(1)}, setSearch${mainSearchField.name.charAt(0).toUpperCase() + mainSearchField.name.slice(1)}] = useState('')` : ""}
  const [batchDelIds, setBatchDelIds] = useState([])

  const keyTitles = {
${this.generateTranslationKeyTitles()}
  }

  useEffect(() => {
    dispatch(updateSSR${capitalizedController}(${this.controller}))
  }, [dispatch])

  useEffect(() => {
    // 管理弹窗打开时的滚动条显示
    if (isModalVisiable) {
      // 记录原始样式
      const originalStyle = window.getComputedStyle(document.body).overflow
      const originalPaddingRight = window.getComputedStyle(document.body).paddingRight

      // 设置定时器，在 Modal 设置样式后覆盖
      const timer = setTimeout(() => {
        document.body.style.overflow = 'auto'
        document.body.style.paddingRight = '0px'
      }, 0)

      return () => {
        clearTimeout(timer)
        // 清理时恢复原始样式
        document.body.style.overflow = originalStyle
        document.body.style.paddingRight = originalPaddingRight
      }
    }

    // 当弹窗关闭时，不需要清理函数
    return undefined
  }, [isModalVisiable])

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
${tableColumns}
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
      title: t('common:common.warning'),
      content: t('${this.controller}:${this.controller}.messages.confirmDelete'),
      okText: t('${this.controller}:${this.controller}.buttons.confirm'),
      cancelText: t('${this.controller}:${this.controller}.buttons.cancel'),
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
  const modalObj: any = {
${this.generateModalObj()}
    }

${this.generateClientValidation()}

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
            ? `const searchData = { ${mainSearchField.name}: handleXSS(search${mainSearchField.name.charAt(0).toUpperCase() + mainSearchField.name.slice(1)}) }`
            : "const searchData = {}"}
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
      message.info(t('${this.controller}:${this.controller}.messages.noData'))
    }
  }

  const uploadProps = createCSRFUploadProps('/rest/${this.controller}/import', {
    name: 'file',
    onSuccess: (fileName) => {
      message.success(\`\${fileName} \${t('${this.controller}:${this.controller}.messages.uploadSuccess')}\`)
      window.location.reload()
    },
    onError: (fileName) => {
      message.error(\`\${fileName} \${t('${this.controller}:${this.controller}.messages.uploadFailed')}\`)
    },
    beforeUpload: (file) => {
      const isExcel =
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel'
      if (!isExcel) {
        message.error(t('${this.controller}:${this.controller}.messages.onlyExcel'))
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        message.error(t('${this.controller}:${this.controller}.messages.fileSizeLimit'))
        return false
      }
      return true
    }
  })

  const batchDelete${capitalizedController} = () => {
    if (batchDelIds.length > 0) {
      Modal.confirm({
        title: t('common:common.warning'),
        content: t('${this.controller}:${this.controller}.messages.confirmBatchDelete'),
        okText: t('${this.controller}:${this.controller}.buttons.confirm'),
        cancelText: t('${this.controller}:${this.controller}.buttons.cancel'),
        onOk: () => {
          dispatch(batchDel${capitalizedController}(batchDelIds))
          Modal.destroyAll()
        }
      })
    } else {
      message.info(t('${this.controller}:${this.controller}.messages.noDataBatchDelete'))
    }
  }

  return (
    <Container>
      <GlobalStyle />
      <div className="page-title">{t('${this.controller}:${this.controller}.title')}</div>
      <ConfigProvider locale={antdLocale}>
        <SearchRow>
          <Space size="middle" wrap>
            <Space size="small">
              <StyledButton type="primary" onClick={create${capitalizedController}} $primary>
                <IconWrapper className="fa fa-plus"></IconWrapper>
                {t('${this.controller}:${this.controller}.buttons.add')}
              </StyledButton>
              ${mainSearchField
            ? `<StyledInput
                value={search${mainSearchField.name.charAt(0).toUpperCase() + mainSearchField.name.slice(1)}}
                placeholder={t('${this.controller}:${this.controller}.placeholders.enter${mainSearchField.name.charAt(0).toUpperCase() + mainSearchField.name.slice(1)}')}
                allowClear
                onChange={(e) => setSearch${mainSearchField.name.charAt(0).toUpperCase() + mainSearchField.name.slice(1)}(e.target.value)}
                onPressEnter={doSearch}
              />`
            : ""}
              <StyledButton type="primary" onClick={doSearch} $primary>
                <IconWrapper className="fa fa-search"></IconWrapper>
                {t('${this.controller}:${this.controller}.buttons.search')}
              </StyledButton>
            </Space>
            <Space size="small">
              <StyledButton onClick={export${capitalizedController}} icon={<UploadOutlined rotate={180} />} $export>
                {t('${this.controller}:${this.controller}.buttons.export')}
              </StyledButton>
              <Upload {...uploadProps}>
                <StyledButton icon={<UploadOutlined />} $import>
                  {t('${this.controller}:${this.controller}.buttons.import')}
                </StyledButton>
              </Upload>
              <StyledButton danger onClick={batchDelete${capitalizedController}} $danger>
                {t('${this.controller}:${this.controller}.buttons.batchDelete')}
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
            showTotal: (total) => t('${this.controller}:${this.controller}.pagination.total', { total }),
            onChange: (page, pageSize) => {
              ${mainSearchField
            ? `const searchData = { ${mainSearchField.name}: handleXSS(search${mainSearchField.name.charAt(0).toUpperCase() + mainSearchField.name.slice(1)}) }`
            : "const searchData = {}"}
              dispatch(search${capitalizedController}(page - 1, pageSize, searchData))
            },
            className: 'styled-pagination'
          }}
        />
        <Modal
          title={
            <ModalTitle>
              {modalId == 0 ? t('${this.controller}:${this.controller}.modal.addTitle') : t('${this.controller}:${this.controller}.modal.editTitle')}
            </ModalTitle>
          }
          open={isModalVisiable}
          onOk={handleOk}
          onCancel={handleCancel}
          okText={t('${this.controller}:${this.controller}.buttons.confirm')}
          cancelText={t('${this.controller}:${this.controller}.buttons.cancel')}
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

export async function getServerSideProps(context) {
  const { serverSideTranslations } = await import('next-i18next/serverSideTranslations')

  let ${this.controller} = null

  await get${capitalizedController}Service(0, pageSize).then((res: any) => {
    const { data } = res
    ${this.controller} = data.${this.controller}
  })

  const { locale } = context
  const translations = await serverSideTranslations(locale || 'zh-CN', ['common', '${this.controller}', 'layout', 'login'])

  return {
    props: {
      ${this.controller},
      ...translations
    }
  }
}

export default Page`;
    }
    /**
     * 生成翻译键值标题映射
     */
    generateTranslationKeyTitles() {
        return this.getFormFields()
            .map((field) => {
            return `    ${field.name}: t('${this.controller}:${this.controller}.fields.${field.name}')`;
        })
            .join(",\n");
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
            .join("\n");
    }
    /**
     * 生成记录解构
     */
    generateRecordDestructuring() {
        const fields = this.getFormFields().map((field) => field.name);
        return fields.length > 0 ? `, ${fields.join(", ")}` : "";
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
            .join("\n");
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
            .join("\n");
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
            .join(",\n");
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
                placeholder={t('${this.controller}:${this.controller}.placeholders.input${capitalizedName}')}
                allowClear
                ${field === fields[0] ? "autoFocus" : ""}
                onChange={(e) => setModal${capitalizedName}(e.target.value)}
              />
            </div>`;
        })
            .join("\n");
    }
    /**
     * 生成Excel列配置
     */
    generateExcelColumns() {
        const displayFields = this.getDisplayFields();
        return displayFields
            .map((field, index) => {
            const width = field.type === "text" ? 50 : field.type === "integer" ? 15 : 30;
            return `        { header: '${(field.comment || field.name).toUpperCase()}', key: 'header${index + 1}', width: ${width} }`;
        })
            .join(",\n");
    }
    generateTableColumns(fields) {
        const columns = fields.map((field) => {
            let column = `    {\n      title: t('${this.controller}:${this.controller}.fields.${field.name}'),\n      dataIndex: '${field.name}',\n      key: '${field.name}'`;
            // 添加排序功能
            if (field.type === "integer") {
                column += `,\n      sorter: (a: any, b: any) => a.${field.name} - b.${field.name}`;
            }
            else if (field.type === "varchar" || field.type === "text") {
                column += `,\n      sorter: (a: any, b: any) => a.${field.name}.length - b.${field.name}.length`;
            }
            // 添加排序方向和提示
            if (field.type === "integer" || field.type === "varchar" || field.type === "text") {
                column += `,\n      sortDirections: ['descend', 'ascend'],\n      showSorterTooltip: false`;
            }
            // 根据字段类型设置特定属性
            if (field.type === "timestamp" || field.type === "date" || field.type === "datetime") {
                column += `,\n      render: (text: string) => text ? new Date(text).toLocaleString() : '-'`;
            }
            else if (field.type === "integer" || field.type === "decimal") {
                column += `,\n      align: 'center' as const`;
            }
            // 设置宽度
            if (field.name === "id") {
                column += `,\n      width: 80,\n      align: 'center' as const`;
            }
            else if (field.type === "integer" || field.type === "decimal") {
                column += `,\n      width: 100`;
            }
            column += "\n    }";
            return column;
        });
        // 添加操作列
        const actionColumn = `    {
      title: t('${this.controller}:${this.controller}.fields.actions'),
      dataIndex: '',
      width: 140,
      align: 'center' as const,
      fixed: 'right',
      render: (_: any, record: any) => {
        return (
          <Space size="small">
            <RoundedButton
              type="primary"
              size="small"
              onClick={() => {
                update${this.getCapitalizedController()}(record)
              }}
            >
              {t('${this.controller}:${this.controller}.buttons.edit')}
            </RoundedButton>
            <RoundedButton
              danger
              size="small"
              onClick={() => {
                const { id } = record
                delete${this.getCapitalizedController()}(id)
              }}
            >
              {t('${this.controller}:${this.controller}.buttons.delete')}
            </RoundedButton>
          </Space>
        )
      }
    }`;
        return [...columns, actionColumn].join(",\n");
    }
    /**
     * 生成客户端验证逻辑
     */
    generateClientValidation() {
        const integerFields = this.getFormFields().filter((field) => field.type === "integer");
        if (integerFields.length === 0) {
            return "";
        }
        const validations = integerFields.map((field) => {
            const fieldName = field.name;
            const capitalizedName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
            return `    // 验证${fieldName}
    const ${fieldName}Value = modalObj.${fieldName}
    if (${fieldName}Value !== undefined && ${fieldName}Value !== null && ${fieldName}Value !== '') {
      const parsed${capitalizedName} = parseInt(${fieldName}Value, 10)
      if (isNaN(parsed${capitalizedName})) {
        message.error(\`${fieldName}必须是数字，当前值: "\${${fieldName}Value}"\`)
        return
      }
      modalObj.${fieldName} = parsed${capitalizedName}
    }`;
        });
        return `${validations.join("\n\n")}\n\n`;
    }
}
exports.PageGenerator = PageGenerator;
