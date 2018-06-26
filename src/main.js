// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router' // 路由
import moment from 'moment' // 引用moment 时间格式
import ElementUI from 'element-ui' // element-ui
import 'element-ui/lib/theme-chalk/index.css' // element-ui css
import 'element-ui/lib/theme-chalk/display.css' // element-ui基于断点的隐藏类
import './assets/css/base.css' // reset css
import './assets/css/main.css' // main css
import 'simplemde/dist/simplemde.min.css'
import 'font-awesome/css/font-awesome.min.css'

import store from './store' // vuex store
import Sidebar from './components/sidebar/Sidebar' // side组件
import List from './components/topicList/TopicList' // topiclist组件

Vue.config.productionTip = false
Vue.use(ElementUI) // 全局使用 element-ui

Vue.component('Sidebar', Sidebar) // sidebar 组件
Vue.component('List', List) // 话题列表组件

moment.locale('zh_cn') // 设置moment为中文
Vue.filter('fromNow', date => { // 添加过滤器 - 时间格式
  return moment(date).fromNow() // 这是时间戳转时间
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
