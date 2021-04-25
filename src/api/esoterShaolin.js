// 封装用户相关的请求模块
import request from '@/utils/request'

// 添加
export const addEsoterShaolin = (data) => {
  return request({
    method: 'POST',
    url: '/esoterShaolin/addEsoterShaolin',
    data
  })
}

// 通过id查询
export const findById = (id) => {
  return request({
    method: 'get',
    url: '/esoterShaolin/findById',
    params: {
      id: id
    }
  })
}

// 通过id进行删除
export const deleteById = (id) => {
  return request({
    method: 'DELETE',
    url: '/esoterShaolin/deleteById',
    params: {
      id: id
    }
  })
}

// 修改
export const updateEsoterShaolin = (data) => {
  return request({
    method: 'PUT',
    url: '/esoterShaolin/updateEsoterShaolin',
    data
  })
}

// 分页查询
export const getEsoterShaolinList = (data) => {
  return request({
    method: 'POST',
    url: '/esoterShaolin/getEsoterShaolinList',
    data
  })
}
