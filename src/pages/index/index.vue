<template>
  <div class="main flex">
    <header :style="{'height':height+'px','padding-top':paddingHeight+'px'}">
      <image src="../../static/image/unsplash_logo.png"></image>
    </header>
    <div class="content flex"
         :style="{'padding-top':height+'px'}">
      <div class="title hide">
        <span>Photo by {{data[0].user.name}} on Unsplash。 Unsplash官方图片实时同步更新 Unsplash精选图片、高清壁纸、Unsplash图片下载 Unsplash助手</span>
      </div>
      <!-- item -->
      <div class="flex">
        <div class="item flex"
             v-for="(val,key) in data"
             :key="key">
          <ad unit-id="adunit-e9ae130b63a625d4"
              v-if="key===3" ad-intervals="30" ad-type="video"></ad>
          <ad unit-id="adunit-16758b8b52aa6b52"
              v-if="key===7" ad-intervals="30" ad-type="video"></ad>
          <ad unit-id="adunit-ade4ac59067aeeb9"
              v-if="key===10" ad-intervals="30"></ad>
          <ad unit-id="adunit-53bcefd25f26fd73"
              v-if="key===13" ad-intervals="30" ad-type="video"></ad>
          <ad unit-id="adunit-76e23695b1552a61"
              v-if="key===15" ad-intervals="30"></ad>
          <ad unit-id="adunit-93e2ee2bb7eff037"
              v-if="key===18" ad-intervals="30"></ad>
          <ad unit-id="adunit-a1caa0e1cc5bbd90"
              v-if="key>20&&key%5===0&&key<40" ad-intervals="30"></ad>
          <ad unit-id="adunit-b91c1cb9b293f052"
              v-if="key>40&&key%4===0&&key<60" ad-intervals="30"></ad>
          <ad unit-id="adunit-2a6f6754d63eb41b"
              v-if="key>60&&key%3===0&&key<80" ad-type="video" ad-intervals="30"></ad>
          <ad unit-id="adunit-b1b35184ce7467f6"
              v-if="key>80&&key%2===0" ad-intervals="30"></ad>
          <div class="author flex"
               :data-value="val.user.username"
               @click="author($event,key)">
            <image :src="val.user.profile_image.medium"
                   lazy-load="true"></image>
            <span v-text="val.user.name"></span>
          </div>
          <div class="item-image flex"
               :style="{height:750/val.width*val.height/2+'px'}">
            <div class="title"
                 :style="{opacity:val.status===2?1:0}">
              <span>{{val.alt_description?val.alt_description:''}} {{val.description?val.description:''}} Photo by {{val.user.name}} on Unsplash。 Unsplash官方图片实时同步更新 Unsplash精选图片、高清壁纸、Unsplash图片下载 Unsplash助手</span>
            </div>
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
                        :data-username="val.user.name"
                        :data-title="val.alt_description"
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
           v-if="time">
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
      layer: { 'download': false, 'user': '' },
      index: '',
      setTime: '',
      height: 0,
      time: 2,
      setting: 0,
      paddingHeight: 0,
      page: 1,
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
    clearInterval(this.setTime)
    this.setTime = setInterval(() => {
      if (this.time) {
        this.time--
      }
    }, 1000)
    this.height = this.TOP + 44
    this.paddingHeight = this.TOP
    this._getData()
    this._getRandom()
  },
  methods: {
    async _getData () {
      let res = await getData(`index?page=${this.page}`)
      if (res.error_code === 10000) {
        this.page = res.data.currentPage + 1
        let query = 60
        if (typeof this.setting === 'undefined' || this.setting === 0) {
          query = 40
        } else if (this.setting === 2) {
          query = 80
        }
        res.data.data.map((item) => {
          if (query !== 60) {
            item.urls.small = item.urls.small.replace('60', query)
          }
          this.data.push(item)
        })
        wx.stopPullDownRefresh()
      }
    },
    async _getRandom () {
      let res = await getData('random')
      if (res.error_code === 10000) {
        wx.setStorageSync('background', res.data.urls.small)
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
      this.data[key]['status'] = 2
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
      if (!wx.getStorageSync('token')) {
        this.status = true
        return false
      }
      let url = this.data[key]['urls']['thumb']
      let id = this.data[key]['id']
      if (status) {
        // 取消收藏
        (async () => {
          let data = await getData(`like/${id}`, '', 'DELETE')
          if (data.error_code === 10000) {
            this.data[key]['status'] = !status
            this.data[key]['likes']--
          }
        })()
      } else {
        // 收藏
        (async () => {
          let data = await getData('like', { pid: id, 'url': url, 'status': 1 }, 'POST')
          if (data.error_code === 9999) {
            this.status = true
          } else if (data.error_code === 10000) {
            this.data[key]['status'] = !status
            this.data[key]['likes']++
            wx.showToast({
              title: '操作成功',
              icon: 'none',
              duration: 2000,
              mask: true,
              success: res => {}
            })
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
      let small = this.data[key]['urls']['small']
      this.layer.user = this.data[key]['user']['name']
      this.layer.download = small
      this._download(`https://unsplash.mphot.cn/api/download?url=${small}`)
    },
    close () {
      this.status = false
    }
  },
  onReachBottom: function () {
    this._getData(this.page)
    this.page++
  },
  onPullDownRefresh: function () {
    this.time = 1
    this.data = []
    this.page = 1
    this._getData(this.page)
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
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.12);
    top: 0px;
    display: flex;
    box-sizing: border-box;
    z-index: 9999;
    image {
      width: 100px;
      height: 25px;
      margin: auto 5px;
    }
  }

  .content {
    width: 7.5rem;
    margin-top: 10px;
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
        margin-bottom: 5px;
        image {
          width: 43px;
          height: 43px;
          border-radius: 100%;
          margin: auto 0px;
        }
        span {
          line-height: 1rem;
          font-size: 16px;
          font-weight: 500;
          color: #000;
          margin-left: 10px;
        }
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
</style>