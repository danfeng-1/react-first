import { Link, useNavigate } from 'react-router-dom'
import { Card, Breadcrumb, Form, Button, Radio, DatePicker, Select, Table, Tag, Space } from 'antd'
import 'moment/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/zh_CN'
import './index.scss'

import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

import img404 from '@/assets/error.png'

import { useEffect, useState } from 'react'
import { http } from '@/utils'
import { useStore } from '@/store'
import { observer } from 'mobx-react-lite'


const { Option } = Select
const { RangePicker } = DatePicker

const Article = () => {
  const { channelStore } = useStore()

  // // 频道列表管理
  // const [channelList, setChannelList] = useState([])
  
  // // const loadChannelList = async() => {
  // //   const res = await http.get('/channels')
  // //   console.log('ress',res)
  // //   setChannelList(res.data.channels)
  // // }
  // useEffect(() => {
  //   const loadChannelList = async() => {
  //     const res = await http.get('/channels')
  //     console.log('ress',res)
  //     setChannelList(res.data.channels)
  //   }
  //   loadChannelList()
  // },[])

  // 文章列表管理 统一管理数据 将来修改给setList传对象
  const [ariticleData, setArticleData] = useState({
    list: [], // 文章列表
    count: 0 // 文章数量
  })

  // 文章参数管理
  const [params, setParams] = useState({
    page: 1,
    per_page: 10,
    // status: 0
  })
  // 如果异步请求函数需要依赖一些数据的变化而重新执行
  // 推荐把它写到内部
  // 统一不抽离函数到外面 只要设计到一步请求的函数 都放到useEffect内部
  // 本质区别：写到外面每次组件更新都会重新进行函数初始化 这本身就是一次性能消耗
  // 而写到useEffect中 只会在依赖项发生变化的时候 函数才会进行重新初始化
  // 避免性能损失
  useEffect(() => {
    const loadList = async () => {
      console.log('params',params)
      const res = await http.get('/mp/articles', { params })
      console.log('article',res)
      const { results, total_count} = res.data
      setArticleData({
        list: results,
        count: total_count
      })
    }
    loadList()
  }, [params])

  const pageChange  = (page) => {
    setParams({
      ...params,
      page
    })
  }

  // const formatStatus = (type) => {
  //   const TYPES = {
  //     1: <Tag color="red">审核失败</Tag>,
  //     2: <Tag color="green">审核成功</Tag>
  //   }
  //   return TYPES[type]
  // }

  // 删除
  const delArticle = async (data) => {
    console.log('delArticle',data)
    await http.delete(`/mp/articles/${data.id}`)
    // 刷新一下列表
    setParams({
      ...params,
      page: 1
    })
  }

  // 编辑
  const navigate = useNavigate()
  const goPublish = (data) => {
    navigate(`/publish?id=${data.id}`)
  }

  const columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      width:120,
      render: cover => {
        return <img src={cover.images[0] || img404} width={80} height={60} alt="" />
      }
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 220
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: data => <Tag color="green">审核通过</Tag> // formatStatus
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate'
    },
    {
      title: '阅读数',
      dataIndex: 'read_count'
    },
    {
      title: '评论数',
      dataIndex: 'comment_count'
    },
    {
      title: '点赞数',
      dataIndex: 'like_count'
    },
    {
      title: '操作',
      render: data => {
        return (
          <Space size="middle">
            <Button type="primary" 
            shape="circle" 
            icon={<EditOutlined />} 
            onClick={() => goPublish(data)}
            />
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => delArticle(data)}
            />
          </Space>
        )
      }
    }
  ]

  // const data = [
  //     {
  //         id: '8218',
  //         comment_count: 0,
  //         cover: {
  //           images:['http://geek.itheima.net/resources/images/15.jpg'],
  //         },
  //         like_count: 0,
  //         pubdate: '2019-03-11 09:00:00',
  //         read_count: 2,
  //         status: 2,
  //         title: 'wkwebview离线化加载h5资源解决方案' 
  //     }
  // ]

  const onFinish = (values) => {
    console.log(values)
    const { channel_id, date, status } = values
    // 数据处理
    const _params = {}
    if(status !== -1) {
      _params.status = status
    }
    if(channel_id ) {
      _params.channel_id = channel_id
    }
    if(date) {
      _params.begin_pubdate = date[0].format('YYY-MM-DD')
      _params.end_pubdate = date[1].formate('YYY-MM-DD')
    }
    // 修改params数据 引起接口的重新发送 对象的合并是一个整体覆盖，改了对象的整体引用

    // setParams(params)
    setParams({
      ...params,
      ..._params
    })

    
  }
  return (
    <div>
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>内容管理</Breadcrumb.Item>
          </Breadcrumb>
        }
        style={{ marginBottom: 20 }}
      >
        <Form 
          onFinish={onFinish}  
          initialValues={{ status: null }}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={null}>全部</Radio>
              <Radio value={0}>草稿</Radio>
              <Radio value={1}>待审核</Radio>
              <Radio value={2}>审核通过</Radio>
              <Radio value={3}>审核失败</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="频道" name="channel_id">
            <Select
              placeholder="请选择文章频道"
              style={{ width: 120 }}
            >
              { channelStore.channelList.map(channel => <Option key={channel} vlaue={channelStore.channelList.id}>{channel.name}</Option>)}

              
            </Select>
          </Form.Item>

          <Form.Item label="日期" name="date">
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker locale={locale}></RangePicker>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" htmlType="submit" style={{ marginLeft: 80 }}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title={`根据筛选条件共查询到 ${ariticleData.count} 条结果：`}>
        <Table 
          rowKey="id" 
          columns={columns} 
          dataSource={ariticleData.list}
          pagination={
            {
            pageSize: params.per_page,
            total: ariticleData.count,
            onChange: pageChange
           }
          }
            

        />
      </Card>
      
    </div>
  )
}

export default observer(Article)