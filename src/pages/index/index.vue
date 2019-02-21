<template>
  <div class="main">
    <header :style="{'height':height+'px','padding-top':paddingHeight+'px'}">
      <image src="../../static/image/unsplash_logo.png"></image>
    </header>
    <scroll-view>
      <div class="content" v-if="!time">
        <swiper previous-margin="15px" next-margin="15px" @change="change($event)">
          <block v-for="(val,key) in data" :key="key">
            <swiper-item class="item" :class="{'current-item':current==key}">
              <image lazy-load="true" :src="val.urls.small" class="slide-image" mode="aspectFill" :data-value="val.urls.small"  @click="browser($event)"></image>
              <div class="like" @click="like(true)">
                <image src="../../static/image/icon_dislike.png" v-if="status"></image>
                <image src="../../static/image/icon_like.png" v-else></image>
              </div>
              <div class="describe" :data-value='val.user.username' @click="author($event,key)">
                <image :src="val.user.profile_image.small"></image>
                <span v-text="val.user.name"></span>
              </div>
            </swiper-item>
          </block>
        </swiper>
      </div>
      <div class="no-data" v-else>
        <loading></loading>
      </div>
    </scroll-view>
    <Login :status="status" @close_login="close"></Login>
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
        paddingHeight: 0,
        page: 1,
        data: []
      }
    },

    components: { Login, Loading },
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
          data.data.map((item) => {
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
      browser (e) {
        let path = e.currentTarget.dataset.value
        wx.previewImage({
          current: path,
          urls: [path]
        })
      },
      author (e, key) {
        store.commit('setData', this.data[key]['user'])
        wx.navigateTo({
          url: `/pages/author/main?username=${e.currentTarget.dataset.value}`
        })
      },
      // 收藏
      like (status) {
        this.status = status
      },
      close () {
        this.status = false
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
    float:left;
    margin-top:90px;
    width:7.5rem;
    }

  .no-data{width:100%;height:10rem;display:flex;}

  swiper{
    height:10rem;
    }

  .item{
    position:relative;
    display:flex;
    width:7.5rem;
    height:10rem;
    flex-wrap:wrap;
    }

  .slide-image{
    overflow:hidden;
    margin:auto;
    width:7rem;
    height:9rem;
    }
  .like{width:35px;height:35px;position:absolute;top:10px;right:10px;background:rgba(0,0,0,0.5);border-radius:100%;display:flex}
  .like image{width:28px !important;height:28px !important;margin:auto}
  .item .describe{
    bottom:-1rem;
    opacity:0;
    }

  .describe{
    position:absolute;
    left:0;
    width:7rem;
    background:-webkit-gradient(linear, left top, left bottom, from(transparent), to(#000));
    background:-webkit-linear-gradient(top, transparent, #000);
    background:-moz-linear-gradient(top, transparent, #000);
    background:-ms-linear-gradient(top, transparent, #000);
    background-color:transparent;
    color:#fff;
    text-align:center;
    font-size:14px;
    line-height:1rem;
    opacity:1 !important;
    display:flex;
    z-index:100;
    justify-content:center
    }

  .describe image{
    width:0.65rem !important;
    height:0.65rem !important;
    float:left;
    border-radius:100%;
    margin-top:0.175rem;
    margin-right:10px;
    }

  .describe span{
    float:left
    }

  .current-item{
    z-index:10;
    border-radius:4px;
    -webkit-box-shadow:0 5px 12px rgba(255, 255, 255, .5);
    -moz-box-shadow:0 5px 20px rgba(255, 255, 255, .5);
    box-shadow:0 5px 20px rgba(255, 255, 255, .5);
    transition:all .5s;
    }

  .current-item .describe{
    bottom:0;
    border-radius:0 0 4px 4px;
    opacity:10;
    transition:all .5s;
    }

  .current-item image{
    width:100%;
    height:10rem;
    transition:all .5s;
    }

  header{width:100%;background:#fff;position:fixed;box-shadow:1px 1px 5px rgba(0, 0, 0, .05);left:0px;top:0px;display:flex;box-sizing:border-box;z-index:9999}

  header image{width:100px;margin-left:10px;height:25px;margin-top:15px;}

</style>
