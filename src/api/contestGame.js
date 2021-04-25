// 封装用户相关的请求模块
import request from '@/utils/request'

// 添加
export const addContestGame = (data) => {
  return request({
    method: 'POST',
    url: '/contestGame/addContestGame',
    data
  })
}

// 通过id查询
export const findById = (id) => {
  return request({
    method: 'get',
    url: '/contestGame/findById',
    params: {
      id: id
    }
  })
}

// 通过id进行删除
export const deleteById = (id) => {
  return request({
    method: 'DELETE',
    url: '/contestGame/deleteById',
    params: {
      id: id
    }
  })
}

// 修改
export const updateContestGame = (data) => {
  return request({
    method: 'PUT',
    url: '/contestGame/updateContestGame',
    data
  })
}

// 分页查询
export const getContestGameList = (data) => {
  return request({
    method: 'POST',
    url: '/contestGame/getContestGameList',
    data
  })
}
