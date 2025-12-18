import { BookOutlined, SolutionOutlined } from "@ant-design/icons";
import React from "react";

// 统一的菜单配置函数，支持可选的多语言翻译
export const getMenuConfig = (t?: (key: string) => string) => {
  let key = 1;

  return [
    {
      key: (++key).toString(),
      text: t ? t("layout:layout.menu.introduction") : "介绍",
      url: "/",
      icon: <BookOutlined rev={undefined} />,
      subMenus: null,
    },
    {
      key: (++key).toString(),
      text: t ? t("layout:layout.menu.template") : "模板",
      url: "/template/manage",
      icon: <SolutionOutlined rev={undefined} />,
      subMenus: [
        {
          key: `${key}_1`,
          text: t ? t("layout:layout.menu.template1") : "模板1",
          url: "/template/manage",
        },
      ],
    },
    /*{
      key: (++key).toString(),
      text: t ? t('layout:layout.menu.template') : '',
      url: '/template/manage',
      icon: <SolutionOutlined rev={undefined} />,
      subMenus: [
        {
          key: `${key}_1`,
          text: t ? t('layout:layout.menu.template1') : '',
          url: '/template/manage',
        },
      ],
    }*/
  ];
};

// 默认导出不传翻译函数，使用中文
export default getMenuConfig();
