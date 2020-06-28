### mpvue-Unsplash

> 基于mpvue开发的一款查看Unsplash图片的小程序

### 演示

> 图片

![项目示例]()

### 使用方法
1.git clone https://github.com/iyuyoung/image.git
2.npm i
3.执行 npm start
4.开发者工具导入/dist/wx/


### 相关依赖

* flyio - 同时支持浏览器、小程序、Node、Weex 及快应用的基于 Promise 的跨平台请求库
* 小程序原生swiper

### 相关API

* 首页数据 https://unsplash.mphot.cn/index?page=${page} page 默认1 第一页
* 精选数据 https://unsplash.mphot.cn/index?page=${page}&order_by=popular page 默认1 第一页
* 随机图片 https://unsplash.mphot.cn/random
* 搜索接口 https://unsplash.mphot.cn/search?title={title}&page=${page}
* 获取作者详情页面 https://unsplash.mphot.cn/author?username=${username}&page=${page}


### 相关文章

https://mp.weixin.qq.com/s/1f6BA8W2aCr9qWZ6Kgz_jQ


### 小程序二维码

![小程序二维码](https://user-images.githubusercontent.com/8666861/54965038-c97d2500-4fa9-11e9-9ba3-883843c53f5e.jpg)

### todolist

- [x] 添加作者详情页
- [x] 添加登录、个人收藏页面
- [x] 下载图片

