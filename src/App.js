
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Layout from './pages/Layout'
// import Login from './pages/Login';

import { Button } from 'antd'

// 下载的craco 接管了react-scripts ，需要修改package.json和创建craco.config.js
import Login from '@/pages/Login'
import { AuthComponent } from '@/components/AuthComponent'
function App() {
  return (
    // 路由配置
    <div className="App">
   
      <Button type='primary'>Primary Button</Button>
      App
      <BrowserRouter>
        <Routes>
          {/* 创建路由path和组件对应关系 */}
          {/* Layout需要鉴权处理的 */}
          {/* 这里的Layout不能写死， */}
          <Route path='/' 
          element={
            <AuthComponent>
              <Layout />
            </AuthComponent>
            
          }></Route>
          <Route path='/login' element={<Login />}></Route> 

        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
