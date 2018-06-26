import Vue from 'vue'
import Vuex from 'vuex'
import { Message } from 'element-ui'
import Axios from 'axios'
import API_CONFIG from '../api/cnodejs.api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    loginDialogStatus: false, // 登陆框状态
    accessToken: window.localStorage.access_token || '',
    isLogin: false, // 登陆状态
    noReadMsg: 0, // 未读消息数
    userInfo: { // 用户信息
      loginname: '', // 用户名
      id: '', // id
      avatar_url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACAQMAAACnuvRZAAAAA1BMVEX29vYACyOqAAAACklEQVQI12MAAgAABAABINItbwAAAABJRU5ErkJggg=='
    }
  },
  mutations: {
    // 更新登陆框状态
    loginDialog (state, status) {
      state.loginDialogStatus = status
    },
    // 更新登陆状态
    updateLoginStatus (state, data) {
      if (data.accessToken) {
        window.localStorage.access_token = window.localStorage.save_access_token = state.accessToken = data.accessToken
        state.userInfo = data.userInfo
      } else {
        state.userInfo = data
      }
      state.isLogin = true
    },
    // 更新未读消息数
    updateMsgCount (state, count) {
      state.noReadMsg = count
    },
    // 退出登录
    logOut (state) {
      window.localStorage.removeItem('access_token')
      state.accessToken = ''
      state.isLogin = false
      Message.success('已退出')
    },
    // 更新收藏
    updateCollectCount () {

    }
  },
  actions: {
    // 登录
    login ({commit, dispatch}, data) {
      commit('updateLoginStatus', data)
      dispatch('featchNoReadMsgCount', data.accessToken)
    },
    // 检查是否已经登录
    checkLogin ({state, dispatch, commit}) {
      if (state.accessToken) {
        Axios.post(API_CONFIG.login, {
          accesstoken: state.accessToken
        }).then(res => {
          if (res.data.success) {
            commit('updateLoginStatus', res.data)
            dispatch('featchNoReadMsgCount', state.accessToken)
          }
        }).catch(e => e)
      }
    },
    // 获取未读消息数
    featchNoReadMsgCount ({commit}, accessToken) {
      Axios.get(API_CONFIG.countNoReadMsg + '?accesstoken=' + accessToken)
        .then(res => {
          if (res.data.success) {
            commit('updateMsgCount', res.data.data)
          }
        })
        .catch(e => e)
    }
  }
})

export default store
