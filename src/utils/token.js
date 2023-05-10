
const KEY = 'react-first'

const setToken = (token) => {
  window.localStorage.setItem(KEY, token)
}

const getToken = (token) => {
  return window.localStorage.getItem(KEY, token)
}

const removeToken = (token) => {
  window.localStorage.removeItem(KEY, token)
}

export {
  setToken,
  getToken,
  removeToken
}