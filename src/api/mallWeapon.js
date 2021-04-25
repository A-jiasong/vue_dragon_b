// 封装用户相关的请求模块
import request from '@/utils/request'

// 添加
export const addMallWeapon = (data) => {
  return request({
    method: 'POST',
    url: '/mallWeapon/addMallWeapon',
    data
  })
}

// 通过id查询
export const findById = (id) => {
  return request({
    method: 'get',
    url: '/mallWeapon/findById',
    params: {
      id: id
    }
  })
}

// 通过id进行删除
export const deleteById = (id) => {
  return request({
    method: 'DELETE',
    url: '/mallWeapon/deleteById',
    params: {
      id: id
    }
  })
}

// 修改
export const updateMallWeapon = (data) => {
  return request({
    method: 'PUT',
    url: '/mallWeapon/updateMallWeapon',
    data
  })
}

// 分页查询
export const getMallWeaponList = (data) => {
  return request({
    method: 'POST',
    url: '/mallWeapon/getMallWeaponList',
    data
  })
}
