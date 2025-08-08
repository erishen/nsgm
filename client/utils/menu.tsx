import { BookOutlined, SolutionOutlined } from '@ant-design/icons'
import React from 'react'

let key = 1

export default [
  {
    key: (++key).toString(),
    text: '介绍',
    url: '/',
    icon: <BookOutlined rev={undefined} />,
    subMenus: null,
  },
  {
    key: (++key).toString(),
    text: '模板',
    url: '/template/manage',
    icon: <SolutionOutlined rev={undefined} />,
    subMenus: [
      {
        key: `${key}_1`,
        text: '模板1',
        url: '/template/manage',
      },
    ],
  },
  /*{
    key: (++key).toString(),
    text: '模板',
    url: '/template/manage',
    icon: <SolutionOutlined rev={undefined} />,
    subMenus: [
      {
        key: key + '_1',
        text: '模板1',
        url: '/template/manage'
      }
    ]
  }*/
]
