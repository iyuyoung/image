<template>
  <div class="main">
    <scroll-view>
      <div class="content">
        <!-- 列表 -->
        <div class="flex list">
          <div class="item flex" v-for="(val, key) in list" :key="key">
            <ad unit-id="adunit-a4219c4dd580547b" ad-intervals="30" v-if="key === 2"></ad>
            <ad unit-id="adunit-d276b550be3a144f" ad-intervals="30" v-if="key === 5"></ad>
            <ad unit-id="adunit-16758b8b52aa6b52"
              v-if="key===7" ad-intervals="30" ad-type="video"></ad>
            <ad unit-id="adunit-dc2c252b92d7dbd2"
                v-if="key===10" ad-intervals="30"></ad>
            <ad unit-id="adunit-53bcefd25f26fd73"
                v-if="key===13" ad-intervals="30" ad-type="video"></ad>
            <ad unit-id="adunit-25ccf9ef7fc48d65" ad-intervals="30" v-if="key === 15"></ad>
            <ad unit-id="adunit-b91c1cb9b293f052" ad-intervals="30" v-if="key === 18"></ad>
            <ad unit-id="adunit-b1b35184ce7467f6" ad-intervals="30" v-if="key === 20"></ad>
            <div
              class="item-image flex"
              :style="{ height: ((750 / val.width) * val.height) / 2 + 'px' }"
            >
              <div class="title" :style="{ opacity: val.status === 2 ? 1 : 0 }">
                <span
                  >{{ val.alt_description ? val.alt_description : "" }}
                  {{ val.description ? val.description : "" }} Photo by
                  {{ val.user.name }} on Unsplash。 Unsplash官方图片实时同步更新
                  Unsplash精选图片、高清壁纸、Unsplash图片下载
                  Unsplash助手</span
                >
              </div>
              <image
                :src="val.urls.small"
                :style="{
                  background: val.color,
                  height: ((750 / val.width) * val.height) / 2 + 'px',
                }"
                mode="aspectFill"
                lazy-load="true"
                :data-value="val.urls.small"
                @click="browser($event, key)"
              ></image>
            </div>
            <div class="setting">
              <div class="setting-first">
                <div class="like icon" @click="like(val.status, key)">
                  <image src="../../static/image/icon_like.png"></image>
                  <span v-text="val.likes"></span>
                </div>
                <div class="share icon">
                  <button
                    plain="true"
                    open-type="share"
                    :data-username="val.user.name"
                    :data-title="val.alt_description"
                    :data-image="val.urls.thumb"
                  ></button>
                  <image src="../../static/image/icon_share.png"></image>
                </div>
              </div>
              <div class="download icon" @click="download(key)">
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
    </scroll-view>
    <Login :status="status" @close_login="close"></Login>
    <!-- 确认下载 -->
    <div class="layer" v-if="layer.download">
      <div class="layer-bg"></div>
      <div class="center download flex">
        <div class="image">
          <image :src="layer.download" mode="aspectFill"></image>
        </div>
        <div class="thanks flex">
          <h3>Say thanks</h3>
          <span
            >Crediting isn’t required, but is appreciated and allows
            photographers to gain embed a credit badge.</span
          >
          <span>Photo by on Unsplash</span>
          <span>图片高清无压缩,请注意手机流量使用情况</span>
        </div>
        <div class="layer-footer flex">
          <span class="loader">下载中...</span>
        </div>
      </div>
      <div class="layer-close flex">
        <i @click="layer.download = false">
          <image src="../../static/image/icon_close.png"></image>
        </i>
      </div>
    </div>
  </div>
</template>

<script>
import { getData } from '../../utils/request'
import store from '../author/store'
import Login from '../../components/Login'

export default {
  data () {
    return {
      current: 0,
      status: false,
      cdn: 'http://img.0558web.com',
      index: '',
      height: 0,
      setting: 0,
      image: '',
      title: '',
      background: [],
      layer: { download: false, user: '' },
      paddingHeight: 0,
      page: 1,
      list: []
    }
  },

  components: { Login },
  onShow () {

  },
  onLoad (option) {
    this.page = 1
    this.list = []
    wx.setNavigationBarTitle({ title: option.title })
    this.title = option.title

    let interstitialAd = null

    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-fff5af3f2b966a97'
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
    this._getData()
  },
  methods: {
    async _getData () {
      let res = await getData(`search?title=${this.title}&page=${this.page}`)
      if (res.error_code === 10000) {
        res.data.data.map((item) => {
          this.list.push(item)
        })
        this.page = parseInt(res.data.page) + 1
        wx.stopPullDownRefresh()
      }
    },
    change (e) {
      this.current = e.target.current
      this.image = this.list[this.current]['urls']['small']
    },
    browser (e, key) {
      let id = this.list[key]['id']
      let path = e.currentTarget.dataset.value
      wx.previewImage({
        current: path,
        urls: [path]
      })
      this.list[key]['status'] = 2
      getData('like', { pid: id, url: path, status: 0 }, 'POST')
    },
    author (e, key) {
      store.commit('setData', this.list[key]['user'])
      wx.navigateTo({
        url: `/pages/author/main?username=${e.currentTarget.dataset.value}`
      })
    },
    // 收藏
    like (key) {
      let url = this.list[key]['urls']['thumb']
      let id = this.list[key]['id']
      if (id) {
        (async () => {
          let data = await getData(
            'like',
            { id: id, url: url, status: 1 },
            'POST'
          )
          if (data.error_code === 10000) {
            this.list[key]['likes']++
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
                      // 在页面中定义插屏广告
                      let interstitialAd = null

                      // 在页面onLoad回调事件中创建插屏广告实例
                      if (wx.createInterstitialAd) {
                        interstitialAd = wx.createInterstitialAd({
                          adUnitId: 'adunit-65251f2e715de801'
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
    // 下载远程链接
    download (key) {
      let small = this.list[key]['urls']['small']
      this.layer.user = this.list[key]['user']['name']
      this.layer.download = small
      this._download(`https://unsplash.mphot.cn/api/download?url=${small}`)
    },
    close () {
      this.status = false
    }
  },
  onReachBottom: function () {
    this._getData()
  },
  onShareAppMessage: function (e) {
    if (e.from === 'button') {
      return {
        'title': `${e.target.dataset.title} @ Photo by ${e.target.dataset.username} on Unsplash`,
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
    margin-top: 15px;
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
          .title {
            position: absolute;
            width: 100%;
            padding: 0.25rem;
            display: flex;
            align-content: flex-end;
            background: linear-gradient(
              to bottom,
              rgba(0, 0, 0, 0.01),
              rgba(0, 0, 0, 0.3)
            );
            left: 0;
            bottom: 0px;
            transition: all 0.2s ease-in-out;
            z-index: 1000;
            font-size: 14px;
            color: #fff;
            box-sizing: border-box;
            opacity: 0;
            span {
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              line-clamp: 1;
              -webkit-box-orient: vertical;
              word-break: break-all;
              height: 0.38rem;
            }
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
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.12);
  left: 0px;
  top: 0px;
  display: flex;
  box-sizing: border-box;
  z-index: 9999;
  input {
    margin: auto 12px;
    border: 1px solid #dfdfdf;
    height: 32px;
    line-height: 32px;
    border-radius: 20px;
    width: 60%;
    font-size: 14px;
    padding: 0px 10px;
    box-sizing: border-box;
  }
  i {
    display: flex;
    margin: auto 0px auto -45px;
    image {
      width: 0.45rem;
      height: 0.45rem;
      margin: auto;
    }
  }
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
