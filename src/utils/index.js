/***
 * 打开页面
 * @param path
 * @param param
 * @private
 */
export function _NavigateTo (path, param = '') {
  wx.navigateTo({
    url: `/pages/${path}/main?id=${param}`
  })
}

/***
 * 关闭页面
 * @private
 */
export function _navigateBack () {
  wx.navigateBack({
    delta: 1
  })
}

/**
 * 判断是否为空
 * @param text
 * @returns {boolean}
 */
export function _isNull (text) {
  if (!text || text === null || text === '' || typeof (text) === 'undefined' || !text.trim().length || text === 'null') {
    return true
  }
}

/***
 * 设置Storage
 * @param key
 * @param data
 * @private
 */
export function _setStorage (key, data) {
  wx.setStorage({
    key: key,
    data: data
  })
}

/***
 * 获取缓存信息
 * @param key
 * @private
 */
export function _getStorage (key) {
  wx.getStorage({
    key: key,
    success: (res) => {
      console.log(res.data)
      return res.data
    }
  })
}

/***
 * 移除缓存
 * @param key
 * @private
 */
export function _removeStorage (key) {
  wx.removeStorage({
    key: key,
    success: (res) => {
      return res.data
    }
  })
}
