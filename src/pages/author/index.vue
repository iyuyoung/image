<template>
  <div class="main">
    <div class="header">
      <div class="back" @click="back">
        <image src="../../static/image/icon_left.png"></image>
      </div>
      <div class="header-bg">
        <image :src="image"></image>
      </div>
      <div class="header-detail">
        <div class="info">
          <div class="avatar">
            <image :src="user.profile_image['small']"></image>
          </div>
          <div class="message">
            <span class="nickname" v-text="user.name"></span>
            <div class="message-item">
              <span class="location" v-text="user.location"></span>
              <span class="site" v-text="user.portfolio_url"></span>
            </div>
          </div>
        </div>
        <div class="detail">
          <span class="describe" v-text="user.bio===null?'No brief introduction':user.bio"></span>
        </div>
      </div>
    </div>
    <div class="content" v-if="data.length">
      <div class="item" v-for="(val,key) in data" :key="key">
        <image :src="val.urls.small" mode="aspectFill"></image>
      </div>
    </div>
    <div class="no-data" v-else>
      <loading></loading>
    </div>
  </div>
</template>

<script>
  import { getData } from '../../utils/request'
  import store from './store'
  import Loading from '../../components/Loading'

  export default {
    name: 'index',
    components: {Loading},
    data () {
      return {
        image: '',
        color: '#ccc',
        data: [],
        user: [],
        page: 1
      }
    },
    onLoad (option) {
      this.page = 1
      this.data = []
      this.user = store.state.data
      this._getData(option.username)
    },
    methods: {
      async _getData (username) {
        let data = await getData(`user?username=${username}&page=${this.page}`, null, 'GET')
        if (data.error_code === 10000) {
          data.data.map((item, key) => {
            this.data.push(item)
            if (key === 1) {
              this.color = item.color
              this.image = item.urls.small
            }
          })
          this.page++
        }
      },
      back () {
        wx.navigateBack({
          delta: 1
        })
      }
    },
    onReachBottom: function () {
      console.log(this.page++)
    }
  }
</script>

<style scoped>
  .main {
    width: 100%;
    border-top: 1px solid #f2f2f2;
    float: left;
  }
  .header {
    width: 7.5rem;
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    margin-top: 60px;
  }
  .back{width: 0.75rem;height: 0.45rem;background: rgba(0,0,0,0.35);border-radius: 0px 20px 20px 0px;position: fixed;top: 31px;left: 0px;display: flex;z-index: 99999}
  .back image{width: 0.45rem;height: 0.45rem;margin: auto}

  .header-bg {
    width: 7.5rem;
    height: 6rem;
    opacity: 0.6;
    position: absolute;
    top: 0px;
    left: 0px;
  }
  .header-bg image{
    width: 100%;
    height: 5rem;
    filter: blur(50px);
    box-shadow: (2px 2px 10px #ccc);
    position: absolute;
    left: 0px;
    top: 0px;
  }

  .header-detail {
    width: 6rem;
    margin: auto;
    z-index: 100;
    background: #fff;
    padding: 15px;
    border-radius: 5px;
    margin-top: 0.5rem;
    -webkit-box-shadow: 0 5px 25px rgba(0, 0, 0, .3);
    -moz-box-shadow: 0 5px 25px rgba(0, 0, 0, .3);
    box-shadow: 0 5px 25px rgba(0, 0, 0, .3);
  }

  .info {
    width: 6rem;
    display: flex;
    margin-top: 10px;
  }

  .avatar {
    display: flex
  }

  .avatar image {
    width: 1rem;
    height: 1rem;
    margin: auto;
    border-radius: 100%;
    overflow: hidden;
  }

  .message {
    width: 5rem;
    box-sizing: border-box;
    padding: 0.1rem 0.25rem;
    display: flex;
    flex-wrap: wrap;
    height: 1rem;
  }

  .nickname {
    width: 100%;
    font-size: 15px;
  }

  .message-item {
    display: flex;
    color: #a1a1a1;
    font-size: 14px;
    display: block;
    overflow: hidden;
    word-break: keep-all;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .message-item span:last-child {
    padding-left: 15px;
  }

  .detail {
    width: 100%;
    font-size: 15px;
    color: #a1a1a1;
    float: left;
    height: 50px;
    margin-top: 15px;
  }

  .detail span {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
  }

  .describe {
    width: 100%;
    float: left;
    color: #333;
  }

  .content {
    width: 7.5rem;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 20px;
  }

  .content image {
    width: 7rem;
  }

  .content .item:first-child {
    margin-top: 10px;
  }
  .no-data{width:100%;display:flex;height:5rem;}
</style>
