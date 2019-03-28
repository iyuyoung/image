import Vue from 'vue'
import App from './App'
import '../src/utils/base.css'
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

wx.getSystemInfo({
  success: (res) => {
    Vue.prototype.TOP = res.statusBarHeight
  }
})
