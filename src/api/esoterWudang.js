// 封装用户相关的请求模块
import request from '@/utils/request'

// 添加
export const addEsoterWudang = (data) => {
  return request({
    method: 'POST',
    url: '/esoterWudang/addEsoterWudang',
    data
  })
}

// 通过id查询
export const findById = (id) => {
  return request({
    method: 'get',
    url: '/esoterWudang/findById',
    params: {
      id: id
    }
  })
}

// 通过id进行删除
export const deleteById = (id) => {
  return request({
    method: 'DELETE',
    url: '/esoterWudang/deleteById',
    params: {
      id: id
    }
  })
}

// 修改
export const updateEsoterWudang = (data) => {
  return request({
    method: 'PUT',
    url: '/esoterWudang/updateEsoterWudang',
    data
  })
}

// 分页查询
export const getEsoterWudangList = (data) => {
  return request({
    method: 'POST',
    url: '/esoterWudang/getEsoterWudangList',
    data
  })
}
