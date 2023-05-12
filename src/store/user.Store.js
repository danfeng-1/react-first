// 用户信息相关的

import { makeAutoObservable } from "mobx";
import { http } from '@/utils'

class UserStore {
  userInfo = {}
  constructor() {
    makeAutoObservable(this)
  }
  getUserInfo = async() => {
    // 调用接口获取数据
    const userInfo = await http.get('/user/profile')

    console.log('直接请求回来的data包裹着的，只需要data...........',userInfo)

    this.userInfo = userInfo.data // 改了需要重新渲染视图
    

  }
}

export default UserStore