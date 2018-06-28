<template>
  <div class="container">
    <!-- sider start -->
    <Sidebar/>
    <!-- sider end -->
    <!-- main start -->
    <div class="main">
      <div class="panel">
        <div class="head">
          <div class="tab">
            <router-link to="/" :class="{active: $route.query.tab == 'all' || !$route.query.tab}">全部</router-link>
            <router-link to="/?tab=good" :class="{active: $route.query.tab == 'good'}">精华</router-link>
            <router-link to="/?tab=share" :class="{active: $route.query.tab == 'share'}">分享</router-link>
            <router-link to="/?tab=ask" :class="{active: $route.query.tab == 'ask'}">问答</router-link>
            <router-link to="/?tab=job" :class="{active: $route.query.tab == 'job'}">招聘</router-link>
            <router-link to="/?tab=dev" :class="{active: $route.query.tab == 'dev'}">客户端测试</router-link>
          </div>
        </div>

        <List v-loading="loading" :topics="topics"/>

        <div class="paging">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="limit"
            :current-page.sync="page"
            @current-change="currentPage"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- main end -->
  </div>
</template>
<script>
import API_CONFIG from '../../api/cnodejs.api' // coodejs社区api
import Axios from 'axios' // axios
export default {
  name: 'HomePage',
  data () {
    return {
      page: 1, // 当前页
      limit: 20, // 每一页的主题数量
      total: 1000, // 总条数
      topics: [],
      loading: true
    }
  },
  created () {
    this.page = parseInt(this.$route.query.page) || 1 // 页面挂载时，获取url的page，如果没有则为1
    this.getTopics() // 获取数据
  },
  methods: {
    currentPage (page) {
      this.$router.push({
        name: this.$route.name,
        query: {
          tab: this.$route.query.tab,
          page
        }
      })
    },
    // 获取主题列表
    getTopics () {
      this.loading = true
      Axios.get(API_CONFIG.topics, {
        params: {
          page: this.page,
          tab: this.$route.query.tab || 'all',
          limit: this.limit,
          mdrender: false
        }
      }).then(res => {
        this.loading = false
        if (res.data.success) {
          this.topics = res.data.data
          // console.log(res.data)
        }
      }).catch(e => {
        this.loading = false
      })
    }
  },
  watch: {
    $route (to, from) {
      if (to.name !== 'HomePage') return
      if (to.query.page === 1 || !to.query.page) this.page = 1
      this.getTopics()
    }
  }
}
</script>

<style>
</style>
