// 封装用户相关的请求模块
import request from '@/utils/request'

// 添加
export const addMallCart = (data) => {
  return request({
    method: 'POST',
    url: '/mallCart/addMallCart',
    data
  })
}

// 通过id查询
export const findById = (id) => {
  return request({
    method: 'get',
    url: '/mallCart/findById',
    params: {
      id: id
    }
  })
}

// 通过id进行删除
export const deleteById = (id) => {
  return request({
    method: 'DELETE',
    url: '/mallCart/deleteById',
    params: {
      id: id
    }
  })
}

// 修改
export const updateMallCart = (data) => {
  return request({
    method: 'PUT',
    url: '/mallCart/updateMallCart',
    data
  })
}

// 分页查询
export const getMallCartList = (data) => {
  return request({
    method: 'POST',
    url: '/mallCart/getMallCartList',
    data
  })
}
