import React, { useEffect, useState } from 'react'
import { ConfigProvider, Table, Modal, Button, Input, Space, Upload, message } from 'antd'
import { Container, SearchRow, ModalContainer } from '../../client/styled/template/manage'
import { useDispatch, useSelector } from 'react-redux'
import { getTemplate, addTemplate, modTemplate, delTemplate, updateSSRTemplate, searchTemplate, batchDelTemplate } from '../../client/redux/template/manage/actions'
import { getTemplateService } from '../../client/service/template/manage'
import { RootState } from '../../client/redux/store'
import _ from 'lodash'
import moment from 'moment'
import locale from 'antd/lib/locale/zh_CN'
import { handleXSS, checkModalObj } from '../../client/utils/common'
import { UploadOutlined } from '@ant-design/icons'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

const pageSize = 100
const dateFormat = 'YYYY-MM-DD'
const currentDate = moment().format(dateFormat)
console.log('currentDate', currentDate)

const keyTitles = {
  name: '名称'
}

const Page = ({ template }) => {
  const dispatch = useDispatch()
  const [isModalVisiable, setIsModalVisible] = useState(false)
  const [modalId, setModalId] = useState(0)
  const [modalName, setModalName] = useState('')
  const [searchName, setSearchName] = useState('')
  const [batchDelIds, setBatchDelIds] = useState([])

  useEffect(() => {
    dispatch(updateSSRTemplate(template))
  }, [dispatch])

  const state = useSelector((state: RootState) => state)
  const { templateManage }: any = state
  console.log('templateManage', templateManage)

  if (!templateManage.firstLoadFlag) {
    template = templateManage.template
  }

  const { totalCounts, items: templateItems } = template
  console.log('template', template)

  _.each(templateItems, (item, index) => {
    const { id } = item
    item.key = id
  })

  const dataSource = templateItems
  const columns: any = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: any, b: any) => a.id - b.id,
      sortDirections: ['descend', 'ascend'],
      showSorterTooltip: false
    },
    {
      title: keyTitles.name,
      dataIndex: 'name',
      key: 'name',
      sorter: (a: any, b: any) => a.name.length - b.name.length,
      sortDirections: ['descend', 'ascend'],
      showSorterTooltip: false
    },
    {
      title: '操作',
      dataIndex: '',
      render: (_: any, record: any) => {
        return (
          <Space>
            <Button onClick={() => {
              console.log('record', record)
              updateTemplate(record)
            }}>修改</Button>
            <Button onClick={() => {
              console.log('record', record)
              const { id } = record
              deleteTemplate(id)
            }}>删除</Button>
          </Space>
        )
      }
    }
  ]

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
      setBatchDelIds(selectedRowKeys)
    }
  }

  const createTemplate = () => {
    setModalId(0)
    setModalName('')
    showModal()
  }

  const updateTemplate = (record: any) => {
    let { id, name } = record

    setModalId(id)
    setModalName(name)
    showModal()
  }

  const deleteTemplate = (id: number) => {
    Modal.confirm({
      title: '提示',
      content: '确认删除吗',
      okText: '确认',
      cancelText: '取消',
      onOk: (e) => {
        dispatch(delTemplate(id))
        Modal.destroyAll()
      }
    })
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const getMessageTitle = (key: string) => {
    let result = keyTitles[key]
    if (result == undefined)
      result = key
    return result
  }

  const handleOk = () => {
    const modalObj = {
      name: handleXSS(modalName)
    }
    console.log('handleOk', modalObj)

    const checkResult = checkModalObj(modalObj)

    if (!checkResult) {
      if (modalId == 0) {  // 新增
        dispatch(addTemplate(modalObj))
      } else {
        dispatch(modTemplate(modalId, modalObj))
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
    dispatch(searchTemplate(0, pageSize, { name: handleXSS(searchName) }))
  }

  const exportTemplate = () => {
    if (templateItems.length > 0) {
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet("Template")
      const jsonData = _.map(templateItems, (item) => _.omit(item, ['key']))

      // 提取表头
      const headers = Object.keys(jsonData[0]);

      // 将 JSON 数据转换为二维数组
      const data = [headers, ...jsonData.map(item => headers.map(header => item[header]))];

      // 将数据写入工作表 
      ws.addRows(data)

      // 设置表头样式加粗
      ws.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
      });

      // 设置列宽
      ws.columns = [
        { header: 'ID', key: 'header1', width: 20 },
        { header: 'NAME', key: 'header2', width: 30 },
      ];

      wb.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, "Template.xlsx")
      }).catch((error) => {
        console.error('导出失败', error?.message)
      })
    } else {
      message.info("没有数据无需导出")
    }
  }

  const uploadProps = {
    name: 'file',
    action: '/rest/template/import',
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }

      if (info.file.status === 'done') {
        message.success(`${info.file.name} 文件上传成功`)
        window.location.reload()
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败`)
      }
    }
  }

  const batchDeleteTemplate = () => {
    if (batchDelIds.length > 0) {
      Modal.confirm({
        title: '提示',
        content: '确认批量删除吗',
        okText: '确认',
        cancelText: '取消',
        onOk: (e) => {
          dispatch(batchDelTemplate(batchDelIds))
          Modal.destroyAll()
        }
      })
    } else {
      message.info("没有数据不能批量删除")
    }
  }

  return (
    <Container>
      <ConfigProvider locale={locale}>
        <SearchRow>
          <Space>
            <Button type="primary" onClick={createTemplate}>
              新增
            </Button>
            <Input value={searchName} placeholder="" onChange={(e) => setSearchName(e.target.value)} />
            <Button type="primary" onClick={doSearch}>
              搜索
            </Button>
            <Button type="primary" onClick={exportTemplate}>
              导出
            </Button>
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined rev={undefined} />}>导入</Button>
            </Upload>
            <Button type="primary" onClick={batchDeleteTemplate}>
              批量删除
            </Button>
          </Space>
        </SearchRow>
        <Table rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }} dataSource={dataSource} columns={columns} pagination={{
          total: totalCounts,
          pageSize: pageSize,
          onChange: (page, pageSize) => {
            console.log('onChange', page, pageSize)
            dispatch(searchTemplate(page - 1, pageSize, { name: handleXSS(searchName) }))
          }
        }} />
        <Modal title={(modalId == 0 ? "新增" : "修改") + " template"} open={isModalVisiable} onOk={handleOk} onCancel={handleCancel} okText="确认" cancelText="取消">
          <ModalContainer>
            <div className="line">
              <label>{keyTitles.name}</label>
              <Input value={modalName} placeholder="" onChange={(e) => setModalName(e.target.value)} />
            </div>
          </ModalContainer>
        </Modal>
      </ConfigProvider>
    </Container>
  )
}

Page.getInitialProps = async () => {
  let template = null

  await getTemplateService(0, pageSize).then((res: any) => {
    console.log('res', res)
    const { data } = res
    template = data.template
  })

  console.log('template-getInitialProps', template)

  return {
    template
  }
}

export default Page