// 封装用户相关的请求模块
import request from '@/utils/request'

// 添加
export const addMallLogistics = (data) => {
  return request({
    method: 'POST',
    url: '/mallLogistics/addMallLogistics',
    data
  })
}

// 通过id查询
export const findById = (id) => {
  return request({
    method: 'get',
    url: '/mallLogistics/findById',
    params: {
      id: id
    }
  })
}

// 通过id进行删除
export const deleteById = (id) => {
  return request({
    method: 'DELETE',
    url: '/mallLogistics/deleteById',
    params: {
      id: id
    }
  })
}

// 修改
export const updateMallLogistics = (data) => {
  return request({
    method: 'PUT',
    url: '/mallLogistics/updateMallLogistics',
    data
  })
}

// 分页查询
export const getMallLogisticsList = (data) => {
  return request({
    method: 'POST',
    url: '/mallLogistics/getMallLogisticsList',
    data
  })
}
