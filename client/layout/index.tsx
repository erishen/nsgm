import { useEffect, useState, ReactNode } from "react";
import { Layout, Menu, Dropdown, Space } from "antd";
import {
  Container,
  FlexLayout,
  StyledSider,
  SideMenu,
  ContentLayout,
  StyledHeader,
  StyledBreadcrumb,
  StyledContent,
} from "@/styled/layout";
import { useRouter } from "next/router";
import _ from "lodash";
import menuConfig, { getMenuConfig } from "@/utils/menu";
import { LogoutOutlined } from "@ant-design/icons";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "next-i18next";
import { navigateToLogin } from "@/utils/navigation";

interface SubMenuItem {
  key: string;
  text: string;
  url: string;
}

interface MenuItem {
  key: string;
  text: string;
  url: string;
  icon?: ReactNode;
  subMenus?: SubMenuItem[];
}

// 安全获取 prefix 的辅助函数
const getPrefix = () => {
  try {
    if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_PREFIX) {
      return process.env.NEXT_PUBLIC_PREFIX;
    }
  } catch {
    // 浏览器环境使用空字符串
  }
  return "";
};

const getLocationKey = () => {
  const result = {
    topMenu: "1",
    slideMenu: "0",
  };

  if (typeof window !== "undefined") {
    const locationHref = window.location.href;

    let locationHrefArr = locationHref.split("?");
    if (locationHrefArr.length > 0) {
      locationHrefArr = locationHrefArr[0].split("//");

      if (locationHrefArr.length > 1) {
        let locationStr = locationHrefArr[1];
        const locationIndex = locationStr.indexOf("/");
        locationStr = locationStr.substring(locationIndex);

        const prefix = getPrefix();
        if (prefix && locationStr.indexOf(prefix) !== -1) {
          locationStr = locationStr.split(prefix)[1];
        }

        _.each(menuConfig, (item) => {
          const { key, url, subMenus } = item;

          if (subMenus) {
            _.each(subMenus, (subItem: MenuItem) => {
              const { key: subKey, url: subUrl } = subItem;

              if (locationStr === subUrl.split("?")[0]) {
                const subKeyArr = subKey.split("_");
                const subKeyArrLen = subKeyArr.length;

                if (subKeyArrLen > 0) result.topMenu = subKeyArr[0];

                if (subKeyArrLen > 1) result.slideMenu = subKeyArr[1];

                return false;
              }
              return true;
            });
          } else {
            if (url && locationStr === url.split("?")[0]) {
              result.topMenu = key;
              return false;
            }
          }
          return true;
        });
      }
    }
  }
  return result;
};

const routerPush = (router: any, url: string) => {
  if (router && url && typeof window !== "undefined") {
    const prefix = getPrefix();
    if (prefix && url.indexOf(prefix) === -1) {
      url = prefix + url;
    }
    router.push(url);
  }
};

const LayoutComponent = ({ user, children }) => {
  const { t } = useTranslation(["layout", "common"]);
  const router = useRouter();
  const [topMenuKey, setTopMenuKey] = useState("1");
  const [sliderMenuKey, setSliderMenuKey] = useState("1");
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 使用翻译后的菜单配置
  const translatedMenuConfig = getMenuConfig(t);

  // 自定义退出登录函数，保持语言设置
  const handleLogout = () => {
    if (!mounted || typeof window === "undefined") return;

    // 删除登录相关的 cookie
    const deleteCookie = (name: string) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    };

    deleteCookie("_cas_nsgm");
    deleteCookie("_cas_nsgm_user");

    // 跳转到登录页面，保持当前语言
    navigateToLogin(router);
  };

  useEffect(() => {
    const { topMenu, slideMenu } = getLocationKey();
    setTopMenuKey(topMenu);
    setSliderMenuKey(slideMenu);
  }, []);

  const menuItems: any = [];
  const menuItemsVertical: any = [];

  _.each(translatedMenuConfig, (item) => {
    const { key, text, url, icon, subMenus } = item;

    if (key && text && url) {
      const menuObj = {
        label: text,
        key,
        onClick: () => {
          if (mounted) {
            routerPush(router, url);
            setTopMenuKey(key);

            if (subMenus) {
              setSliderMenuKey("1");
            } else {
              setSliderMenuKey("0");
            }
          }
        },
      };

      menuItems.push(menuObj);
    }

    if (subMenus) {
      const subMenusChildren: any = [];

      _.each(subMenus, (subItem: MenuItem) => {
        const { key: subKey, text: subText, url: subUrl } = subItem;

        if (subKey && subText && subUrl) {
          const subMenusChildrenObj = {
            key: `slider_${subKey}`,
            label: subText,
            onClick: () => {
              if (mounted) {
                routerPush(router, subUrl);

                const subKeyArr = subKey.split("_");
                const subKeyArrLen = subKeyArr.length;

                if (subKeyArrLen >= 1) setTopMenuKey(subKeyArr[0]);
                if (subKeyArrLen >= 2) setSliderMenuKey(subKeyArr[1]);
              }
            },
          };

          subMenusChildren.push(subMenusChildrenObj);
        }
      });

      if (key && text && icon) {
        const subMenuObjVertical = {
          key: `slider_${key}`,
          icon,
          label: text,
          onTitleClick: () => {
            setTopMenuKey(key);
            setSliderMenuKey("1");
          },
          children: subMenusChildren,
        };

        menuItemsVertical.push(subMenuObjVertical);
      }
    } else {
      if (key && text && url) {
        const menuObjVertical = {
          label: text,
          icon,
          key: `slider_${key}_0`,
          onClick: () => {
            if (mounted) {
              routerPush(router, url);
              setTopMenuKey(key);
              setSliderMenuKey("0");
            }
          },
        };

        menuItemsVertical.push(menuObjVertical);
      }
    }
  });

  return (
    <Layout className="main-layout">
      <Container>
        <StyledHeader>
          <div className="logo">
            <span className="logo-text">NSGM</span>
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["1"]}
            selectedKeys={[topMenuKey]}
            items={menuItems}
            className="main-menu"
          />
          <div className="user-actions">
            <Space size={20} align="center">
              <LanguageSwitcher size="small" />
              {/* <Tooltip title="通知">
                <BellOutlined className="action-icon" />
              </Tooltip>
              <Tooltip title="设置">
                <SettingOutlined className="action-icon" />
              </Tooltip> */}
              <Dropdown
                menu={{
                  items: [
                    // {
                    //   key: '1',
                    //   icon: <UserOutlined />,
                    //   label: t('layout:layout.userActions.profile'),
                    // },
                    // {
                    //   key: '2',
                    //   icon: <SettingOutlined />,
                    //   label: t('layout:layout.userActions.settings'),
                    // },
                    {
                      type: "divider",
                    },
                    {
                      key: "3",
                      icon: <LogoutOutlined />,
                      label: t("layout:layout.userActions.logout"),
                      onClick: () => handleLogout(),
                    },
                  ],
                }}
              >
                <Space className="user-dropdown">
                  <span className="username">{user?.displayName || t("layout:layout.userActions.user")}</span>
                </Space>
              </Dropdown>
            </Space>
          </div>
        </StyledHeader>
        <FlexLayout>
          <StyledSider
            width={220}
            className="site-layout-background sidebar"
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
          >
            <div>
              <SideMenu
                mode="inline"
                defaultSelectedKeys={["slider_1_0"]}
                defaultOpenKeys={["slider_1"]}
                selectedKeys={[`slider_${topMenuKey}_${sliderMenuKey}`]}
                openKeys={[`slider_${topMenuKey}`]}
                items={menuItemsVertical}
                className="side-menu"
              />
            </div>
          </StyledSider>
          <ContentLayout collapsed={collapsed} className="content-layout">
            <StyledBreadcrumb
              items={_.compact(
                _.flatMap(translatedMenuConfig, (item, index) => {
                  const { key, text, subMenus } = item;

                  if (subMenus) {
                    const subItems: any = [];
                    _.each(subMenus, (subItem: MenuItem, subIndex: number) => {
                      const { key: subKey, text: subText } = subItem;
                      if (subKey === `${topMenuKey}_${sliderMenuKey}`) {
                        subItems.push({ title: text, key: `breadcrumb${subIndex}` });
                        subItems.push({ title: subText, key: `breadcrumb${subIndex}_sub` });
                        return false;
                      }
                      return true;
                    });
                    return subItems;
                  } else {
                    if (key && key === topMenuKey) {
                      return { title: text, key: `breadcrumb${index}` };
                    }
                  }
                  return null;
                })
              )}
            />
            <StyledContent>{children}</StyledContent>
          </ContentLayout>
        </FlexLayout>
      </Container>
    </Layout>
  );
};

export default LayoutComponent;
