import React, { useState, useEffect } from "react";
import { ConfigProvider, Modal, Space, Upload, message } from "antd";
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
} from "@/styled/template/manage";
import { useDispatch, useSelector } from "react-redux";
import {
  addTemplate,
  modTemplate,
  delTemplate,
  updateSSRTemplate,
  searchTemplate,
  batchDelTemplate,
} from "@/redux/template/manage/actions";
import { getTemplateService } from "@/service/template/manage";
import { RootState, AppDispatch } from "@/redux/store";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { getAntdLocale } from "@/utils/i18n";
import { useRouter } from "next/router";
import { handleXSS, checkModalObj } from "@/utils/common";
import { UploadOutlined } from "@ant-design/icons";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { createCSRFUploadProps } from "@/utils/fetch";

const pageSize = 100;

const Page = ({ template }) => {
  const { t } = useTranslation(["common", "template"]);
  const router = useRouter();
  const antdLocale = getAntdLocale(router.locale || "zh-CN");
  const dispatch = useDispatch<AppDispatch>();
  const [isModalVisiable, setIsModalVisible] = useState(false);
  const [modalId, setModalId] = useState(0);
  const [modalName, setModalName] = useState("");
  const [searchName, setSearchName] = useState("");
  const [batchDelIds, setBatchDelIds] = useState([]);

  const keyTitles = {
    name: t("template:template.fields.name"),
  };

  useEffect(() => {
    dispatch(updateSSRTemplate(template));
  }, [dispatch]);

  useEffect(() => {
    // 管理弹窗打开时的滚动条显示
    if (isModalVisiable) {
      // 记录原始样式
      const originalStyle = window.getComputedStyle(document.body).overflow;
      const originalPaddingRight = window.getComputedStyle(document.body).paddingRight;

      // 设置定时器，在 Modal 设置样式后覆盖
      const timer = setTimeout(() => {
        document.body.style.overflow = "auto";
        document.body.style.paddingRight = "0px";
      }, 0);

      return () => {
        clearTimeout(timer);
        // 清理时恢复原始样式
        document.body.style.overflow = originalStyle;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }

    // 当弹窗关闭时，不需要清理函数
    return undefined;
  }, [isModalVisiable]);

  const templateManage = useSelector((state: RootState) => state.templateManage);

  if (!templateManage.firstLoadFlag) {
    template = templateManage.template;
  }

  const { totalCounts, items: templateItems } = _.cloneDeep(template);

  _.each(templateItems, (item) => {
    const { id } = item;
    item.key = id;
  });

  const dataSource = templateItems;
  const columns: any = [
    {
      title: t("template:template.fields.id"),
      dataIndex: "id",
      key: "id",
      sorter: (a: any, b: any) => a.id - b.id,
      sortDirections: ["descend", "ascend"],
      showSorterTooltip: false,
      width: "15%",
      align: "center",
    },
    {
      title: t("template:template.fields.name"),
      dataIndex: "name",
      key: "name",
      sorter: (a: any, b: any) => a.name.length - b.name.length,
      sortDirections: ["descend", "ascend"],
      showSorterTooltip: false,
      width: "60%",
      ellipsis: true,
    },
    {
      title: t("template:template.fields.actions"),
      dataIndex: "",
      width: "25%",
      align: "center",
      render: (_: any, record: any) => {
        return (
          <Space size="small">
            <RoundedButton
              type="primary"
              size="small"
              onClick={() => {
                updateTemplate(record);
              }}
            >
              {t("template:template.buttons.edit")}
            </RoundedButton>
            <RoundedButton
              danger
              size="small"
              onClick={() => {
                const { id } = record;
                deleteTemplate(id);
              }}
            >
              {t("template:template.buttons.delete")}
            </RoundedButton>
          </Space>
        );
      },
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: any) => {
      //
      setBatchDelIds(selectedRowKeys);
    },
  };

  const createTemplate = () => {
    setModalId(0);
    setModalName("");
    showModal();
  };

  const updateTemplate = (record: any) => {
    const { id, name } = record;

    setModalId(id);
    setModalName(name);
    showModal();
  };

  const deleteTemplate = (id: number) => {
    Modal.confirm({
      title: t("common:common.warning"),
      content: t("template:template.messages.confirmDelete"),
      okText: t("template:template.buttons.confirm"),
      cancelText: t("template:template.buttons.cancel"),
      onOk: () => {
        dispatch(delTemplate(id));
        Modal.destroyAll();
      },
    });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const getMessageTitle = (key: string) => {
    let result = keyTitles[key];
    if (result == undefined) result = key;
    return result;
  };

  const handleOk = () => {
    const modalObj = {
      name: handleXSS(modalName),
    };
    //

    const checkResult = checkModalObj(modalObj);

    if (!checkResult) {
      if (modalId == 0) {
        // 新增
        dispatch(addTemplate(modalObj));
      } else {
        dispatch(modTemplate(modalId, modalObj));
      }

      setIsModalVisible(false);
    } else {
      message.info(getMessageTitle(checkResult.key) + checkResult.reason);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const doSearch = () => {
    dispatch(searchTemplate(0, pageSize, { name: handleXSS(searchName) }));
  };

  const exportTemplate = () => {
    if (templateItems.length > 0) {
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet("Template");
      const jsonData = _.map(templateItems, (item) => _.omit(item, ["key"]));

      // 提取表头
      const headers = Object.keys(jsonData[0]);

      // 将 JSON 数据转换为二维数组
      const data = [headers, ...jsonData.map((item) => headers.map((header) => item[header]))];

      // 将数据写入工作表
      ws.addRows(data);

      // 设置表头样式加粗
      ws.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
      });

      // 设置列宽
      ws.columns = [
        { header: "ID", key: "header1", width: 20 },
        { header: "NAME", key: "header2", width: 30 },
      ];

      wb.xlsx
        .writeBuffer()
        .then((data) => {
          const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
          saveAs(blob, "Template.xlsx");
        })
        .catch(() => {
          // 导出失败
        });
    } else {
      message.info(t("template:template.messages.noData"));
    }
  };

  const uploadProps = createCSRFUploadProps("/rest/template/import", {
    name: "file",
    onSuccess: (fileName) => {
      message.success(`${fileName} ${t("template:template.messages.uploadSuccess")}`);
      window.location.reload();
    },
    onError: (fileName) => {
      message.error(`${fileName} ${t("template:template.messages.uploadFailed")}`);
    },
    beforeUpload: (file) => {
      // 可以在这里添加文件类型、大小等验证
      const isExcel =
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel";
      if (!isExcel) {
        message.error(t("template:template.messages.onlyExcel"));
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error(t("template:template.messages.fileSizeLimit"));
        return false;
      }
      return true;
    },
  });

  const batchDeleteTemplate = () => {
    if (batchDelIds.length > 0) {
      Modal.confirm({
        title: t("common:common.warning"),
        content: t("template:template.messages.confirmBatchDelete"),
        okText: t("template:template.buttons.confirm"),
        cancelText: t("template:template.buttons.cancel"),
        onOk: () => {
          dispatch(batchDelTemplate(batchDelIds));
          Modal.destroyAll();
        },
      });
    } else {
      message.info(t("template:template.messages.noDataBatchDelete"));
    }
  };

  return (
    <Container>
      <GlobalStyle />
      <div className="page-title">{t("template:template.title")}</div>
      <ConfigProvider locale={antdLocale}>
        <SearchRow>
          <Space size="middle" wrap>
            <Space size="small">
              <StyledButton type="primary" onClick={createTemplate} $primary>
                <IconWrapper className="fa fa-plus"></IconWrapper>
                {t("template:template.buttons.add")}
              </StyledButton>
              <StyledInput
                value={searchName}
                placeholder={t("template:template.placeholders.enterName")}
                allowClear
                onChange={(e) => setSearchName(e.target.value)}
                onPressEnter={doSearch}
              />
              <StyledButton type="primary" onClick={doSearch} $primary>
                <IconWrapper className="fa fa-search"></IconWrapper>
                {t("template:template.buttons.search")}
              </StyledButton>
            </Space>
            <Space size="small">
              <StyledButton onClick={exportTemplate} icon={<UploadOutlined rotate={180} />} $export>
                {t("template:template.buttons.export")}
              </StyledButton>
              <Upload {...uploadProps}>
                <StyledButton icon={<UploadOutlined />} $import>
                  {t("template:template.buttons.import")}
                </StyledButton>
              </Upload>
              <StyledButton danger onClick={batchDeleteTemplate} $danger>
                {t("template:template.buttons.batchDelete")}
              </StyledButton>
            </Space>
          </Space>
        </SearchRow>
        <StyledTable
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          dataSource={dataSource}
          columns={columns}
          bordered
          rowClassName={(_, index) => (index % 2 === 0 ? "table-row-light" : "table-row-dark")}
          pagination={{
            total: totalCounts,
            pageSize: pageSize,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total) => t("template:template.pagination.total", { total }),
            onChange: (page, pageSize) => {
              dispatch(searchTemplate(page - 1, pageSize, { name: handleXSS(searchName) }));
            },
            className: "styled-pagination",
          }}
        />
        <Modal
          title={
            <ModalTitle>
              {modalId == 0 ? t("template:template.modal.addTitle") : t("template:template.modal.editTitle")}
            </ModalTitle>
          }
          open={isModalVisiable}
          onOk={handleOk}
          onCancel={handleCancel}
          okText={t("template:template.buttons.confirm")}
          cancelText={t("template:template.buttons.cancel")}
          centered
          maskClosable={false}
          destroyOnHidden
          okButtonProps={{ className: "rounded-button" }}
          cancelButtonProps={{ className: "rounded-button" }}
        >
          <ModalContainer>
            <div className="line">
              <label>{keyTitles.name}：</label>
              <ModalInput
                value={modalName}
                placeholder={t("template:template.placeholders.inputName")}
                allowClear
                autoFocus
                onChange={(e) => setModalName(e.target.value)}
              />
            </div>
          </ModalContainer>
        </Modal>
      </ConfigProvider>
    </Container>
  );
};

export async function getServerSideProps(context) {
  const { serverSideTranslations } = await import("next-i18next/serverSideTranslations");

  let template = null;

  await getTemplateService(0, pageSize).then((res: any) => {
    const { data } = res;
    template = data.template;
  });

  const { locale } = context;
  const translations = await serverSideTranslations(locale || "zh-CN", ["common", "template", "layout", "login"]);

  return {
    props: {
      template,
      ...translations,
    },
  };
}

export default Page;
