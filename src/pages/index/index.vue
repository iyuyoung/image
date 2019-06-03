<template>
  <div class="main flex">
    <header :style="{'height':height+'px','padding-top':paddingHeight+'px'}">
      <image src="../../static/image/unsplash_logo.png"></image>
    </header>
    <div class="content flex">
      <!-- item -->
      <div class="flex"
           v-if="!time">
        <div class="item flex"
             v-for="(val,key) in data"
             :key="key">
          <ad unit-id="adunit-d276b550be3a144f"
              v-if="key===2"></ad>
          <ad unit-id="adunit-b91c1cb9b293f052"
              v-if="key===5"></ad>
          <ad unit-id="adunit-ade4ac59067aeeb9"
              v-if="key===10"></ad>
          <ad unit-id="adunit-76e23695b1552a61"
              v-if="key===15"></ad>
          <ad unit-id="adunit-93e2ee2bb7eff037"
              v-if="key===18"></ad>
          <ad unit-id="adunit-d276b550be3a144f"
              v-if="key>20&&key%5===0&&key<50"></ad>
          <ad unit-id="adunit-b91c1cb9b293f052"
              v-if="key>50&&key%4===0&&key<80"></ad>
          <ad unit-id="adunit-76e23695b1552a61"
              v-if="key>80&&key%3===0&&key<150"></ad>
          <ad unit-id="adunit-93e2ee2bb7eff037"
              v-if="key>150&&key%2===0"></ad>
          <div class="author flex"
               :data-value="val.user.username"
               @click="author($event,key)">
            <image :src="val.user.profile_image.small"></image>
            <span v-text="val.user.name"></span>
          </div>
          <div class="item-image flex"
               :style="{height:750/val.width*val.height/2+'px'}">
            <image :src="val.urls.small"
                   :style="{background:val.color,height:750/val.width*val.height/2+'px'}"
                   mode="aspectFill"
                   :data-value="val.urls.small"
                   @click="browser($event,key)"></image>
          </div>
          <div class="setting">
            <div class="setting-first">
              <div class="like icon"
                   @click="like(val.status,key)">
                <image src="../../static/image/icon_like.png"></image>
                <span v-text="val.likes"></span>
              </div>
              <div class="share icon">
                <button plain="true"
                        open-type="share"
                        :data-image="val.urls.thumb"></button>
                <image src="../../static/image/icon_share.png"></image>
              </div>
            </div>
            <div class="download icon"
                 @click="download(key)">
              <image src="../../static/image/icon_download.png"></image>
            </div>
          </div>
        </div>
      </div>
      <div class="no-data"
           v-else>
        <loading></loading>
      </div>
      <!-- loading -->
      <div class="loading"
           v-if="page!==1&&!time">
        <image src="../../static/image/load-more.svg"></image>
      </div>
    </div>
    <Login :status="status"
           @close_login="close"></Login>
  </div>
</template>

<script>
import { getData } from '../../utils/request'
import store from '../author/store'
import Loading from '../../components/Loading'
import Login from '../../components/Login'
// import card from '../../utils/card'
// let data = {'name': '爱狗极'}
// card.do(data)
export default {
  data () {
    return {
      current: 0,
      status: false,
      index: '',
      height: 0,
      time: 2,
      setting: 0,
      paddingHeight: 0,
      page: 1,
      temp: 'card._template()',
      data: []
    }
  },

  components: { Login, Loading },
  onShow () {
    wx.getStorage({
      key: 'setting',
      success: (res) => {
        this.setting = res.data
      }
    })
  },
  onLoad () {
    setInterval(() => {
      if (this.time) {
        this.time--
      }
    }, 1000)
    this.height = this.TOP + 50
    this.paddingHeight = this.TOP
    this._getData(this.page)
  },
  methods: {
    async _getData (id) {
      let data = await getData(`index/${id}`, null, 'GET')
      if (data.error_code === 10000) {
        let query = 60
        if (typeof this.setting === 'undefined' || this.setting === 0) {
          query = 40
        } else if (this.setting === 2) {
          query = 80
        }
        data.data.map((item) => {
          if (query !== 60) {
            item.urls.small = item.urls.small.replace('60', query)
          }
          this.data.push(item)
        })
        this.page++
      }
    },
    change (e) {
      this.current = e.target.current
      if (this.data.length - this.current === 5) {
        this._getData(this.page)
      }
    },
    browser (e, key) {
      let id = this.data[key]['id']
      let path = e.currentTarget.dataset.value
      wx.previewImage({
        current: path,
        urls: [path]
      })
      getData('like', { id: id, 'url': path, 'status': 0 }, 'POST')
    },
    author (e, key) {
      store.commit('setData', this.data[key]['user'])
      wx.navigateTo({
        url: `/pages/author/main?username=${e.currentTarget.dataset.value}`
      })
    },
    share (key) { },
    // 收藏
    like (status, key) {
      let url = this.data[key]['urls']['thumb']
      let id = this.data[key]['id']
      if (status) {
        // 取消收藏
        (async () => {
          let data = await getData(`like/${this.id}`, '', 'DELETE')
          if (data.error_code === 10000) {
            this.data[key]['status'] = !status
            this.data[key]['likes']--
          }
        })()
      } else {
        // 收藏
        (async () => {
          let data = await getData('like', { id: id, 'url': url, 'status': 1 }, 'POST')
          if (data.error_code === 9999) {
            this.status = true
          } else if (data.error_code === 10000) {
            this.data[key]['status'] = !status
            this.data[key]['likes']++
          }
        })()
      }
    },
    // 下载图片
    _download (url) {
      wx.downloadFile({
        url: url,
        success: (res) => {
          if (res.statusCode === 200) {
            console.log(res.tempFilePath)
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: (res) => {
                if (res.errMsg === 'saveImageToPhotosAlbum:ok') {
                  wx.showToast({
                    title: '保存成功', // 提示的内容,
                    icon: 'success', // 图标,
                    duration: 2000, // 延迟时间,
                    mask: true, // 显示透明蒙层，防止触摸穿透,
                    success: res => {
                      // 在页面中定义插屏广告
                      let interstitialAd = null

                      // 在页面onLoad回调事件中创建插屏广告实例
                      if (wx.createInterstitialAd) {
                        interstitialAd = wx.createInterstitialAd({
                          adUnitId: 'adunit-bec6635a6f3ac770'
                        })
                        interstitialAd.onLoad((err) => {
                          console.log(err)
                        })
                        interstitialAd.onError((err) => {
                          console.log(err)
                        })
                        interstitialAd.onClose((err) => {
                          console.log(err)
                        })
                      }

                      // 在适合的场景显示插屏广告
                      if (interstitialAd) {
                        interstitialAd.show().catch((err) => {
                          console.error(err)
                        })
                      }
                    }
                  })
                }
              },
              fail: (res) => {
                console.log(res)
                if (res.errMsg === 'saveImageToPhotosAlbum:fail auth deny') {
                  wx.authorize({
                    scope: 'scope.writePhotosAlbum',
                    success () {
                      console.log('授权成功')
                    },
                    // eslint-disable-next-line handle-callback-err
                    fail (error) {
                      wx.showModal({
                        content: '保存图片到你的相册',
                        showCancel: false,
                        success: (res) => {
                          wx.openSetting({
                            success: (res) => {
                            }
                          })
                        }
                      })
                    }
                  })
                }
              }
            })
          }
        },
        fail: (res) => {
          console.log(res)
        }
      })
    },
    // 下载远程图片
    _remoteUrl (photo) {
      wx.request({
        url: `https://download.0558web.com/upload/${photo}`, // 开发者服务器接口地址",
        data: 'data', // 请求的参数",
        method: 'GET',
        dataType: 'json', // 如果设为json，会尝试对返回的数据做一次 JSON.parse
        success: (res) => {
          if (res.data.status === 200) {
            if (!res.data.data || res.data.data.length < 5) {
              wx.hideLoading()
              wx.showToast({
                title: '下载失败', // 提示的内容,
                icon: 'none', // 图标,
                duration: 2000, // 延迟时间,
                mask: true, // 显示透明蒙层，防止触摸穿透,
                success: res => { }
              })
            } else {
              let url = `https://download.0558web.com${res.data.data}`
              this._download(url)
            }
          }
        },
        fail: () => { },
        complete: () => { }
      })
    },
    // 下载远程链接
    download (key) {
      let small = this.data[key]['urls']['small']
      let url = new RegExp('(photo-.*?=)').exec(small)[0].replace('?ixlib=', '')
      wx.showToast({
        title: '下载中', // 提示的内容,
        icon: 'loading', // 图标,
        duration: 2000, // 延迟时间,
        mask: true, // 显示透明蒙层，防止触摸穿透,
        success: res => { }
      })
      this._remoteUrl(url)
    },
    close () {
      this.status = false
    }
  },
  onReachBottom: function () {
    this._getData(this.page)
  },
  onPullDownRefresh: function () { },
  onShareAppMessage: function (e) {
    if (e.from === 'button') {
      return {
        'title': '',
        'imageUrl': e.target.dataset.image
      }
    }
  }
}
</script>

<style lang="less">
.main {
  float: left;
  display: flex;
  box-sizing: border-box;
  width: 7.5rem;
  header {
    width: 100%;
    background: #fff;
    position: fixed;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.05);
    left: 0px;
    top: 0px;
    display: flex;
    box-sizing: border-box;
    z-index: 9999;
    image {
      width: 100px;
      margin-left: 10px;
      height: 25px;
      margin-top: 15px;
    }
  }

  .content {
    margin-top: 70px;
    width: 7.5rem;
    .item {
      padding-bottom: 25px;
      ad {
        margin-bottom: 25px;
      }
      .author {
        height: 1rem;
        line-height: 1rem;
        justify-content: flex-start;
        padding: 0px 0.25rem;
        image {
          width: 32px;
          height: 32px;
          border-radius: 100%;
          margin: auto 0px;
        }
        span {
          line-height: 1rem;
          font-size: 16px;
          font-weight: 500;
          color: #000;
          margin-left: 5px;
        }
      }
      .item-image {
        width: 100%;
        min-height: 200px;
        display: flex;
        position: relative;
        i {
          position: absolute;
          width: 100%;
          min-height: 200px;
          background: #6d85c3;
          left: 0px;
          top: 0px;
          transition: all 0.2s ease-in-out;
        }
        image {
          width: 100%;
          height: auto;
          position: initial;
          z-index: 10;
          transition: all 0.2s ease-in-out;
        }
      }
      .setting {
        width: 100%;
        margin-top: 10px;
        font-size: 14px;
        padding: 0px 0.25rem;
        color: #999;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        .icon {
          border: 1px solid #ddd;
          border-radius: 4px;
          line-height: 0.6rem;
          padding: 0px 12px;
          height: 0.6rem;
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.04);
          transition: all 0.2s ease-in-out;
        }
        .setting-first {
          display: flex;
          justify-content: flex-start;
          .like {
            display: flex;
          }
          .share {
            display: flex;
            margin-left: 15px;
            position: relative;
            button {
              width: 100%;
              border: none;
              height: 30px;
              position: absolute;
              left: 0px;
              top: 0px;
            }
          }
        }
        .download {
          display: flex;
          image {
            width: 0.4rem;
            height: 0.4rem;
          }
        }
        image {
          width: 0.32rem;
          height: 0.32rem;
          margin: auto;
        }
      }
    }
    .loading {
      height: 50px;
      width: 100%;
      display: flex;
      image {
        margin: auto;
        height: 50px;
      }
    }
  }
  .no-data {
    width: 100%;
    height: 10rem;
    display: flex;
  }
}
</style>