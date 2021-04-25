// 封装用户相关的请求模块
import request from '@/utils/request'

// 用户登录
export const login = (data) => {
  return request({
    method: 'POST',
    url: '/api/login',
    data
  })
}

// 获取用户信息
export const findById = (id) => {
  return request({
    method: 'get',
    url: '/my/findById',
    params: {
      id: id
    }
  })
}

// 用户注册
export const register = (data) => {
  return request({
    method: 'POST',
    url: '/api/register',
    data
  })
}

// 更新用户信息
export const updateUser = (data) => {
  return request({
    method: 'PUT',
    url: '/my/updateUser',
    data
  })
}

// 查询所有用户
export const findAllUser = () => {
  return request({
    method: 'GET',
    url: '/my/findAll'
  })
}
