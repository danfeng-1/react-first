
import {BrowserRouter, Routes, Route, unstable_HistoryRouter as HistoryRouter} from 'react-router-dom'


import { Button } from 'antd'

import './App.css'

// import Home from './pages/Home'
// import Article from './pages/Article'
// import Publish from './pages/Publish'
// import Login from '@/pages/Login'
// import Layout from './pages/Layout'

import { history } from './utils/history'

// 下载的craco 接管了react-scripts ，需要修改package.json和创建craco.config.js

import { AuthComponent } from '@/components/AuthComponent'

// 导入必要组件
import { lazy, Suspense } from 'react'
// 按需导入路由组件
const Login = lazy(() => import('./pages/Login'))
const Layout = lazy(() => import('./pages/Layout'))
const Home = lazy(() => import('./pages/Home'))
const Article = lazy(() => import('./pages/Article'))
const Publish = lazy(() => import('./pages/Publish'))


function App() {
  return (
    // 路由配置
    <div className="App">
   
      {/*<BrowserRouter>*/}
      <HistoryRouter history={history}>
        {/* 在 路由Router 内部，使用 Suspense 组件包裹组件内容 */}
        <Suspense
          fallback={
            <div
              style={{
                textAlign: 'center',
                marginTop: 200
              }}
            >
              loading...
            </div>
          }
        >
          <Routes>
            {/* 创建路由path和组件对应关系 */}
            {/* Layout需要鉴权处理的 */}
            {/* 这里的Layout不能写死， */}
            <Route path='/' 
            element={
              <AuthComponent>
                <Layout />
              </AuthComponent>
            }>
              {/* 二级路由嵌套 ,然后在Layout里面路由出口*/}
              <Route index element={<Home />}></Route>
              <Route path='article' element={<Article />}></Route>
              <Route path='publish' element={<Publish />}></Route>
            </Route>

            <Route path='/login' element={<Login />}></Route> 

          </Routes>

        </Suspense>
      {/* </BrowserRouter> */}
      </HistoryRouter>

    </div>
  );
}

export default App;
