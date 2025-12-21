import _ from "lodash";
import { Container } from "../client/styled/common";
import { Card, Typography, Divider, Row, Col, Tag } from "antd";
import { CodeOutlined, BookOutlined, DatabaseOutlined, SettingOutlined } from "@ant-design/icons";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const { Title, Paragraph, Text } = Typography;

const Page = () => {
  const { t } = useTranslation(["common", "home"]);

  return (
    <Container>
      <Typography style={{ padding: "24px" }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: "24px" }}>
          <Col>
            <Title level={1}>{t("home:page.title")}</Title>
          </Col>
        </Row>

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
        <Paragraph>{t("home:page.description")}</Paragraph>

        <Card style={{ marginBottom: "24px" }}>
          <Row gutter={[24, 16]}>
            <Col xs={24} md={8}>
              <Card
                type="inner"
                title={
                  <>
                    <DatabaseOutlined /> {t("home:page.sections.database.title")}
                  </>
                }
              >
                {t("home:page.sections.database.description")}
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card
                type="inner"
                title={
                  <>
                    <SettingOutlined /> {t("home:page.sections.project.title")}
                  </>
                }
              >
                {t("home:page.sections.project.description")}
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card
                type="inner"
                title={
                  <>
                    <CodeOutlined /> {t("home:page.sections.framework.title")}
                  </>
                }
              >
                {t("home:page.sections.framework.description")}
              </Card>
            </Col>
          </Row>
        </Card>

        <Title level={2}>
          <BookOutlined /> {t("home:page.commands.title")}
        </Title>
        <Divider />

        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card hoverable>
              <Title level={4}>{t("home:page.commands.categories.projectManagement.title")}</Title>
              <ul>
                <li>
                  <Text strong>nsgm init</Text> - {t("home:page.commands.categories.projectManagement.items.init")}
                </li>
                <li>
                  <Text strong>nsgm upgrade</Text> -{" "}
                  {t("home:page.commands.categories.projectManagement.items.upgrade")}
                </li>
              </ul>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card hoverable>
              <Title level={4}>{t("home:page.commands.categories.templateOperations.title")}</Title>
              <ul>
                <li>
                  <Text strong>nsgm create</Text> - {t("home:page.commands.categories.templateOperations.items.create")}
                </li>
                <li>
                  <Text strong>nsgm delete</Text> - {t("home:page.commands.categories.templateOperations.items.delete")}
                </li>
                <li>
                  <Text strong>nsgm deletedb</Text> -{" "}
                  {t("home:page.commands.categories.templateOperations.items.deletedb")}
                </li>
              </ul>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card hoverable>
              <Title level={4}>{t("home:page.commands.categories.runBuild.title")}</Title>
              <ul>
                <li>
                  <Text strong>nsgm dev</Text> - {t("home:page.commands.categories.runBuild.items.dev")}
                </li>
                <li>
                  <Text strong>nsgm start</Text> - {t("home:page.commands.categories.runBuild.items.start")}
                </li>
                <li>
                  <Text strong>nsgm build</Text> - {t("home:page.commands.categories.runBuild.items.build")}
                </li>
                <li>
                  <Text strong>nsgm export</Text> - {t("home:page.commands.categories.runBuild.items.export")}
                </li>
              </ul>
            </Card>
          </Col>
        </Row>

        <Title level={2} style={{ marginTop: "24px" }}>
          {t("home:page.parameters.title")}
        </Title>
        <Divider />
        <Card>
          <ul>
            <li>
              <Text strong>dictionary:</Text> {t("home:page.parameters.items.dictionary")}
            </li>
            <li>
              <Text strong>controller:</Text> {t("home:page.parameters.items.controller")}
            </li>
            <li>
              <Text strong>action:</Text> {t("home:page.parameters.items.action")}
            </li>
          </ul>
        </Card>
      </Typography>
    </Container>
  );
};

export const getServerSideProps = async ({ locale }) => {
  const currentLocale = locale || "zh-CN";

  const path = require("path");
  const i18nConfig = {
    i18n: {
      defaultLocale: "zh-CN",
      locales: ["zh-CN", "en-US", "ja-JP"],
    },
    localePath: path.resolve(process.cwd(), "public/locales"),
  };

  return {
    props: {
      ...(await serverSideTranslations(currentLocale, ["common", "home", "layout"], i18nConfig)),
    },
  };
};

Page.displayName = "HomePage";

export default Page;
