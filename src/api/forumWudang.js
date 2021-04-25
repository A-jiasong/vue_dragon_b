// 封装用户相关的请求模块
import request from '@/utils/request'

// 添加
export const addForumWudang = (data) => {
  return request({
    method: 'POST',
    url: '/forumWudang/addForumWudang',
    data
  })
}

// 通过id查询
export const findById = (id) => {
  return request({
    method: 'get',
    url: '/forumWudang/findById',
    params: {
      id: id
    }
  })
}

// 通过id进行删除
export const deleteById = (id) => {
  return request({
    method: 'DELETE',
    url: '/forumWudang/deleteById',
    params: {
      id: id
    }
  })
}

// 修改
export const updateForumWudang = (data) => {
  return request({
    method: 'PUT',
    url: '/forumWudang/updateForumWudang',
    data
  })
}

// 分页查询
export const getForumWudangList = (data) => {
  return request({
    method: 'POST',
    url: '/forumWudang/getForumWudangList',
    data
  })
}
