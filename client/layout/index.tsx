import React, { useEffect, useState } from 'react'
import { Layout, Menu, Breadcrumb, Image, Dropdown, Space, Tooltip } from 'antd'
import { Container } from '@/styled/layout'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import _ from 'lodash'
import menuConfig from '@/utils/menu'
import { logout } from '@/utils/sso'
import getConfig from 'next/config'
import { LogoutOutlined, SettingOutlined, BellOutlined, UserOutlined } from '@ant-design/icons'

interface SubMenuItem {
  key: string
  text: string
  url: string
}

interface MenuItem {
  key: string
  text: string
  url: string
  icon?: React.ReactNode
  subMenus?: SubMenuItem[]
}

const { Header, Content, Sider } = Layout

const nextConfig = getConfig()
const { publicRuntimeConfig } = nextConfig
const { prefix } = publicRuntimeConfig

// styled-components
const FlexLayout = styled(Layout)`
  display: flex;
  flex: 1;
`
const StyledSider = styled(Sider)`
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px -4px rgba(0, 0, 0, 0.1);
  z-index: 5;
  position: relative;
`

const SideMenu = styled(Menu)`
  height: 100%;
  border-right: 0;
  padding: 8px 0;
`

const ContentLayout = styled(Layout)`
  display: flex;
  flex-direction: column;
  flex: 1;
  background: #f5f7fa;
  position: relative;
  z-index: 1;
`
const StyledHeader = styled(Header)`
  display: flex;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  z-index: 11;

  .logo {
    margin-right: 24px;
  }

  .main-menu {
    flex: 1;
  }

  .user-actions {
    display: flex;
    align-items: center;

    .action-icon {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.85);
      cursor: pointer;
      padding: 0 8px;
      transition: color 0.3s;

      &:hover {
        color: #fff;
      }
    }

    .user-dropdown {
      cursor: pointer;
      padding: 0 8px;

      .username {
        color: rgba(255, 255, 255, 0.85);
        margin-left: 8px;
      }
    }
  }
`
const StyledBreadcrumb = styled(Breadcrumb)`
  margin: 16px 24px;
  font-size: 14px;
`
const StyledContent = styled(Content)`
  margin: 0 24px 24px;
  padding: 24px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  min-height: calc(100vh - 180px);
  position: relative;
  z-index: 1;
`

const getLocationKey = () => {
  const result = {
    topMenu: '1',
    slideMenu: '0'
  }

  if (typeof window !== 'undefined') {
    const locationHref = window.location.href

    let locationHrefArr = locationHref.split('?')
    if (locationHrefArr.length > 0) {
      locationHrefArr = locationHrefArr[0].split('//')

      if (locationHrefArr.length > 1) {
        let locationStr = locationHrefArr[1]
        const locationIndex = locationStr.indexOf('/')
        locationStr = locationStr.substring(locationIndex)

        if (prefix && locationStr.indexOf(prefix) !== -1) {
          locationStr = locationStr.split(prefix)[1]
        }

        _.each(menuConfig, (item) => {
          const { key, url, subMenus } = item

          if (subMenus) {
            _.each(subMenus, (subItem: MenuItem) => {
              const { key: subKey, url: subUrl } = subItem

              if (locationStr === subUrl.split('?')[0]) {
                const subKeyArr = subKey.split('_')
                const subKeyArrLen = subKeyArr.length

                if (subKeyArrLen > 0) result.topMenu = subKeyArr[0]

                if (subKeyArrLen > 1) result.slideMenu = subKeyArr[1]

                return false
              }
              return true
            })
          } else {
            if (url && locationStr === url.split('?')[0]) {
              result.topMenu = key
              return false
            }
          }
          return true
        })
      }
    }
  }
  return result
}

const routerPush = (router: any, url: string) => {
  if (router && url) {
    if (prefix && url.indexOf(prefix) === -1) {
      url = prefix + url
    }
    router.push(url)
  }
}

const LayoutComponent = ({ user, children }) => {
  const router = useRouter()
  const [topMenuKey, setTopMenuKey] = useState('1')
  const [sliderMenuKey, setSliderMenuKey] = useState('1')
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const { topMenu, slideMenu } = getLocationKey()
    setTopMenuKey(topMenu)
    setSliderMenuKey(slideMenu)
  }, [])

  const menuItems: any = []
  const menuItemsVertical: any = []

  _.each(menuConfig, (item) => {
    const { key, text, url, icon, subMenus } = item

    if (key && text && url) {
      const menuObj = {
        label: text,
        key,
        onClick: () => {
          routerPush(router, url)
          setTopMenuKey(key)

          if (subMenus) {
            setSliderMenuKey('1')
          } else {
            setSliderMenuKey('0')
          }
        }
      }

      menuItems.push(menuObj)
    }

    if (subMenus) {
      const subMenusChildren: any = []

      _.each(subMenus, (subItem: MenuItem) => {
        const { key: subKey, text: subText, url: subUrl } = subItem

        if (subKey && subText && subUrl) {
          const subMenusChildrenObj = {
            key: `slider_${subKey}`,
            label: subText,
            onClick: () => {
              routerPush(router, subUrl)

              const subKeyArr = subKey.split('_')
              const subKeyArrLen = subKeyArr.length

              if (subKeyArrLen >= 1) setTopMenuKey(subKeyArr[0])
              if (subKeyArrLen >= 2) setSliderMenuKey(subKeyArr[1])
            }
          }

          subMenusChildren.push(subMenusChildrenObj)
        }
      })

      if (key && text && icon) {
        const subMenuObjVertical = {
          key: `slider_${key}`,
          icon,
          label: text,
          onTitleClick: () => {
            setTopMenuKey(key)
            setSliderMenuKey('1')
          },
          children: subMenusChildren
        }

        menuItemsVertical.push(subMenuObjVertical)
      }
    } else {
      if (key && text && url) {
        const menuObjVertical = {
          label: text,
          icon,
          key: `slider_${key}_0`,
          onClick: () => {
            routerPush(router, url)
            setTopMenuKey(key)
            setSliderMenuKey('0')
          }
        }

        menuItemsVertical.push(menuObjVertical)
      }
    }
  })

  return (
    <Layout className="main-layout">
      <Container>
        <StyledHeader>
          <div className="logo">
            <Image width={120} src={`${prefix}/images/zhizuotu_1.png`} preview={false} />
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            selectedKeys={[topMenuKey]}
            items={menuItems}
            className="main-menu"
          />
          <div className="user-actions">
            <Space size={20} align="center">
              <Tooltip title="通知">
                <BellOutlined className="action-icon" />
              </Tooltip>
              <Tooltip title="设置">
                <SettingOutlined className="action-icon" />
              </Tooltip>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: '1',
                      icon: <UserOutlined />,
                      label: '个人中心'
                    },
                    {
                      key: '2',
                      icon: <SettingOutlined />,
                      label: '账户设置'
                    },
                    {
                      type: 'divider'
                    },
                    {
                      key: '3',
                      icon: <LogoutOutlined />,
                      label: '退出登录',
                      onClick: () => logout()
                    }
                  ]
                }}
              >
                <Space className="user-dropdown">
                  <span className="username">{user?.displayName || '用户'}</span>
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
                defaultSelectedKeys={['slider_1_0']}
                defaultOpenKeys={['slider_1']}
                selectedKeys={[`slider_${topMenuKey}_${sliderMenuKey}`]}
                openKeys={[`slider_${topMenuKey}`]}
                items={menuItemsVertical}
                className="side-menu"
              />
            </div>
          </StyledSider>
          <ContentLayout className="content-layout">
            <StyledBreadcrumb
              items={_.compact(
                _.flatMap(menuConfig, (item, index) => {
                  const { key, text, subMenus } = item

                  if (subMenus) {
                    const subItems: any = []
                    _.each(subMenus, (subItem: MenuItem, subIndex: number) => {
                      const { key: subKey, text: subText } = subItem
                      if (subKey === `${topMenuKey}_${sliderMenuKey}`) {
                        subItems.push({ title: text, key: `breadcrumb${subIndex}` })
                        subItems.push({ title: subText, key: `breadcrumb${subIndex}_sub` })
                        return false
                      }
                      return true
                    })
                    return subItems
                  } else {
                    if (key && key === topMenuKey) {
                      return { title: text, key: `breadcrumb${index}` }
                    }
                  }
                  return null
                })
              )}
            />
            <StyledContent>{children}</StyledContent>
          </ContentLayout>
        </FlexLayout>
      </Container>
    </Layout>
  )
}

export default LayoutComponent
