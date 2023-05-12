
import { Card } from 'antd'
import logo from '@/assets/logo.png'
import { Button, Checkbox, Form, Input, message } from 'antd'
// 导入样式文件
import './index.scss'
import { useStore } from '@/store'

import { useNavigate } from 'react-router-dom'

// 校验失败的
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

// autoComplete="off"


function Login() {
  // 获取跳转实例对象
  const Navigate = useNavigate()
  const { loginStore } = useStore()
  // 校验成功自动收集表单数据
  async function onFinish(values) {
    console.log('Success:', values);
    const { username, password } = values
    // value：放置的是所有表单项中用户输入的内容
    // todo: 登录
    try {
      await loginStore.getToken({ // 因为Store里面用async修饰了，所以可以返回一个Promise对象
        username,
        password
      })
      Navigate('/', {replace:true})
      // 提示用户
      message.success('登陆成功')
    } catch(e) {
      message.error(e.response?.data?.message || '登录失败')
    }
    
  };

  return (
    <div className='login'>
      <Card className='login-container'>
        <img className='login-logo' src={logo}></img>
        {/* 登录表单antd 的 Form */}
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}

          validateTrigger={['onBlur', 'onChange']}

          onFinish={onFinish}
          onFinishFailed={onFinishFailed}

          
        >
          <Form.Item
            label="手机号"
            name="username"
            rules={[
              {
                required: true,
                message: '请输入手机号!',
              },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '请输入正确的手机号!',
                // validateTrigger: 'onBlur'
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              {
                required: true,
                message: '请输入密码!',
              },
              {
                len: 6,
                message: '请输入6位密码!',
                validateTrigger: 'onBlur'
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Checkbox className='login-checkbox-label'>我已阅读并同意[用户协议]和[隐私条款]</Checkbox>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>

      </Card>
    </div>
  )
}

export default Login