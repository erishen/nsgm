import React, { useEffect, useState } from 'react'
import { Layout, Menu, Breadcrumb, Image, Select, Avatar, Dropdown, Space, Tooltip } from 'antd'
import { Container } from '../styled/layout'
import { useRouter } from 'next/router'
import _ from 'lodash'
import menuConfig from '../utils/menu'
import { logout } from '../utils/sso'
import getConfig from 'next/config'
import { UserOutlined, LogoutOutlined, SettingOutlined, BellOutlined } from '@ant-design/icons'

const { Option } = Select
const { SubMenu } = Menu
const { Header, Content, Sider } = Layout

const nextConfig = getConfig()
const { publicRuntimeConfig } = nextConfig
const { prefix } = publicRuntimeConfig

const getLocationKey = () => {
  let result = {
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

        // console.log('locationStr', locationStr)

        _.each(menuConfig, (item, index) => {
          const { key, url, subMenus } = item

          if (subMenus) {
            _.each(subMenus, (subItem, subIndex) => {
              const { key: subKey, url: subUrl } = subItem

              if (locationStr === subUrl.split('?')[0]) {
                const subKeyArr = subKey.split('_')
                const subKeyArrLen = subKeyArr.length

                if (subKeyArrLen > 0) result.topMenu = subKeyArr[0]

                if (subKeyArrLen > 1) result.slideMenu = subKeyArr[1]

                return false
              }
            })
          } else {
            if (url && locationStr === url.split('?')[0]) {
              result.topMenu = key
              return false
            }
          }
        })
      }
    }
  }
  // console.log('result', result)
  return result
}

const routerPush = (router: any, url: string) => {
  // console.log('routerPush', url)
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

  // console.log('topMenuKey: ' + topMenuKey, ', sliderMenuKey: ' + sliderMenuKey, user)

  useEffect(() => {
    const { topMenu, slideMenu } = getLocationKey()
    setTopMenuKey(topMenu)
    setSliderMenuKey(slideMenu)
  }, [])

  const menuItems: any = []
  const menuItemsVertical: any = []

  _.each(menuConfig, (item, index) => {
    const { key, text, url, icon, subMenus } = item

    if (key) {
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

      _.each(subMenus, (subItem, subIndex) => {
        const { key: subKey, text: subText, url: subUrl } = subItem

        const subMenusChildrenObj = {
          key: 'slider_' + subKey,
          label: subText,
          onClick: () => {
            routerPush(router, subUrl)

            const subKeyArr = subKey.split('_')
            const subKeyArrLen = subKeyArr.length

            // console.log(subKeyArr, subKeyArrLen)

            if (subKeyArrLen >= 1) setTopMenuKey(subKeyArr[0])
            if (subKeyArrLen >= 2) setSliderMenuKey(subKeyArr[1])
          }
        }

        subMenusChildren.push(subMenusChildrenObj)
      })

      const subMenuObjVertical = {
        key: 'slider_' + key,
        icon,
        label: text,
        onTitleClick: () => {
          setTopMenuKey(key)
          setSliderMenuKey('1')
        },
        children: subMenusChildren
      }

      menuItemsVertical.push(subMenuObjVertical)
    } else {
      if (key) {
        const menuObjVertical = {
          label: text,
          icon,
          key: 'slider_' + key + '_0',
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
        <Header className="header">
          <div className="logo">
            <Image width={100} src={prefix + "/images/zhizuotu_1.png"} preview={false} />
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
            <Space size={16} align="center">
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
                      label: '个人中心',
                    },
                    {
                      key: '2',
                      icon: <SettingOutlined />,
                      label: '账户设置',
                    },
                    {
                      type: 'divider',
                    },
                    {
                      key: '3',
                      icon: <LogoutOutlined />,
                      label: '退出登录',
                      onClick: () => logout(),
                    },
                  ],
                }}
              >
                <Space className="user-dropdown">
                  <span className="username">{user?.displayName || '用户'}</span>
                </Space>
              </Dropdown>
            </Space>
          </div>
        </Header>
        <Layout style={{ display: 'flex', flex: 1 }}>
          <Sider
            width={200}
            className="site-layout-background sidebar"
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <Menu
                mode="inline"
                defaultSelectedKeys={['slider_1_0']}
                defaultOpenKeys={['slider_1']}
                selectedKeys={['slider_' + topMenuKey + '_' + sliderMenuKey]}
                openKeys={['slider_' + topMenuKey]}
                style={{ height: '100%', borderRight: 0 }}
                items={menuItemsVertical}
                className="side-menu"
              />
            </div>
            <div style={{
              padding: collapsed ? '8px 0' : '8px 16px',
              textAlign: 'center',
              color: 'rgba(0,0,0,0.45)',
              fontSize: '12px',
              borderTop: '1px solid #ebeef5',
              background: '#f5f7fa'
            }}>
              {collapsed ? '©' : '© 2025 NSGM'}
            </div>
          </Sider>
          <Layout className="content-layout" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <Breadcrumb className="breadcrumb-container">
              {_.map(menuConfig, (item, index) => {
                const { key, text, subMenus } = item

                if (subMenus) {
                  // console.log('subMenus', subMenus)

                  let subContent: any = []
                  _.each(subMenus, (subItem, subIndex) => {
                    const { key: subKey, text: subText } = subItem
                    // console.log('subKey', subKey, key, topMenuKey, sliderMenuKey)

                    if (subKey === topMenuKey + '_' + sliderMenuKey) {
                      subContent.push(<Breadcrumb.Item key={'breadcrumb' + subIndex}>{text}</Breadcrumb.Item>)
                      subContent.push(<Breadcrumb.Item key={'breadcrumb' + subIndex}>{subText}</Breadcrumb.Item>)
                      return false
                    }
                  })
                  return subContent
                } else {
                  if (key && key === topMenuKey) {
                    return <Breadcrumb.Item key={'breadcrumb' + index}>{text}</Breadcrumb.Item>
                  }
                }
              })}
            </Breadcrumb>
            <Content
              className="site-layout-background content-container"
            >
              {children}
            </Content>
          </Layout>
        </Layout>
      </Container>
    </Layout>
  )
}

export default LayoutComponent
