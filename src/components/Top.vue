<template>
  <div class="header flex">
    <header :style="{'background':background,'color':color,'padding-top':bar+'px'}">
      <image src="../../static/image/left.png"
             v-if="color!=='#fff'"
             @click="back"></image>
      <image src="../../static/image/left.png"
             v-else
             @click="back"></image>
      <span v-text="title"></span>
    </header>
  </div>
</template>

<script>
export default {
  name: 'Top',
  data () {
    return { bar: 0 }
  },
  props: {
    'title': { 'type': String, 'default': '发布' },
    'background': { 'type': String, 'default': '#fff' },
    'color': { 'type': String, 'default': '#333' }
  },
  onLoad () {
    wx.getSystemInfo({
      success: res => {
        this.bar = res.statusBarHeight
      }
    })
  },
  methods: {
    back () {
      wx.navigateBack({
        delta: 1
      })
    }
  }
}
</script>

<style scoped>
.header{
  width: 100%;
  height: 0.88rem;
}
header {
  width: 100%;
  height: 0.88rem;
  line-height: 0.88rem;
  display: flex;
  position: fixed;
  top: 0px;
  left: 0px;
  font-size: 18px;
  box-sizing: none;
  padding-top: 25px;
  background: #ffffff;
  z-index: 99999999;
  justify-content: flex-start;
}

header span {
  width: 6rem;
  text-align: center;
}

header image {
  width: 23px;
  height: 23px;
  margin: auto 10px;
}
</style>
