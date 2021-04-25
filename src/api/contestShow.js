// 封装用户相关的请求模块
import request from '@/utils/request'

// 添加
export const addContestShow = (data) => {
  return request({
    method: 'POST',
    url: '/contestShow/addContestShow',
    data
  })
}

// 通过id查询
export const findById = (id) => {
  return request({
    method: 'get',
    url: '/contestShow/findById',
    params: {
      id: id
    }
  })
}

// 通过id进行删除
export const deleteById = (id) => {
  return request({
    method: 'DELETE',
    url: '/contestShow/deleteById',
    params: {
      id: id
    }
  })
}

// 修改
export const updateContestShow = (data) => {
  return request({
    method: 'PUT',
    url: '/contestShow/updateContestShow',
    data
  })
}

// 分页查询
export const getContestShowList = (data) => {
  return request({
    method: 'POST',
    url: '/contestShow/getContestShowList',
    data
  })
}
