// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import 'babel-polyfill'//如果浏览器不支持promise，使之支持 对es6api进行转义 写在最开始

import Vue from 'vue'
import App from './App'
import router from './router'

import 'common/stylus/index.styl'//引入common中所有的styl ,页面初始化

import fastClick from 'fastclick'//解决移动端点击300毫秒延迟

import  VueLazyLoad from 'vue-lazyload';//引入懒加载相关插件
Vue.use(VueLazyLoad,{
  loading:require('common/image/default.png')
})//使用

import store from './store/index.js';//vuex
import VueAwesomeSwiper from 'vue-awesome-swiper'//引入轮播图插件
import 'swiper/dist/css/swiper.css'//引入轮播图有关的css文件
Vue.use(VueAwesomeSwiper)//使用轮播图插件


//import 'babel-runtime'//对es6的语法进行转义 不用写在源码中
Vue.config.productionTip = false
fastClick.attach(document.body);//使用fastClick


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
