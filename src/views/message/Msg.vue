<template>
  <div class="container">
    <Sidebar />
    <div class="main">
      <!-- 未读消息 -->
      <div class="panel">
        <div class="head">
          未读消息
          <el-button class="pull-right" v-if="mesgs.hasnot_read_messages.length > 1" type="success" size="small" @click="markAll">标记全部已读</el-button>
        </div>
        <div class="body">
          <ul class="list" v-if="mesgs.hasnot_read_messages.length > 0">
            <li class="item" v-for="item in mesgs.hasnot_read_messages" :key="item.id">
              <router-link :to="{name: 'User', params: {loginname: item.author.loginname}}">{{item.author.loginname}}</router-link>
              回复了你的话题
              <router-link :to="{name: 'Topic', params: {id: item.topic.id}}" @click="markOne(item.id)">{{item.topic.title}}</router-link>
            </li>
          </ul>
          <div class="no-list" v-else>
            无消息
          </div>
        </div>
      </div>
      <!-- 已读消息 -->
      <div class="panel">
        <div class="head">已读消息</div>
        <div class="body">
          <ul class="list" v-if="mesgs.has_read_messages.length > 0">
            <li class="item" v-for="item in mesgs.has_read_messages" :key="item.id" :meg-id="item.id">
              <router-link :to="{name: 'User', params: {loginname: item.author.loginname}}">{{item.author.loginname}}</router-link>
              回复了你的话题
              <router-link :to="`/topic/${item.topic.id}#${item.reply.id}`">{{item.topic.title}}</router-link>
            </li>
          </ul>
          <div class="no-list" v-else>
            无消息
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from 'axios'
import API_CONFIG from '../../api/cnodejs.api'
import { mapState } from 'vuex'
export default {
  name: 'Messages',
  data () {
    return {
      mesgs: {
        has_read_messages: [],
        hasnot_read_messages: []
      }
    }
  },
  created () {
    this.featchUserMsg()
  },
  computed: {
    ...mapState(['accessToken'])
  },
  methods: {
    // 获取已读和未读消息
    // accesstoken String
    // mdrender String 当为 false 时，不渲染。默认为 true，渲染出现的所有 markdown 格式文本。
    featchUserMsg () {
      Axios.get(API_CONFIG.message, {
        params: {
          accesstoken: this.accessToken,
          mdrender: true
        }
      }).then(res => {
        if (res.data.success) {
          this.mesgs = res.data.data
        }
      })
    },
    // 标记全部已读
    markAll () {
      Axios.post(API_CONFIG.markAll, {
        accesstoken: this.accessToken
      }).then(res => {
        if (res.data.success) {
          this.$message.success('全部标记已读')
        }
      }).catch(e => e)
    },
    // 标记单个消息为已读
    markOne (msgid) {
      Axios.post(`${API_CONFIG.markOne}${msgid}`, {
        accesstoken: this.accessToken
      }).then(res => {
        if (res.data.success) {
          this.$message.success('此消息已读')
        }
      }).catch(e => e)
    }
  }
}
</script>

<style>

</style>
