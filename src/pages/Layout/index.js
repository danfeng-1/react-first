import './index.scss'
import { Layout, Menu, Popconfirm } from 'antd'

import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'

import { useStore } from '@/store'

// 四个图标
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined
} from '@ant-design/icons'


const { Header, Sider } = Layout


const GeekLayout = () => {

  const location = useLocation()
  // console.log('当前的路由信息location',location.pathname)

  const { userStore, loginStore } = useStore()
  // useStore.getUserInfo()应该在Hook的副作用里面执行以便获取用户信息，当使用副作用useEfeect带[]表示只在挂载时执行一次
  

  useEffect(() => {
    userStore.getUserInfo()
  }, [userStore])

  // 确定退出
  const navigate = useNavigate()
  const onConfirm = () => {
    // 退出登录，删除token 跳回到登录
    loginStore.loginOut()
    // 跳转到登录页
    navigate('/login')
  }


  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">{userStore.userInfo.name}</span>
          <span className="user-logout">
            <Popconfirm onConfirm={onConfirm} title="是否确认退出？" okText="退出" cancelText="取消">
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          {/* 高亮原理：defaultSelectKeys === item key*/}
          {/* 获取当前激活的path路径 */}
          <Menu
            mode="inline"
            theme="dark"
            defaultSelectedKeys= {[location.pathname]} // {[location.pathname]} //{['2']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item icon={<HomeOutlined />} key="/">
              <Link to='/'>数据概览</Link>
            </Menu.Item>
            <Menu.Item icon={<DiffOutlined />} key="/article">
              <Link to='/article'>内容管理</Link>
            </Menu.Item>
            <Menu.Item icon={<EditOutlined />} key="/publish">
              <Link to='/publish'>发布文章</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          {/* 内容，分别是三个路由出口 */}
          <Outlet></Outlet>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default observer(GeekLayout)