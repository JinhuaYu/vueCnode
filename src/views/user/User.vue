<template>
  <div class="container">
    <!-- sider start -->
    <Sidebar/>
    <!-- sider end -->
    <!-- main -->
    <div class="main">
      <div class="panel">
        <div class="head">
          <router-link to="/">主页</router-link>
        </div>
        <div class="body bg-fff">
          <div class="userPanel">
            <div class="userHead">
              <img v-lazy="user.avatar_url">
            </div>
            <div class="userDetail">
              <h3>{{ user.loginname }}</h3>
              <p>
                <svg class="githubicon" height="18" width="18" viewBox="0 0 16 16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>
                <a :href="githubname" target="_blank">@{{ user.githubUsername }}</a> </p>
              <p>{{ user.score }} 积分</p>
              <p v-if="userCollect > 0">
                <router-link :to="{name: 'Collect', params: {loginname: user.loginname}}">{{userCollect}} 个话题收藏</router-link>
              </p>
              <p>{{ user.create_at | fromNow }}注册</p>
            </div>
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="head">最近创建的话题</div>
        <List :topics="user.recent_topics" />
      </div>

      <div class="panel">
        <div class="head">最近参与的话题</div>
        <List :topics="user.recent_replies" />
      </div>

    </div><!-- main end -->
  </div>
</template>

<script>
import Axios from 'axios'
import API_CONFIG from '../../api/cnodejs.api'
export default {
  name: 'User',
  data () {
    return {
      user: {
        loginname: '--', // 用户名
        avatar_url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACAQMAAACnuvRZAAAAA1BMVEX29vYACyOqAAAACklEQVQI12MAAgAABAABINItbwAAAABJRU5ErkJggg==',
        githubUsername: '--', // githubUsername
        create_at: Date.now(), // 注册时间
        score: 0, // 积分
        recent_topics: [], // 近期话题
        recent_replies: [] // 近期评论
      },
      githubname: '',
      userCollect: 0 // 用户收藏
    }
  },
  created () {
    this.featchUserinfo()
    this.featchUserCollect()
  },
  methods: {
    // 获取用户内容
    featchUserinfo () {
      Axios.get(`${API_CONFIG.getUser}${this.$route.params.loginname}`)
        .then(res => {
          if (res.data.success) {
            this.user = res.data.data
            this.githubname = 'https://github.com/' + res.data.data.githubUsername
          }
        }).catch(e => {
          this.$message.error('没有此用户')
          this.$router.replace('/') // 返回首页
        })
    },

    // 获取用户主题收藏
    featchUserCollect () {
      Axios.get(`${API_CONFIG.userCollection}${this.$route.params.loginname}`).then(res => {
        if (res.data.success) {
          this.userCollect = res.data.data.length
        }
      }).catch(e => e)
    }
  },
  watch: {
    $route (to, from) {
      if (to.name !== 'User') return
      this.featchUserinfo()
    }
  }
}
</script>
