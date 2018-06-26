<template>
  <div id="app">
    <Header/>
    <Login/>
    <keep-alive exclude="User, Topic, Messages">
      <router-view />
    </keep-alive>
    <Footer/>
    <div class="backTop" @click="backTop">
      <i class="el-icon-arrow-up"></i>
    </div>
    <div class="loading-bar" :class="{active: start, end: end, error: faild}">
      <div class="loading-bar-fast"></div>
    </div>
  </div>
</template>

<script>
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import Login from './views/login/Login'
import Axios from 'axios'
import { Message } from 'element-ui'

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    Login
  },
  data () {
    return {
      start: false,
      end: false,
      faild: false
    }
  },
  // 在实例创建完成后被立即调用
  created () {
    this.axiosConfig()
    this.$store.dispatch('checkLogin')
  },
  methods: {
    loadingStart () {
      this.start = true
    },
    loadingEnd () {
      this.end = true
      setTimeout(() => {
        this.end = this.start = false
      }, 700)
    },
    loadingFaild () {
      this.faild = true
      setTimeout(() => {
        this.faild = this.start = false
      }, 700)
    },
    axiosConfig () {
      // http请求拦截器
      Axios.interceptors.request.use(config => {
        // 在发送请求之前做些什么
        this.loadingStart()
        return config
      }, e => {
        // 对请求错误做些什么
        this.loadingFaild()
        Message.error('API请求失败')
        return Promise.reject(e)
      })
      // http响应拦截器
      Axios.interceptors.response.use(res => {
        // 对响应数据做些什么
        this.loadingEnd()
        return res
      }, error => {
        // 对响应错误做些什么
        // Message.error('请求超时或服务器出错')
        this.loadingFaild()
        if (error.response) {
          switch (error.response.status) {
            case 401:
              // 返回401，
              Message.error('401')
          }
        }
        return Promise.reject(error)
      })
    },
    // 返回顶部
    backTop () {
      window.scroll(0, 0)
    }
  }
}
</script>

<style>
</style>
