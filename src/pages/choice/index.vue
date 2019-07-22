<template>
  <div class="main">
    <div class="header-bg">
      <image :src="image"
             lazy-load="true"
             mode="aspectFill"></image>
    </div>
    <scroll-view>
      <div class="content"
           v-if="!time">
        <swiper interval="10000"
                autoplay="true"
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
                <image :src="val.user.profile_image.small"
                       lazy-load="true"></image>
                <span v-text="val.user.name"></span>
              </div>
            </swiper-item>
          </block>
        </swiper>

        <!-- 列表 -->
        <div class="flex list"
             v-if="!time">
          <div class="item flex"
               v-for="(val,key) in list"
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
            <div class="item-image flex"
                 :style="{height:750/val.width*val.height/2+'px'}">
              <image :src="val.urls.small"
                     :style="{background:val.color,height:750/val.width*val.height/2+'px'}"
                     mode="aspectFill"
                     lazy-load="true"
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
    <!-- 确认下载 -->
    <div class="layer"
         v-if="layer.download">
      <div class="layer-bg"></div>
      <div class="center download flex">
        <div class="image">
          <image :src="layer.download"
                 mode="aspectFill"></image>
        </div>
        <div class="thanks flex">
          <h3>Say thanks</h3>
          <span>Crediting isn’t required, but is appreciated and allows photographers to gain embed a credit badge.</span>
          <span>Photo by {{layer.user}} on Unsplash</span>
          <span>图片高清无压缩,请注意手机流量使用情况</span>
        </div>
        <div class="layer-footer flex">
          <span class="loader">下载中...</span>
        </div>
      </div>
      <div class="layer-close flex">
        <i @click="layer.download=false">
          <image src="../../static/image/icon_close.png"></image>
        </i>
      </div>
    </div>
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
      layer: { 'download': false, 'user': '' },
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
                    success: res => {
                      this.layer.download = false
                    }
                  })
                }
              },
              fail: (res) => {
                console.log(res)
                if (res.errMsg === 'saveImageToPhotosAlbum:fail auth deny' || res.errMsg === 'saveImageToPhotosAlbum:fail authorize no response') {
                  wx.authorize({
                    scope: 'scope.writePhotosAlbum',
                    success () {
                      console.log('授权成功')
                    },
                    // eslint-disable-next-line handle-callback-err
                    fail (error) {
                      wx.showModal({
                        content: '"Unsplash助手" 需要保存图片到你的相册',
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
                success: res => {
                  this.layer.download = false
                }
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
      let small = this.list[key]['urls']['small']
      this.layer.user = this.list[key]['user']['name']
      let url = new RegExp('(photo-.*?=)').exec(small)[0].replace('?ixlib=', '')
      this.layer.download = small
      this._remoteUrl(url)
    },
    close () {
      this.status = false
    }
  },
  onReachBottom: function () {
    this._getData(this.page)
  },
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

<style lang="less" scoped>
.main {
  float: left;
  display: flex;
  box-sizing: border-box;
  width: 7.5rem;
  position: relative;
  .content {
    float: left;
    margin-top: 40px;
    width: 7.5rem;
    swiper {
      height: 5rem;
      width: 100%;
      padding: 0px 0.25rem;
      box-sizing: border-box;
      .item {
        position: relative;
        display: flex;
        width: 7.5rem;
        height: 5rem;
        flex-wrap: wrap;
        .current-item {
          z-index: 10;
          border-radius: 4px;
          -webkit-box-shadow: 0 5px 12px rgba(255, 255, 255, 0.5);
          -moz-box-shadow: 0 5px 20px rgba(255, 255, 255, 0.5);
          box-shadow: 0 5px 20px rgba(255, 255, 255, 0.5);
          transition: all 0.5s;
          i {
            position: absolute;
            width: 100%;
            height: 5rem;
            left: 0px;
            top: 0px;
          }
          image {
            width: 100%;
            height: 5rem;
            position: initial;
            border-radius: 3px;
            z-index: 100;
          }
          .describe {
            bottom: 0;
            border-radius: 0 0 4px 4px;
            opacity: 10;
            transition: all 0.5s;
          }
        }

        .slide-image {
          overflow: hidden;
          margin: auto;
          width: 100%;
          height: 4rem;
          border-radius: 5px;
        }
        .describe {
          bottom: 20px;
          opacity: 0;
          border-radius: 0px 0px 5px 5px;
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
          image {
            width: 0.65rem !important;
            height: 0.65rem !important;
            float: left;
            border-radius: 100%;
            margin-top: 0.175rem;
            margin-right: 10px;
          }
          span {
            float: left;
          }
        }
      }
    }
    .list {
      padding: 0px 0.25rem;
      .item {
        padding-bottom: 25px;
        ad {
          margin-bottom: 0.15rem;
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
            border-radius: 3px;
            transition: all 0.2s ease-in-out;
          }
        }
        .setting {
          width: 100%;
          margin-top: 10px;
          font-size: 14px;
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
    }
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
    image {
      width: 100%;
      height: 7.5rem;
      display: flex;
      filter: blur(50px);
    }
  }
  .no-data {
    width: 100%;
    height: 10rem;
    display: flex;
  }
  .layer {
    flex-wrap: wrap;
    align-content: center;
    .download {
      border-radius: 5px;
      .image {
        width: 6.3rem;
        height: 200px;
        display: flex;
        image {
          width: 100%;
          height: 200px;
          margin: auto;
          border-radius: 5px 5px 0px 0px;
        }
      }
    }
    .thanks {
      width: 100%;
      padding: 0.25rem;
      flex-wrap: wrap;
      h3 {
        font-size: 18px;
        font-weight: 500;
      }
      span {
        width: 100%;
        font-size: 14px;
        color: #333;
        margin: 3px 0px;
        &:last-child {
          font-size: 12px;
          color: #ccc;
        }
      }
    }
    .layer-footer {
      font-size: 14px;
      justify-content: center;
      line-height: 40px;
      color: #000;
      position: relative;
      span {
        &::before {
          content: "";
          position: absolute;
          width: 0px;
          height: 3px;
          background: #000;
          left: 0px;
          bottom: 0px;
          -webkit-animation: loader 30s ease-in-out;
          animation: loader 30s ease-in-out;
        }
        @-webkit-keyframes loader {
          0% {
            width: 0px;
          }
          48% {
            width: 50%;
          }
          50% {
            width: 60%;
            right: 0px;
          }
          52% {
            width: 70%;
            right: 0px;
          }
          100% {
            width: 98%;
            right: 0px;
          }
        }

        @keyframes loader {
          0% {
            width: 0px;
          }
          48% {
            width: 50%;
          }
          50% {
            width: 60%;
            right: 0px;
          }
          52% {
            width: 70%;
            right: 0px;
          }
          100% {
            width: 98%;
            right: 0px;
          }
        }
      }
    }
    .layer-close {
      position: initial;
      z-index: 99999999999;
      height: 40px;
      margin-top: 10px;

      i {
        height: 30px;
        margin-top: 10px;
        margin: auto;
        border-radius: 100%;
        border: 2px solid #fff;
        width: 30px;
        display: flex;
        image {
          width: 25px;
          height: 25px;
          margin: auto;
        }
      }
    }
  }
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
