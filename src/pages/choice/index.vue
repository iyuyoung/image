<template>
  <div class="main">
    <div class="header-bg">
      <image :src="image"
             mode="aspectFill"></image>
    </div>
    <scroll-view>
      <div class="content"
           v-if="!time">
        <swiper previous-margin="15px"
                next-margin="15px"
                interval="10000"
                autoplay
                @change="change($event)">
          <block v-for="(val,key) in data"
                 :key="key">
            <swiper-item class="item"
                         :class="{'current-item':current==key}">
              <image lazy-load="true"
                     :style="{background:val.color}"
                     :src="val.urls.small"
                     class="slide-image"
                     mode="aspectFill"
                     :data-value="val.urls.small"
                     @click="browser($event,key)">
              </image>
              <div class="describe"
                   :data-value='val.user.username'
                   @click="author($event,key)">
                <image :src="val.user.profile_image.small"></image>
                <span v-text="val.user.name"></span>
              </div>
            </swiper-item>
          </block>
        </swiper>

        <!-- 列表 -->
        <div class="list">
          <div class="list-item flex"
               v-for="(val,key) in list"
               :key="key">
            <image :src="val.urls.small"
                   :style="{background:val.color,height:val.width/val.height*169+'px'}"
                   mode="aspectFill"
                   :data-value="val.urls.small"
                   @click="browser($event,key)"></image>
            <!-- <span class="list-title" v-text="val.description"></span> -->
            <div class="setting">
              <div class="setting-first"
                   @click="like(key)">
                <div class="like icon">
                  <image src="../../static/image/icon_like.png"></image>
                  <span v-text="val.likes"></span>
                </div>
                <!-- <div class="share icon">
                  <image src="../../static/image/icon_share.png"></image>
                </div> -->
              </div>
              <div class="download icon"
                   @click="download(key)">
                <image src="../../static/image/icon_download.png"></image>
              </div>
            </div>
          </div>
        </div>

        <!-- loading more -->
        <div class="loading">
          <image src="../../static/image/load-more.svg"></image>
        </div>
      </div>
      <div class="no-data"
           v-else>
        <loading></loading>
      </div>
    </scroll-view>
    <Login :status="status"
           @close_login="close"></Login>
  </div>
</template>

<script>
import { getData } from '../../utils/request'
import store from '../author/store'
import Loading from '../../components/Loading'
import Login from '../../components/Login'

export default {
  data () {
    return {
      current: 0,
      status: false,
      index: '',
      height: 0,
      time: 3,
      setting: 0,
      image: '',
      paddingHeight: 0,
      page: 1,
      data: [],
      list: []
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
    this._getData(this.page)
    this._getData(2)
  },
  methods: {
    async _getData (id) {
      let data = await getData(`index/${id}?type=1`, null, 'GET')
      if (data.error_code === 10000) {
        if (id === 1) {
          data.data.map((item) => {
            this.data.push(item)
          })
          this.image = this.data[0]['urls']['small']
        } else {
          data.data.map((item) => {
            this.list.push(item)
          })
        }
        this.page++
      }
    },
    change (e) {
      this.current = e.target.current
      this.image = this.data[this.current]['urls']['small']
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
    // 收藏
    like (key) {
      let url = this.data[key]['urls']['thumb']
      let id = this.data[key]['id']
      if (id) {
        (async () => {
          let data = await getData('like', { 'id': id, 'url': url, 'status': 1 }, 'POST')
          if (data.error_code === 10000) {
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
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: (res) => {
                if (res.errMsg === 'saveImageToPhotosAlbum:ok') {
                  wx.showToast({
                    title: '保存成功', // 提示的内容,
                    icon: 'success', // 图标,
                    duration: 2000, // 延迟时间,
                    mask: true, // 显示透明蒙层，防止触摸穿透,
                    success: res => { }
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
                              console.log(res)
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
  }
}
</script>

<style scoped>
.main {
  float: left;
  display: flex;
  box-sizing: border-box;
  width: 7.5rem;
  position: relative;
}

.content {
  float: left;
  margin-top: 40px;
  width: 7.5rem;
}
.header-bg {
  position: absolute;
  width: 100%;
  height: 7.5rem;
  display: flex;
  left: 0px;
  top: -40px;
  opacity: 0.6;
  box-shadow: 1px 2px 50px rgba(255, 255, 255, 0.5);
}
.header-bg image {
  width: 100%;
  height: 7.5rem;
  display: flex;
  filter: blur(50px);
}

.no-data {
  width: 100%;
  height: 10rem;
  display: flex;
}

swiper {
  height: 5rem;
}

.item {
  position: relative;
  display: flex;
  width: 7.5rem;
  height: 5rem;
  flex-wrap: wrap;
}

.slide-image {
  overflow: hidden;
  margin: auto;
  width: 4rem;
  height: 4rem;
}

.item .describe {
  bottom: -1rem;
  opacity: 0;
}

.describe {
  position: absolute;
  left: 0;
  width: 7rem;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(transparent),
    to(#000)
  );
  background: -webkit-linear-gradient(top, transparent, #000);
  background: -moz-linear-gradient(top, transparent, #000);
  background: -ms-linear-gradient(top, transparent, #000);
  background-color: transparent;
  color: #fff;
  text-align: center;
  font-size: 14px;
  line-height: 1rem;
  opacity: 1 !important;
  display: flex;
  z-index: 100;
  justify-content: center;
}

.describe image {
  width: 0.65rem !important;
  height: 0.65rem !important;
  float: left;
  border-radius: 100%;
  margin-top: 0.175rem;
  margin-right: 10px;
}

.describe span {
  float: left;
}

.current-item {
  z-index: 10;
  border-radius: 4px;
  -webkit-box-shadow: 0 5px 12px rgba(255, 255, 255, 0.5);
  -moz-box-shadow: 0 5px 20px rgba(255, 255, 255, 0.5);
  box-shadow: 0 5px 20px rgba(255, 255, 255, 0.5);
  transition: all 0.5s;
}
.current-item i {
  position: absolute;
  width: 100%;
  height: 5rem;
  left: 0px;
  top: 0px;
}
.current-item .describe {
  bottom: 0;
  border-radius: 0 0 4px 4px;
  opacity: 10;
  transition: all 0.5s;
}

.current-item image {
  width: 100%;
  height: 5rem;
  position: initial;
  z-index: 100;
}

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
}

header image {
  width: 100px;
  margin-left: 10px;
  height: 25px;
  margin-top: 15px;
}

/* list */
.list {
  justify-content: space-between;
  padding: 0.25rem;
  margin-top: 10px;
  box-sizing: border-box;
  position: inherit;
  z-index: 100;
  display: flex;
  background: rgba(0, 0, 0, 0);
  flex-wrap: wrap;
}
.list-item {
  width: 3.38rem;
  position: relative;
  margin-bottom: 10px;
  align-content: flex-start;
}
.list-item i {
  width: 100%;
  height: auto;
  position: absolute;
  left: 0px;
  top: 0px;
}
.list-item image {
  width: 100%;
  border-radius: 2px;
  position: initial;
  z-index: 10;
}

.setting {
  width: 100%;
  font-size: 14px;
  color: #999;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  background: #fff;
  margin-top: 5px;
}
.list-title {
  font-size: 14px;
  color: #999;
}
.icon image {
  width: 0.3rem;
  height: 0.3rem;
  margin: auto;
}

.setting-first {
  display: flex;
  justify-content: flex-start;
}
.like {
  display: flex;
}
.share {
  display: flex;
  margin-left: 7px;
}
.download {
  display: flex;
}
.download image {
  width: 0.35rem;
  height: 0.35rem;
}

.loading {
  height: 50px;
  width: 100%;
  display: flex;
}
.loading image {
  margin: auto;
  height: 50px;
}
</style>
