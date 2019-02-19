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
