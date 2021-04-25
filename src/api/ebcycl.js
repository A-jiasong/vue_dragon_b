// 封装用户相关的请求模块
import request from '@/utils/request'

// 添加
export const addEbcycl = (data) => {
  return request({
    method: 'POST',
    url: '/ebcycl/addEbcycl',
    data
  })
}

// 通过id查询
export const findById = (id) => {
  return request({
    method: 'get',
    url: '/ebcycl/findById',
    params: {
      id: id
    }
  })
}

// 通过id进行删除
export const deleteById = (id) => {
  return request({
    method: 'DELETE',
    url: '/ebcycl/deleteById',
    params: {
      id: id
    }
  })
}

// 修改
export const updateEbcycl = (data) => {
  return request({
    method: 'PUT',
    url: '/ebcycl/updateEbcycl',
    data
  })
}

// 分页查询
export const getEbcyclList = (data) => {
  return request({
    method: 'POST',
    url: '/ebcycl/getEbcyclList',
    data
  })
}
