<template>
  <div class="main">
    <div class="header">
      <image src="../../static/image/unsplash_logo.png"></image>
    </div>
    <header>
      <div class="header-bg">
        <image src="../../static/image/home-bg.png"></image>
      </div>
      <div class="header-main padding">
        <div class="header-item flex" @click="open('personal',0)">
          <div class="avatar">
            <image src="http://thirdwx.qlogo.cn/mmopen/YacFoKmJGSLw7KNkc70ibgY4bkYTFRBicxXnVuXeZ8JNdiaWu9AtibtYRfPsvjFN0H3qRVID2HuHia0x8kol0ujuqOnTD0q8BTZkh/132"></image>
          </div>
          <div class="userInfo">
            <span class="nickname">于杨</span>
            <span class="nickname">男</span>
          </div>
        </div>
        <div class="server flex padding">
          <div class="server-item" @click="open('list')">
            <span>20</span>
            <span>足迹</span>
          </div>
          <div class="server-item" @click="open('list')">
            <span>20</span>
            <span>收藏</span>
          </div>
        </div>
      </div>
    </header>
    <div class="content flex">
      <div class="item flex" @click="open('setting',0)">
        <image src="../../static/image/icon-setting.png"></image>
        <span>设置</span>
        <image src="../../static/image/icon-right.png"></image>
      </div>
      <div class="item flex">
        <button plain="true" open-type="contact"></button>
        <image src="../../static/image/icon-kefu.png"></image>
        <span>联系客服</span>
        <image src="../../static/image/icon-right.png"></image>
      </div>
      <div class="item flex" @click="open('feed',0)">
        <image src="../../static/image/icon-feed.png"></image>
        <span>问题反馈</span>
        <image src="../../static/image/icon-right.png"></image>
      </div>
    </div>
  </div>
</template>

<script>
  import {_NavigateTo} from '../../utils/index'
  export default {
    components: {},

    data () {
      return {
        logs: []
      }
    },
    methods: {
      open (path) {
        _NavigateTo(path)
      }
    },
    created () {
    }
  }
</script>

<style lang="less" scoped>
  .main{width:100%;min-height:100vh;
    background:rgba(244, 244, 244, 0.5);
  .header{width:100%;background:#00d8a0;position:fixed;box-shadow:1px 1px 5px rgba(0, 0, 0, .05);left:0px;top:0px;display:flex;box-sizing:border-box;z-index:9999;height:70px;padding-top:20px;
        image{
          width:100px;
          height:25px;
          margin-top:15px;
          margin-left:10px;
          }
    }
    header{width:100%;display:flex;flex-wrap:wrap;position:relative;
      .header-bg{
        width:100%;height:4rem;display:flex;background:#00d8a0;
        image{width:100%;height:4rem;}
        }
      .header-main{width:6.8rem;height:2.85rem;display:flex;background:#FFFFFF;box-shadow:1px 2px 5px rgba(0, 0, 0, .15);position:absolute;left:0.35rem;top:2rem;border-radius:3px;box-sizing:border-box;flex-wrap:wrap;
        .avatar{width:1.5rem;height:1.2rem;display:flex;
          image{width:1.2rem;height:1.2rem;margin:auto;border-radius:100%;box-shadow:0px 1px 5px rgba(0, 0, 0, 0.1)}
          }
        .userInfo{width:4rem;display:flex;flex-wrap:wrap;align-content:center;padding-left:5px;
          span{width:100%;display:flex;font-size:16px;box-sizing:border-box}
          &:last-child{font-size:14px;color:#ccc;}
          }
        .server{flex-wrap:wrap;justify-content:space-between;position:relative;padding-top:0.5rem;
          &:before{content:"";position:absolute;top:0.25rem;left:0rem;width:6rem;height:1px;background:rgba(244, 244, 244, .5)}
          .server-item{font-size:14px;display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-start;position:relative;width:50%;
            span{width:100%;display:flex;
              justify-content:center;
              &:first-child{font-size:16px;color:#333;}
              &:last-child{font-size:12px;color:#ccc}
              }
            &:before{content:"";position:absolute;right:0%;top:10px;background:rgba(244, 244, 244, 1);height:15px;width:1px;}
            &:last-child:before{display:none}
            }
          &:first-child{
            &:before{display:none}
            }
          }
        }
      }
    .content{flex-wrap:wrap;margin-top:75px;width:7.5rem;padding:0px 0.35rem;box-sizing:border-box;
      .item{font-size:14px;color:#999;background:#FFFFFF;height:1rem;padding:0.25rem;box-sizing:border-box;position:relative;line-height:0.5rem;
        span{width:5.5rem;padding-left:0.25rem;}
        button{border:none;position:absolute;left:0px;bottom:0px;width:100%;height:1rem;}
        &:before{content:"";position:absolute;left:0rem;bottom:0px;background:rgba(244, 244, 244, 0.7);width:6.8rem;height:1px;}
        &:first-child{border-radius:3px 3px 0px 0px;}
        &:last-child{border-radius:0px 0px 3px 3px;}
        image{width:0.4rem;height:0.4rem;margin-top:2px;
          :last-child{width:15px;height:15px;position:absolute;right:0.25rem;top:0.35rem;}
          }
        }
      }
    }


</style>
