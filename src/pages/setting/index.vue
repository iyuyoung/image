<template>
  <div class="main flex">
    <div class="content flex">
      <div class="item padding"
           @click="setting">
        <span>图片质量</span>
        <image src="../../static/image/icon-right.png"></image>
      </div>
    </div>
  </div>
</template>

<script>
import { _setStorage } from '../../utils'
export default {
  name: 'index',
  data () {
    return {
      height: 20
    }
  },
  components: { },
  onLoad () {
  },
  methods: {
    setting () {
      wx.showActionSheet({
        itemList: ['普通', '清晰', '超清'],
        success (res) {
          console.log(res.tapIndex)
          _setStorage('setting', res.tapIndex)
        },
        fail (res) {
          console.log(res.errMsg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  height: 100vh;
  background: #f2f2f2;
  flex-wrap: wrap;
  align-content: flex-start;
  .content {
    box-sizing: border-box;
    .item {
      width: 7.5rem;
      box-sizing: border-box;
      padding: 0.25rem;
      height: 1rem;
      margin-top: 5px;
      background: #ffffff;
      display: flex;
      span {
        margin: auto;
        width: 6.5rem;
        font-size: 14px;
      }
      image {
        width: 20px;
        height: 20px;
        margin: auto;
      }
    }
  }
  ad {
    position: fixed;
    left: 0px;
    bottom: 0px;
  }
}
</style>
