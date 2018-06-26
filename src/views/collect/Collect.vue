<template>
  <div class="container">
    <Sidebar/>
    <div class="main">
      <div class="panel">
        <div class="head">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{this.$route.params.loginname}} 收藏的话题</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="body">
          <List :topics="topics" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from 'axios'
import API_CONFIG from '../../api/cnodejs.api'
export default {
  name: 'Collect',
  data () {
    return {
      topics: []
    }
  },
  created () {
    this.featchUserCollect()
  },
  methods: {
    featchUserCollect () {
      Axios.get(`${API_CONFIG.userCollection}${this.$route.params.loginname}`).then(res => {
        if (res.data.success) {
          this.topics = res.data.data
        }
      }).catch(e => {
        this.$message.error('没有此用户id')
      })
    }
  }
}
</script>

<style>
.el-breadcrumb::after, .el-breadcrumb::before {
    display: inline-block;
    content: "";
}
.el-form-item::after, .el-form-item::before {
  display: inline;
  content: "";
}
.el-form-item__content::after, .el-form-item__content::before {
  display: inline;
  content: "";
}
</style>
