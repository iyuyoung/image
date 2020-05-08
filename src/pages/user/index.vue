<template>
  <div class="main">
    <div class="header" :style="{ 'padding-top': height + 'px' }">
      <image src="../../static/image/unsplash_logo_white.png"></image>
    </div>
    <header>
      <div class="header-bg" :style="{ 'background-image': 'url(' + bg + ')' }"></div>
      <div class="header-main padding">
        <div class="header-item flex" @click="open('personal', 0)">
          <div class="avatar">
            <open-data class="avatar-url" type="userAvatarUrl"></open-data>
          </div>
          <div class="userInfo">
            <open-data type="userNickName" class="nickname"></open-data>
          </div>
        </div>
        <div class="server flex padding">
          <div class="server-item" @click="open('list', 0)">
            <span v-text="data.footprint"></span>
            <span>足迹</span>
          </div>
          <div class="server-item" @click="open('list', 1)">
            <span v-text="data.number"></span>
            <span>收藏</span>
          </div>
        </div>
      </div>
    </header>
    <div class="content flex">
      <div class="item flex" @click="openSetting('setting')">
        <image src="../../static/image/icon-setting.png"></image>
        <span>设置</span>
        <image src="../../static/image/icon-right.png" class="icon"></image>
      </div>
      <div class="item flex">
        <button plain="true" open-type="feedback"></button>
        <image src="../../static/image/icon-chat.png"></image>
        <span>问题反馈</span>
        <image src="../../static/image/icon-right.png" class="icon"></image>
      </div>
      <div class="item flex" @click="pay">
        <image src="../../static/image/icon-gift.png"></image>
        <span>打赏作者</span>
        <image src="../../static/image/icon-right.png" class="icon"></image>
      </div>
      <div class="item flex" @click="openAd" v-if="data.ad">
        <image src="../../static/image/icon_love.png"></image>
        <span>观看视频(获得永久下载资格)</span>
        <image src="../../static/image/icon-right.png" class="icon"></image>
      </div>
    </div>
    <Login :status="status" @close_login="close"></Login>
  </div>
</template>

<script>
import { _NavigateTo } from '../../utils/index'
import { getData } from '../../utils/request'
import Login from '../../components/Login'
export default {
  components: { Login },

  data () {
    return {
      token: '',
      status: false,
      height: 20,
      bg: 'https://www.mphot.cn/uploads/20190425/photo-1565038930214-09566ed2149b.jpg?imageView2/0/format/jpg/q/80',
      data: { footprint: 0, number: 0, ad: false }
    }
  },
  onLoad () {
    this._getData()
  },
  onShow () {
    this.height = this.TOP
    this.token = wx.getStorageSync('token')
    let bg = wx.getStorageSync('background')
    if (bg) {
      setTimeout(() => {
        this.bg = bg
      }, 3000)
    }
    this._getData()
  },
  methods: {
    async _getData () {
      let data = await getData(`user`, '')
      if (data.error_code === 10000) {
        this.data = data.data
      } else {
        this.data.ad = data.data
      }
    },
    open (path, id) {
      if (wx.getStorageSync('token')) {
        _NavigateTo(path, id)
      } else {
        this.status = true
      }
    },
    openSetting (path) {
      _NavigateTo(path, 0)
    },
    close () {
      this.status = false
    },
    pay () {
      // 打赏
      wx.previewImage({
        urls: ['https://cdn.mphot.cn/pay.jpg']
      })
    },
    openAd () {
      // 在页面中定义激励视频广告
      let videoAd = null

      // 在页面onLoad回调事件中创建激励视频广告实例
      if (wx.createRewardedVideoAd) {
        videoAd = wx.createRewardedVideoAd({
          adUnitId: 'adunit-2a4ed833cfdadac2'
        })
        videoAd.onLoad(() => {
          console.log('视频加载成功')
        })
        videoAd.onError(() => {
          wx.showToast({
            title: '暂无视频',
            icon: 'none',
            duration: 1500,
            mask: true,
            success: (res) => {}
          })
        })
        videoAd.onClose((res) => {
          if ((res && res.isEnded) || res === undefined) {
            wx.showToast({
              title: '已获得',
              icon: 'none',
              duration: 1500,
              mask: true,
              success: (res) => {}
            })
          } else {
            // 播放中途退出，不下发游戏奖励
            wx.showToast({
              title: '暂未获得',
              icon: 'none',
              duration: 1500,
              mask: true,
              success: (res) => {}
            })
          }
        })
      }

      // 用户触发广告后，显示激励视频广告
      if (videoAd) {
        videoAd.show().catch(() => {
          // 失败重试
          videoAd
            .load()
            .then(() => videoAd.show())
            .catch((err) => {
              console.log(err)
            })
        })
      }
    }
  },
  created () {}
}
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  min-height: 100vh;
  background: rgba(244, 244, 244, 0.5);
  .header {
    width: 100%;
    position: fixed;
    left: 0px;
    top: 0px;
    display: flex;
    box-sizing: none;
    z-index: 9999;
    height: 44px;
    image {
      width: 100px;
      height: 25px;
      margin: auto 5px;
    }
  }
  header {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    position: relative;
    .header-bg {
      width: 100%;
      height: 240px;
      display: flex;
      background-image: url('https://www.mphot.cn/uploads/20190425/photo-1565038930214-09566ed2149b.jpg?imageView2/0/format/jpg/q/80');
      background-repeat: center;
      background-size: 100%;
      transition: all 1s;
      image {
        width: 100%;
        height: 4rem;
      }
    }
    .header-main {
      width: 6.8rem;
      height: 2.85rem;
      display: flex;
      background: #ffffff;
      box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.15);
      position: absolute;
      left: 0.35rem;
      top: 2.5rem;
      border-radius: 3px;
      box-sizing: border-box;
      flex-wrap: wrap;
      .avatar {
        width: 1.5rem;
        height: 1.2rem;
        display: flex;
        .avatar-url {
          width: 1.2rem;
          height: 1.2rem;
          margin: auto;
          border-radius: 100%;
          box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
      }
      .userInfo {
        width: 4rem;
        display: flex;
        flex-wrap: wrap;
        align-content: center;
        padding-left: 5px;
        .nickname {
          line-height: 60px;
          font-size: 18px;
        }
        span {
          width: 100%;
          display: flex;
          font-size: 16px;
          box-sizing: border-box;
        }
        &:last-child {
          font-size: 14px;
          color: #ccc;
        }
      }
      .server {
        flex-wrap: wrap;
        justify-content: space-between;
        position: relative;
        padding-top: 0.5rem;
        &:before {
          content: "";
          position: absolute;
          top: 0.25rem;
          left: 0rem;
          width: 6rem;
          height: 1px;
          background: rgba(244, 244, 244, 0.5);
        }
        .server-item {
          font-size: 14px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: flex-start;
          position: relative;
          width: 50%;
          span {
            width: 100%;
            display: flex;
            justify-content: center;
            &:first-child {
              font-size: 16px;
              color: #333;
            }
            &:last-child {
              font-size: 12px;
              color: #ccc;
            }
          }
          &:before {
            content: "";
            position: absolute;
            right: 0%;
            top: 10px;
            background: rgba(244, 244, 244, 1);
            height: 15px;
            width: 1px;
          }
          &:last-child:before {
            display: none;
          }
        }
        &:first-child {
          &:before {
            display: none;
          }
        }
      }
    }
  }
  .content {
    flex-wrap: wrap;
    margin-top: 50px;
    width: 7.5rem;
    padding: 0px 0.35rem;
    box-sizing: border-box;
    .item {
      font-size: 14px;
      color: #999;
      background: #ffffff;
      height: 1rem;
      padding: 0.25rem;
      box-sizing: border-box;
      position: relative;
      line-height: 0.5rem;
      span {
        width: 5.5rem;
        padding-left: 0.25rem;
      }
      button {
        border: none;
        position: absolute;
        left: 0px;
        bottom: 0px;
        width: 100%;
        height: 1rem;
      }
      &:before {
        content: "";
        position: absolute;
        left: 0rem;
        bottom: 0px;
        background: rgba(244, 244, 244, 0.7);
        width: 6.8rem;
        height: 1px;
      }
      &:first-child {
        border-radius: 3px 3px 0px 0px;
      }
      &:last-child {
        border-radius: 0px 0px 3px 3px;
      }
      image {
        width: 0.4rem;
        height: 0.4rem;
        margin-top: 2px;
      }
      .icon {
        width: 15px;
        height: 15px;
        position: absolute;
        right: 0.25rem;
        top: 0.35rem;
      }
    }
  }
}
</style>
