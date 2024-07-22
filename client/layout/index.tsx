import React, { useEffect, useState } from 'react'
import { Layout, Menu, Breadcrumb, Image, Select } from 'antd'
import { Container } from '../styled/layout'
import { useRouter } from 'next/router'
import _ from 'lodash'
import menuConfig from '../utils/menu'
import { logout } from '../utils/sso'
import getConfig from 'next/config'

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
    <Layout>
      <Container>
        <Header className="header">
          <div className="logo">
            <Image width={100} src={prefix + "/images/zhizuotu_1.png"} preview={false} />
          </div>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} selectedKeys={[topMenuKey]} items={menuItems} />
          <div className="user">
            <Select value={user?.displayName} onChange={() => { logout() }}>
              <Option value=''>{'退出'}</Option>
            </Select>
          </div>
        </Header>
        <Layout>
          <Sider width={200} className="site-layout-background">
            <Menu
              mode="inline"
              defaultSelectedKeys={['slider_1_0']}
              defaultOpenKeys={['slider_1']}
              selectedKeys={['slider_' + topMenuKey + '_' + sliderMenuKey]}
              openKeys={['slider_' + topMenuKey]}
              style={{ height: '100%', borderRight: 0 }}
              items={menuItemsVertical}
            />
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
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
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280
              }}
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
