<template>
    <div class="layer"  v-if="status">
      <div class="layer-bg"></div>
      <div class="login fadeInUp">
        <div class="login-icon" @click="close()">
          <image src="../../static/image/icon_close.png"></image>
        </div>
        <div class="login-header">
          <image src="../../static/image/unsplash_logo.png"></image>
        </div>
        <div class="login-center">
          <span>登陆后获得更多权益</span>
        </div>
        <div class="login-footer">
          <button plain="true" lang="en" @click="login" open-type="getUserInfo">登陆</button>
        </div>
      </div>
    </div>
</template>

<script>
  import {getData} from '../utils/request'
  import {_setStorage} from '../utils'

export default {
    name: 'Login',
    props: {
      'status': {'type': Boolean, 'default': false}
    },
    methods: {
      async _getLogin (encryptedData, iv, code) {
        let data = await getData('login', {'encryptedData': encryptedData, 'iv': iv, 'code': code}, 'POST')
        if (data.error_code === 10000) {
          this.status = false
          _setStorage('token', data.token)
          wx.showToast({
            title: '登陆成功',
            icon: 'none',
            duration: 2000
          })
        }
      },
      _getUserInfo (code) {
        wx.getUserInfo({
          withCredentials: true,
          lang: 'en',
          success: (res) => {
            this._getLogin(res.encryptedData, res.iv, code)
          }
        })
      },
      _getCode () {
        wx.login({
          success: (res) => {
            if (res.code) {
              this._getUserInfo(res.code)
            }
          }
        })
      },
      close () {
        this.$emit('close_login')
      },
      login () {
        this._getCode()
      }
    }
  }
</script>

<style lang="less" scoped>
.login{
  width:100%;
  height:60vh;
  position:fixed;
  left:0px;
  bottom:0px;
  display:flex;
  flex-wrap:wrap;
  align-content:flex-start;
  background:#FFFFFF;
  box-sizing:border-box;
  padding:2rem 20px;
  .login-icon{
    position:absolute;
    width:1rem;
    height:1rem;
    right:10px;
    top:10px;
    display:flex;
    image{width:0.35rem;height:0.35rem;margin:auto}
    }
  .login-header{
    width:100%;
    display:flex;
    image{width:180px;height:49px;margin:auto}
    }
  .login-center{
    width:100%;
    font-size:15px;
    text-align:center;
    line-height:50px;
    }
  .login-footer{
    width:100%;
    display:flex;
    button{
      width:5rem;
      height:1rem;
      line-height:1rem;
      background:#30e3ca;
      color:#FFFFFF;
      font-size:15px;
      border-radius:3px;
      border:none;
      }
    }
  }
</style>
