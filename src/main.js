// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router' // 路由
import store from './store' // vuex store

// 第三方库
import moment from 'moment' // moment.js 时间格式
import VueLazyload from 'vue-lazyload'
import ElementUI from 'element-ui' // element-ui
import 'element-ui/lib/theme-chalk/index.css' // element-ui css
import 'element-ui/lib/theme-chalk/display.css' // element-ui基于断点的隐藏类
import 'simplemde/dist/simplemde.min.css' // markdown-editor simpleMDE
import 'font-awesome/css/font-awesome.min.css' // fontawesome

// css
import './assets/css/base.css' // reset css
import './assets/css/main.css' // main css

// 自定义组件
import Sidebar from './components/sidebar/Sidebar' // side组件
import List from './components/topicList/TopicList' // topiclist组件

Vue.config.productionTip = false
Vue.use(ElementUI) // 全局使用 element-ui
Vue.use(VueLazyload, {
  preLoad: 1.3, // proportion of pre-loading height
  error: 'http://placehold.it/30x30', // 当加载图片失败的时候
  loading: 'http://placehold.it/30x30', // 当加载图片成功的时候
  attempt: 1 // 尝试计数
})

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
