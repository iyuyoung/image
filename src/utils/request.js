var Fly = require('flyio/dist/npm/wx')

const request = new Fly()

// 配置请求基地址
request.config.baseURL = 'https://unsplash.mphot.cn/api/'

request.interceptors.request.use(
  (request) => {
    // 给所有请求添加自定义header
    request.headers['token'] = wx.getStorageSync('token')
    return request
  }
)

request.interceptors.response.use(
  (response, promise) => {
    wx.hideLoading()
    return promise.resolve(response.data)
  },
  (err, promise) => {
    wx.hideLoading()
    wx.showToast({
      title: err.response.data.msg,
      icon: 'none'
    })
    return promise.resolve()
  }
)

/***
 * 请求数据
 * @param url
 * @param data
 * @param method
 * @returns {FlyPromise<any>}
 */
export function getData (url, data, method = 'GET') {
  return request.request(url, data, {'method': method})
}
