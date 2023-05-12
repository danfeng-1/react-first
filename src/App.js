
import {BrowserRouter, Routes, Route, unstable_HistoryRouter as HistoryRouter} from 'react-router-dom'
import Layout from './pages/Layout'
// import Login from './pages/Login';

import { Button } from 'antd'

import './App.css'

import Home from './pages/Home'
import Article from './pages/Article'
import Publish from './pages/Publish'
import { history } from './utils/history'

// 下载的craco 接管了react-scripts ，需要修改package.json和创建craco.config.js
import Login from '@/pages/Login'
import { AuthComponent } from '@/components/AuthComponent'
function App() {
  return (
    // 路由配置
    <div className="App">
   
      {/*<BrowserRouter>*/}
      <HistoryRouter history={history}>
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
      {/* </BrowserRouter> */}
      </HistoryRouter>

    </div>
  );
}

export default App;
