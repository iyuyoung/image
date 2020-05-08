<template>
  <div class="main flex">
    <Top :title="title"></Top>
    <scroll-view scroll-y v-if="data">
      <div class="content">
        <div class="item" v-for="(val, key) in data" :key="key">
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
          <image
            :src="val.image"
            :data-index="key"
            lazy-load="true"
            @click="browser(val.image)"
            mode="aspectFill"
          ></image>
        </div>
      </div>
      <ad unit-id="adunit-ade4ac59067aeeb9"></ad>
    </scroll-view>
    <div class="no-data" v-else>
      <loading></loading>
    </div>
  </div>
</template>

<script>
import Top from '../../components/Top'
import { getData } from '../../utils/request'
import Loading from '../../components/Loading'

export default {
  name: 'index',
  data () {
    return {
      status: 0,
      data: [],
      time: 3,
      title: ''
    }
  },
  components: { Loading, Top },
  onLoad (option) {
    setInterval(() => {
      if (this.time) {
        this.time--
      }
    }, 2000)
    this.status = parseInt(option.id)
    if (this.status) {
      this.title = '我的收藏'
    } else {
      this.title = '我的足迹'
    }
    this._getData()
  },
  methods: {
    async _getData () {
      let res = await getData(`like/${this.status}`)
      if (res.error_code === 10000) {
        this.data = res.data
        console.log(this.data)
      }
    },
    browser (image) {
      wx.previewImage({
        urls: [image]
      })
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  scroll-view {
    width: 100%;
    height: 100vh;
    .content {
      width: 100%;
      box-sizing: border-box;
      .item {
        display: flex;
        width: 100%;
        margin-top: 12px;
        padding: 0px 0.25rem;
        box-sizing: border-box;
        flex-wrap: wrap;
        image {
          width: 100%;
          border-radius: 3px;
        }
        ad{
          width: 100%;
          margin-bottom: 0.25rem;
        }
      }
    }
  }

  .no-data {
    width: 100%;
    height: 100vh;
    display: flex;
    position: fixed;
    left: 0px;
  }
}
</style>
