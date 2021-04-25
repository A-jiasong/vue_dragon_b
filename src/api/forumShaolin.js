// 封装用户相关的请求模块
import request from '@/utils/request'

// 添加
export const addForumShaolin = (data) => {
  return request({
    method: 'POST',
    url: '/forumShaolin/addForumShaolin',
    data
  })
}

// 通过id查询
export const findById = (id) => {
  return request({
    method: 'get',
    url: '/forumShaolin/findById',
    params: {
      id: id
    }
  })
}

// 通过id进行删除
export const deleteById = (id) => {
  return request({
    method: 'DELETE',
    url: '/forumShaolin/deleteById',
    params: {
      id: id
    }
  })
}

// 修改
export const updateForumShaolin = (data) => {
  return request({
    method: 'PUT',
    url: '/forumShaolin/updateForumShaolin',
    data
  })
}

// 分页查询
export const getForumShaolinList = (data) => {
  return request({
    method: 'POST',
    url: '/forumShaolin/getForumShaolinList',
    data
  })
}
