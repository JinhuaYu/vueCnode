<template>
  <header class="navbar">
    <div class="container">
      <router-link to="/" class="brand">
        <img src="http://o4j806krb.qnssl.com/public/images/cnodejs_light.svg" alt="">
      </router-link>
      <ul class="nav pull-right" v-if="isLogin">
        <li>
          <el-badge :value="noReadMsg > 0 ? noReadMsg : ''" :max="99" class="item">
            <router-link to="/message">消息</router-link>
          </el-badge>
        </li>
        <li>
          <router-link :to="{name: 'User', params: {loginname: userInfo.loginname}}">
            {{userInfo.loginname}}
          </router-link>
        </li>
        <li>
          <el-button type="primary" size="small" @click="logOut()">退出</el-button>
        </li>
      </ul>
      <ul class="pull-right" v-else>
        <li>
          <el-button type="success" size="small" @click="loginDialog(true)">登录</el-button>
        </li>
      </ul>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Header',
  data () {
    return {

    }
  },
  computed: {
    ...mapState(['isLogin', 'userInfo', 'noReadMsg'])
  },
  methods: {
    // 显示登录
    loginDialog (status) {
      this.$store.commit('loginDialog', status)
    },
    logOut () {
      this.$store.commit('logOut')
    }
  }
}
</script>

<style>

</style>
