<template>
  <div class="main flex">
    <Top :title="title"></Top>
    <scroll-view  scroll-y v-if="!time">
      <div class="content">
        <div class="item" v-for="(val,key) in data">
          <image :src="val.url" :data-index='key' lazy-load="true" mode="aspectFill"></image>
        </div>
    </div>
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
        data: {},
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
        let data = await getData(`like/${this.status}`)
        if (data.error_code === 10000) {
          this.data = data.data.data
          console.log(this.data)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .main{
    .content{
      width:100%;
      box-sizing:border-box;
      padding-top:1rem;
      column-count:2;
      column-gap:2px;
      .item{
          display:flex;
          width:100%;
          margin-bottom:2px;
          }
      }
    .no-data{width:100%;height:100vh;display:flex;position:fixed;left:0px;}
    }
</style>
