<template>
  <div class="header flex">
    <header :style="{'background':background,'color':color}">
      <image src="../../static/image/left.png" v-if="color!=='#fff'" @click="back"></image>
      <image src="../../static/image/left.png" v-else @click="back"></image>
      <span v-text="title"></span>
    </header>
  </div>
</template>

<script>
  export default {
    name: 'Top',
    props: {
      'title': {'type': String, 'default': '发布'},
      'background': {'type': String, 'default': '#fff'},
      'color': {'type': String, 'default': '#333'}
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
  .header{height:1.4rem;}
  header{width:100%;height:1.4rem;line-height:0.9rem;display:flex;position:fixed;top:0px;left:0px;font-size:18px;box-sizing:border-box;padding-top:25px;background:#FFFFFF;z-index:99999999;justify-content:flex-start}

  header span{width:6rem;text-align:center}

  header image{width:23px;height:23px;margin-left:0.25rem;margin-top:10px}
</style>
