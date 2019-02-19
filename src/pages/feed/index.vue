<template>
  <div class="main">
    <Top title="问题反馈" background="#00d8a0" color="#fff"></Top>
    <div class="feed flex">
      <div class="feed-top"></div>
      <div class="feed-text">
        <div class="title flex">
          <em>,,</em>
          <span v-text="length">/300</span>
        </div>
        <textarea placeholder="请留下你的问题" maxlength='300' placeholder-style="color:#dcdcdc"
                  @input="changeInput"></textarea>
        <div class="image flex">
          <div class="image-item" v-for="(val,index) in images" :key="index">
            <image :src="val" mode="aspectFill" @click="showImage(val)"></image>
            <i @click="delImage(index)">
              <image src="../../static/image/icon_close.png"></image>
            </i>
          </div>
        </div>
        <div class="add-image flex">
          <image src="../../static/image/icon_add_image.png" @click="selectImage"></image>
        </div>
      </div>
    </div>
    <footer class="flex">
      <span>提交</span>
    </footer>
  </div>
</template>

<script>
  import Top from '../../components/Top'
  export default {
    components: { Top },
    data () {
      return {
        length: 0,
        images: []
      }
    },

    created () {
    },
    methods: {
      changeInput (e) {
        this.length = e.target.value.length
      },
      // 选择图片
      selectImage () {
        wx.chooseImage({
          count: 9,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: (res) => {
            // tempFilePath可以作为img标签的src属性显示图片
            const tempFilePaths = res.tempFilePaths
            tempFilePaths.map((item) => {
              if (this.images.length < 9) {
                this.images.push(item)
              }
            })
          }
        })
      },
      // 查看图片
      showImage (val) {
        wx.previewImage({
          current: val,
          urls: this.images
        })
      },
      // 删除图片
      delImage (index) {
        this.images.splice(index, 1)
      }
    }
  }
</script>

<style>
  .main{width:100%;display:flex;min-height:89.5vh;background:#f4f4f4;padding-top:1.4rem;flex-wrap:wrap;align-content:flex-start}

  .header{height:0px !important;}

  header{box-shadow:none !important;}

  .feed{flex-wrap:wrap;position:relative}

  .feed-top{width:100%;height:1.5rem;background:#00d8a0;display:flex}

  .feed-text{width:6.8rem;background:#FFFFFF;position:absolute;left:0.35rem;top:0.75rem;box-shadow:-1px -2px 2px rgba(255, 255, 255, 0.35);border-radius:3px;}

  .title{height:0.85rem;line-height:0.85rem;box-sizing:border-box;padding:0px 0.25rem}

  .title em{color:#f4f4f4;font-size:30px;font-weight:500;transform:rotate(180deg);line-height:0.7rem;}

  .title span{font-size:10px;color:#ccc;margin-left:0.15rem;}

  .feed-text textarea{width:6.8rem;padding:0px 0.25rem;height:2.5rem;box-sizing:border-box;font-size:14px;}

  .image{box-sizing:border-box;padding:0.25rem;flex-wrap:wrap;justify-content:flex-start}

  .image-item image{width:1.97rem;height:1.35rem;border-radius:3px;}

  .image-item{position:relative;height:1.35rem;margin-bottom:10px;}

  .image-item:nth-child(3n+2){margin-left:10px;margin-right:10px;}

  .image-item i{width:0.35rem;height:0.35rem;background:rgba(0, 0, 0, .5);border-radius:100%;display:flex;position:absolute;right:4px;top:4px;}

  .image-item i image{width:0.25rem !important;height:0.25rem !important;margin:auto}

  .add-image{height:1rem;border-top:1px solid rgba(244, 244, 244, .5)}

  .add-image image{width:0.6rem;height:0.6rem;margin:auto}

  footer{position:fixed;left:0px;bottom:10px;}

  footer span{width:6.5rem;height:1rem;line-height:1rem;background:#00d8a0;font-size:15px;color:#FFFFFF;border-radius:3px;text-align:center;margin:auto}
</style>
