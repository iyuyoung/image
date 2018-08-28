<template>
  <div class="main">
    <div class="content">
      <swiper previous-margin="15px" next-margin="15px" @change="change($event)">
        <block v-for="(val,key) in data" :key="key">
          <swiper-item class="item" :class="{'current-item':current==key}">
            <image :src="val.urls.small" class="slide-image" mode="aspectFill" :data-value="val.urls.small"
                   @click="browser($event)"></image>
            <div class="describe" :data-value='val.user.username' @click="author($event,key)">
              <image :src="val.user.profile_image.small"></image>
              <span v-text="val.user.name"></span>
            </div>
          </swiper-item>
        </block>
      </swiper>
    </div>
  </div>
</template>

<script>
  import { getData } from '../../utils/request'
  import store from '../author/store'

  export default {
    data () {
      return {
        current: 0,
        index: '',
        page: 1,
        data: []
      }
    },

    components: {},
    onLoad () {
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
      }
    }
  }
</script>

<style scoped>
  .main {
    float: left;
    display: flex;
    box-sizing: border-box;
    width: 7.5rem;
  }

  .content {
    float: left;
    margin-top: 10px;
    width: 7.5rem;
  }

  swiper {
    height: 11rem;
  }

  .item {
    position: relative;
    display: flex;
    width: 7.5rem;
    height: 11rem;
    flex-wrap: wrap;
  }

  .slide-image {
    overflow: hidden;
    margin: auto;
    width: 7rem;
    height: 10rem;
  }

  .item .describe {
    bottom: -1rem;
    opacity: 0;
  }

  .describe {
    position: absolute;
    left: 0;
    width: 7rem;
    background: -webkit-gradient(linear, left top, left bottom, from(transparent), to(#000));
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
    justify-content: center
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
    float: left
  }

  .current-item {
    z-index: 10;
    border-radius: 4px;
    -webkit-box-shadow: 0 5px 12px rgba(255, 255, 255, .5);
    -moz-box-shadow: 0 5px 20px rgba(255, 255, 255, .5);
    box-shadow: 0 5px 20px rgba(255, 255, 255, .5);
    transition: all .5s;
  }

  .current-item .describe {
    bottom: 0;
    border-radius: 0 0 4px 4px;
    opacity: 10;
    transition: all .5s;
  }

  .current-item image {
    width: 100%;
    height: 11rem;
    transition: all .5s;
  }


</style>
