import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
  message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import './index.scss'
import { useStore } from '@/store'
import { useEffect, useRef, useState } from 'react'

import { http } from '@/utils'
import { observer } from 'mobx-react-lite'

const { Option } = Select



const Publish = () => {
  const { channelStore } = useStore()
  // 存放上传图片的列表
  const [fileList, setFileList] = useState([])

  // 这个函数的执行分阶段  是从updating到done的过程
  // 这个过程只要上传图片内容发生变化就会不断执行知道全部上传完毕
  // 使用useRef声明一个暂存仓库
  const cacheImgList = useRef([])

  const onUploadChange = ({ fileList }) => {
    console.log(fileList)
    // 才去受控的写法：在最后一次log里response
    // 最终(第三次的percent变成100，才有response）react state fileList中存放的数据有response.data.url
    
    // 同时把图片列表存入仓库一份
    // 这里关键位置：需要做数据格式化
    const formatList = fileList.map(file => {
      // 上传完毕才做处理
      if(file.response) {
        return {
          url: file.response.data.url
        }
      }
      return file
    })
    setFileList(formatList)
    cacheImgList.current = formatList

  }

  // 切换图片, 记录图片数量：1 or 3
  const [imgCount, setImageCount] = useState(1)
  const radioChange = (e) => {
    const rawValue = e.target.value // 点击之后改变了的值
    // 这里的判断依据我们采取原始值 不采取经过useState方法修改之后的数据
    // useState修改之后的数据 无法同步获取修改之后的新值
    console.log('rawValue',rawValue)
    setImageCount(rawValue)
    console.log('cacheImgList',cacheImgList)
    // 从仓库里去对应的图片数量 交给我们用来渲染图片列表的fileList
    // 通过调用setFileList
    // 无图模式
    if (cacheImgList.current.length === 0) {
      return false
    }
    
    console.log('imgCount', imgCount) // 上一步图片的数量
    
    if(rawValue === 1) { // 如果你现在是1 那么执行3图的逻辑
      const img =  cacheImgList.current[0] //: []
      setFileList([img]) // 注意这里 
    } else if(rawValue === 3) {
      setFileList(cacheImgList.current)
    }

  }

  // 提交表单
  const navigate = useNavigate()
  const onFinish = async (values) => {
    console.log('提交表单',values)
    // 数据的而此处理 重点是处理cover字段
    const { channel_id, content, title, type } = values
    const params = {
      channel_id: channel_id,
      content: content,
      title: title,
      type: type,
      cover: {
        type: type,
        images: fileList.map(item => item.url) // 这里有问题item.response.data.url
      }
    }

    console.log('params',params)
    // await http.post('/mp/articles?draft=false', params)
    if(id) {
      await http.put(`/mp/articles/${id}?draft=false`, params)  
    } else {
      await http.post('/mp/articles?draft=false', params)
    }
    console.log('-----------')

    // 跳转列表 提示用户
    navigate('/article')
    message.success(`${id ? '更新成功' : '发布成功'}`)

    

  }

  // 编辑功能
  // 文案适配
  const [params] = useSearchParams()
  const id = params.get('id')
  console.log('routes_id', id)

  // 数据回填 id调用接口 1.表单回填 2.暂存列表 3.upload组件fileList
  const formRef = useRef(null)
  console.log('form', formRef)
  useEffect(() => {
    const loadDetail = async () => {
      const { data } = await http.get(`/mp/articles/${id}`)
      console.log('id编辑data', data)
      // 表单数据回填 实例方法
      formRef.current.setFieldsValue({...data, type: data.cover.type })
      const formatImgList = data.cover.images.map(url => ({ url }) )
      // 调用setFileList方法回填upload
      setFileList(formatImgList)
      // 暂存列表也存一个(暂存列表和fileList回显列表保持数据结构统一就可以)
      cacheImgList.current = formatImgList
    }
    // 必须是编辑状态才会发起请求获取该用户的数据
    if(id) {
      loadDetail()
      console.log('form.current',formRef.current) 
    }
  }, [id]) 

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{id ? '编辑':'发布'}文章</Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 1, content: 'this is content' }}
          onFinish={onFinish}
          ref={formRef}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: '请选择文章频道' }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              { channelStore.channelList.map(item => (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              ))}
              
            </Select>
          </Form.Item>

          <Form.Item label="封面" // 以下两条是必须的
          >
            <Form.Item name="type">
              <Radio.Group onChange={radioChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            { imgCount > 0 && (
               <Upload
                name="image"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList
                action="http://geek.itheima.net/v1_0/upload"
                fileList={fileList}
                onChange={onUploadChange}
                multiple={ imgCount > 1 }
                maxCount={ imgCount }
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>
            ) }
           

          </Form.Item>
          {/* 这里的富文本组件 已经被Form.Item控制 */}
          {/* 它的输入内容 会在onFinish回调中 */}
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入文章内容' }]}
          
          >
            <ReactQuill theme="snow" ></ReactQuill>

          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                {id ? '编辑' : '发布'}文章
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default observer(Publish)