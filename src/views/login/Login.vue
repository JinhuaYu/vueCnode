<template>
  <el-dialog
    title="登 录"
    :visible="loginDialogStatus"
    width="40%"
    @close="loginDialog(false)">
    <el-form
      :model="loginForm"
      :rules="rules"
      status-icon
      ref="loginForm">
      <el-form-item prop="accessToken" :error="errorMsg">
        <el-input v-model.trim="loginForm.accessToken" placeholder="access token" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <a href="https://cnodejs.org/setting" target="_blank">如何获取Access Token？</a>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="login()">登 录</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import Axios from 'axios'
import API_CONFIG from '../../api/cnodejs.api'
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        accessToken: window.localStorage.save_access_token || ''
      },
      rules: {
        accessToken: [
          { required: true, message: '请输入AccessToken', trigger: 'blur' }
        ]
      },
      errorMsg: ''
    }
  },
  computed: {
    ...mapState(['loginDialogStatus'])
  },
  methods: {
    // 登陆框
    loginDialog (status) {
      this.$store.commit('loginDialog', status)
    },
    // 登录
    login () {
      this.$refs['loginForm'].validate((valid) => { //  表单验证
        if (valid) {
          Axios.post(API_CONFIG.login, {
            accesstoken: this.loginForm.accessToken
          }).then(res => {
            // 如果成功匹配上用户，返回成功信息。否则 401
            // {success: true, loginname: req.user.loginname, id: req.user.id, avatar_url: req.user.avatar_url}
            if (res.data.success) {
              this.$store.dispatch('login', {
                accessToken: this.loginForm.accessToken,
                userInfo: res.data
              }).then(() => {
                this.loginDialog(false) // 关闭登录框
                this.$message.success('登录成功')
              })
            }
          }).catch(error => {
            this.errorMsg = '错误的accessToken'
            console.log(error)
          })
        }
      })
    }
  }
}
</script>
