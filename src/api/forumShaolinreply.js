// 封装用户相关的请求模块
import request from '@/utils/request'

// 添加
export const addForumShaolinreply = (data) => {
  return request({
    method: 'POST',
    url: '/forumShaolinreply/addForumShaolinreply',
    data
  })
}

// 通过id查询
export const findById = (id) => {
  return request({
    method: 'get',
    url: '/forumShaolinreply/findById',
    params: {
      id: id
    }
  })
}

// 通过id进行删除
export const deleteById = (id) => {
  return request({
    method: 'DELETE',
    url: '/forumShaolinreply/deleteById',
    params: {
      id: id
    }
  })
}

// 修改
export const updateForumShaolinreply = (data) => {
  return request({
    method: 'PUT',
    url: '/forumShaolinreply/updateForumShaolinreply',
    data
  })
}

// 查询所有用户
export const findAllReply = () => {
  return request({
    method: 'GET',
    url: '/forumShaolinreply/findAll'
  })
}
