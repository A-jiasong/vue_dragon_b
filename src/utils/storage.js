// 封装本地存储模块

// 获取数据
export const getItem = name => {
  const data = window.sessionStorage.getItem(name)
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}

// 存储数据
export const setItem = (key, value) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.sessionStorage.setItem(key, value)
}

// 删除数据
export const removeItem = name => {
  window.sessionStorage.removeItem(name)
}
