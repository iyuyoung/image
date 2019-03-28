<template>
  <div class="main">
    <header :style="{'height':height+'px','padding-top':paddingHeight+'px'}">
      <image src="../../static/image/pexels_logo.png"></image>
    </header>
    <div class="content">
      <div class="item">
        <video autoplay="true" src="http://pkv9zpvil.bkt.clouddn.com/1108860891.mp4" v-if="current===1"></video>
        <div class="poster" v-else @click="start(1)">
          <image mode="aspectFill"
                 src="http://pkv9zpvil.bkt.clouddn.com/1108860891.png?imageView2/2/w/750/h/450/format/jpg/interlace/1/q/75|imageslim"></image>
          <i>
            <image src="../../static/image/bofang.png"></image>
          </i>
        </div>
        <div class="describe">
          <span>birch, autumn, trees</span>
          <image src="../../static/image/fuzhi.png" class="copy"
                 @click="copy('http://pkv9zpvil.bkt.clouddn.com/1108860891.mp4')"></image>
          <button plain="true" open-type="share"></button>
          <image src="../../static/image/share.png" class="share"></image>
        </div>
      </div>
      <div class="item">
        <video autoplay="true" src="http://pkv9zpvil.bkt.clouddn.com/1168150781.mp4" v-if="current===2"></video>
        <div class="poster" v-else @click="start(2)">
          <image mode="aspectFill"
                 src="http://pkv9zpvil.bkt.clouddn.com/1168150781.png?imageView2/2/w/750/h/450/format/jpg/interlace/1/q/75|imageslim"></image>
          <i>
            <image src="../../static/image/bofang.png"></image>
          </i>
        </div>
        <div class="describe">
          <span>street, traffic, cars</span>
          <image src="../../static/image/fuzhi.png" class="copy"
                 @click="copy('http://pkv9zpvil.bkt.clouddn.com/1168150781.mp4')"></image>
          <button plain="true" open-type="share"></button>
          <image src="../../static/image/share.png" class="share"></image>
        </div>
      </div>
      <div class="item">
        <video autoplay="true" v-if="current===3" src="http://pkv9zpvil.bkt.clouddn.com/1105761827.mp4"></video>
        <div class="poster" v-else @click="start(3)">
          <image mode="aspectFill"
                 src="http://pkv9zpvil.bkt.clouddn.com/1105761827.png?imageView2/2/w/750/h/450/format/jpg/interlace/1/q/75|imageslim"></image>
          <i>
            <image src="../../static/image/bofang.png"></image>
          </i>
        </div>
        <div class="describe">
          <span>aerial, aerial shot, clouds</span>
          <image src="../../static/image/fuzhi.png" class="copy"
                 @click="copy('http://pkv9zpvil.bkt.clouddn.com/1105761827.mp4')"></image>
          <button plain="true" open-type="share"></button>
          <image src="../../static/image/share.png" class="share"></image>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getData } from '../../utils/request'

  export default {
    data () {
      return {
        current: 0,
        index: 0,
        height: 0,
        paddingHeight: 0,
        page: 1,
        data: []
      }
    },

    components: {},
    onLoad () {
      this.height = this.TOP + 50
      this.paddingHeight = this.TOP
      this._getData(this.page)
    },
    methods: {
      async _getData (id) {
        let data = await getData(`index/${id}`, null, 'GET')
        if (data.error_code === 10000) {
          data.data.map((item) => {
            this.data.push(item)
          })
          this.page++
        }
      },
      // copy
      copy (url) {
        wx.setClipboardData({
          data: url,
          success: (res) => {
            wx.getClipboardData({
              success: (res) => {
                wx.showToast({title: '复制成功', icon: 'none', duration: 2000})
              }
            })
          }
        })
      },
      start (index) {
        this.current = index
      }
    }
  }
</script>

<style scoped>
  .main{
    float:left;
    display:flex;
    box-sizing:border-box;
    width:7.5rem;
    }

  .content{
    margin-top:90px;
    width:7.5rem;
    display:flex;
    flex-wrap:wrap;
    align-content:flex-start;
    box-sizing:border-box;
    }

  .item{
    position:relative;
    display:flex;
    width:7.5rem;
    flex-wrap:wrap;
    }

  .item video{width:7.5rem;}

  .describe{
    width:7.5rem;
    color:#333;
    font-size:14px;
    line-height:1rem;
    display:flex;
    justify-content:flex-start;
    box-sizing:border-box;
    position:relative;
    padding:0px 0.25rem;
    }

  .describe image{width:20px;
    height:20px;
    position:absolute;
    top:15px;}

  .describe button{
    position:absolute;
    height:40px;
    right:0.25rem;
    z-index:1000;
    border:none;
    top:5px;
    }

  .share{right:0.25rem}

  .copy{right:0.9rem}

  .poster{width:7.5rem;height:4.5rem;display:flex;position:relative}

  .poster image:first-child{width:7.5rem;height:4.5rem;margin:auto}

  .poster i{width:7.5rem;height:4.5rem;margin:auto;position:absolute;left:0px;top:0px;background:rgba(0, 0, 0, 0.2);display:flex;z-index:999}

  .poster i image{width:25px;height:25px;margin:auto;border-radius:100%;
    border:1px solid #00d8a0;padding:5px;}

  header{width:100%;background:#fff;position:fixed;box-shadow:1px 1px 5px rgba(0, 0, 0, .05);left:0px;top:0px;display:flex;box-sizing:border-box;z-index:9999999999999}

  header image{width:100px;margin-left:10px;height:25px;margin-top:15px;}

</style>
