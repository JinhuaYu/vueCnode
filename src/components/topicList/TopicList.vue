<template>
  <div class="topic-list">
    <div v-for="item in topics" :key="item.id" class="topic-item">

      <router-link class="user-avatar" :to="{name: 'User', params: { loginname:item.author.loginname }}">
        <img :src="item.author.avatar_url" :title="item.author.loginname"/>
      </router-link>

      <span v-if="item.reply_count || item.visit_count" class="reply-count">
        <span class="c-reply" title="回复">{{item.reply_count}}</span>
        <span>/</span>
        <span class="c-visit" title="浏览">{{item.visit_count}}</span>
      </span>

      <span v-if="item.tab" class="tag" :class="tag(item).className">{{ tag(item).text }}</span>

      <router-link class="title" :to="{ name: 'Topic', params: {id: item.id}}">{{item.title}}</router-link>

      <time class="c-time pull-right">{{ item.last_reply_at | fromNow }}</time>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    topics: {
      type: Array,
      required: true
    }
  },
  methods: {
    // 获取显示标签
    tag (item) {
      if (item.top) {
        return {
          text: '置顶',
          className: 'light'
        }
      }
      if (item.good) {
        return {
          text: '精华',
          className: 'light'
        }
      }
      switch (item.tab) {
        case 'share':
          return {
            text: '分享',
            className: item.tab
          }
        case 'ask':
          return {
            text: '问答',
            className: item.tab
          }
        case 'job':
          return {
            text: '招聘',
            className: item.tab
          }
        case 'dev':
          return {
            text: '测试',
            className: item.tab
          }
        default:
          return {
            text: '',
            className: 'default'
          }
      }
    }
  }
}
</script>

<style>

</style>
