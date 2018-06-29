<template>
  <div class="container">

    <sidebar :author="detail.author" from="Topic" /><!-- sidebar -->

    <!-- main -->
    <div class="main">
      <!-- 文章内容 -->
      <div class="panel">
        <div class="article">
          <div class="article-head">
            <span class="tag light" v-if="detail.good || detail.top">{{ detail | tag }}</span>
            <span class="full-title h1">{{detail.title}}</span>
            <div class="props">
              <span>发布于 {{ detail.create_at | fromNow }}</span>
              <span>作者 <router-link :to="{name: 'User', params: { loginname : detail.author.loginname }}">{{ detail.author.loginname }}</router-link></span>
              <span>{{ detail.visit_count }} 次浏览</span>
              <span>最后一次编辑是 {{ detail.last_reply_at | fromNow }}</span>
              <span>来自 {{ detail.tab | comeFrom }}</span>
            </div>
            <!-- 作者操作 编辑/删除 -->
            <div class="user-control-bar" v-if="userInfo.loginname == detail.author.loginname">
              <router-link :to="{name: 'Release', params: { topic_id: detail.id }}" title="编辑" >
                <i class="el-icon-edit"></i>
              </router-link>
            </div>
            <!-- 收藏 -->
            <div class="collect" v-if="isLogin">
              <el-button :type="detail.is_collect ? '' : 'success' " @click="collectTopic()">{{ detail.is_collect ? '取消收藏' : '收藏' }}</el-button>
            </div>
          </div>
          <div class="acticle-body markdown-body" v-html="detail.content"></div>
        </div>
      </div>
      <!-- 文章内容 end -->

      <!-- 评论 -->
      <div class="panel" v-if="detail.reply_count > 0">
        <div class="head">
          <span>{{detail.reply_count}} 回复</span>
        </div>
        <div class="reply-list">
          <div class="reply-item" v-for="(item, index) in detail.replies" :key="item.id" :id="item.id">

            <div class="reply-item-head">
              <span class="user-info">
                <span class="avatar-img">
                  <router-link :to="{ name: 'User', params: {loginname: item.author.loginname}}">
                    <img v-lazy="item.author.avatar_url" />
                  </router-link>
                </span>
                <span><router-link :to="{ name: 'User', params: {loginname: item.author.loginname}}">{{item.author.loginname}}</router-link></span>
                <span class="c-aaa">{{ index + 1 }}楼</span>
                <span class="c-aaa">{{item.create_at | fromNow }}</span>
                <span class="tag light" v-if="detail.author.loginname == item.author.loginname">作者</span>
              </span>

              <span class="user-action">
                <span class="like" :class="[item.is_uped ? 'static' : '']">
                  <i class="fa"
                    :class="[item.is_uped ? 'fa-heart' : 'fa-heart-o']"
                    title="喜欢"
                    @click="like(item.id, item.author, index)">
                  </i>
                  <span class="like-count c-aaa" v-if="item.ups.length > 0">
                    {{item.ups.length}}
                  </span>
                </span>
                <span class="reply" v-if="isLogin">
                  <i class="fa fa-reply" title="回复" @click="replyOther(item.author.loginname)"></i>
                </span>
              </span>
            </div>

            <div class="reply-item-body">
              <div class="markdown-body" v-html="item.content"></div>
            </div>
          </div>
        </div>
      </div><!-- 评论 end -->

      <!-- 新建评论 -->
      <!-- 注意： 这里不要直接使用 v-if="isLogin" 会导致 simpleMDE加载出错 (SimpleMDE: Error. No element was found.)
       推荐使用  :class="{ hidden: !isLogin }" -->
      <div class="panel reply-area" :class="{ hidden: !isLogin }">
        <div class="head">添加回复</div>
        <div class="body bg-fff reply-from">
          <el-form>
            <el-form-item>
              <el-input type="textarea" id="markdownEditor"></el-input>
            </el-form-item>
            <div style="padding:0 0 15px 15px;">
              <el-button type="primary" @click="reply">{{replyBtnTxt}}</el-button>
            </div>
          </el-form>
        </div>
      </div>

    </div><!-- main end -->
  </div>
</template>

<script>
import API_CONFIG from '../../api/cnodejs.api' // coodejs社区api
import Axios from 'axios'
import hljs from 'highlight.js'
import 'highlight.js/styles/default.css'
import { mapState } from 'vuex'
import SimpleMDE from 'simplemde'

export default {
  name: 'Topic',
  data () {
    return {
      detail: {
        id: '',
        author_id: '',
        author: {
          loginname: '--',
          avatar_url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACAQMAAACnuvRZAAAAA1BMVEX29vYACyOqAAAACklEQVQI12MAAgAABAABINItbwAAAABJRU5ErkJggg=='
        },
        title: '',
        content: '',
        create_at: Date.now(),
        last_reply_at: Date.now(),
        tab: '',
        good: false,
        top: false,
        reply_count: 0,
        visit_count: 0,
        replies: [],
        is_collect: false
      },
      replyBtnTxt: '提交'
    }
  },
  beforeRouteEnter (to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.featchTopicDetail()
    })
  },
  computed: {
    ...mapState(['isLogin', 'accessToken', 'userInfo'])
  },
  methods: {
    // 初始化编辑器
    initEditor () {
      this.simplemde = new SimpleMDE({
        element: document.getElementById('markdownEditor'),
        autoDownloadFontAwesome: true,
        spellChecker: false,
        status: false
      })
    },

    // 获取详情
    featchTopicDetail () {
      Axios.get(`${API_CONFIG.topicDetail}${this.$route.params.id}`, {
        params: {
          accesstoken: this.accessToken || undefined
        }
      }).then(res => {
        if (res.data.success) {
          this.detail = res.data.data
          this.$nextTick(() => { // 在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。
            var code = document.querySelectorAll('.markdown-body code')
            for (var i = 0; i < code.length; i++) {
              hljs.highlightBlock(code[i])
            }
          })
        }
      }).catch(e => {
        this.$message.error('没有此话题')
        this.$router.replace('/')
      })
    },

    // 主题收藏
    collectTopic () {
      Axios.post(this.detail.is_collect ? API_CONFIG.topicDeCollect : API_CONFIG.topicCollect, {
        accesstoken: this.accessToken,
        topic_id: this.detail.id
      }).then(res => {
        if (res.data.success) {
          if (this.detail.is_collect) {
            // 如果是操作取消
            this.detail.is_collect = false // 修改收藏状态为 false
          } else {
            // 操作收藏
            this.detail.is_collect = true // 修改收藏状态为 true
          }
        }
      }).catch(e => {
        this.$message.error('不是有效的话题id')
      })
    },

    // 取消收藏
    collectDeTopic () {
      Axios.post(API_CONFIG.topicDeCollect, {
        accesstoken: this.accessToken,
        topic_id: this.detail.id
      }).then(res => {
        if (res.data.success) {
          // this.$message.success('已取消收藏')
          this.detail.is_collect = false
        }
      }).catch(e => {
        this.$message.error('不是有效的话题id')
      })
    },

    /**
     * methods: 新建评论
      post /topic/:topic_id/replies 新建评论
      接收 post 参数
      accesstoken String 用户的 accessToken
      content String 评论的主体
      reply_id String 如果这个评论是对另一个评论的回复，请务必带上此字段。这样前端就可以构建出评论线索图。
      返回值示例
      {success: true, reply_id: '5433d5e4e737cbe96dcef312'}
    */
    reply () {
      if (this.replyBtnTxt === '发送中...') return // 避免重复提交
      var val = this.simplemde.value()
      if (!val) { // 内容为空
        return this.$message.error('回复内容不能为空')
      }
      this.replyBtnTxt = '发送中...'
      Axios.post(`${API_CONFIG.reply}${this.detail.id}/replies`, {
        accesstoken: this.accessToken,
        content: val
      }).then(res => {
        if (res.data.success) {
          this.replyBtnTxt = '提交'
          this.$message.success('回复成功')
          this.featchTopicDetail() // 重新加载topic数据
          this.simplemde.value('') // 清空textarea
        }
      }).catch(e => {
        this.replyBtnTxt = '提交'
      })
    },

    /**
     * methods: 点赞
     * post /reply/:reply_id/ups 为评论点赞
     * 接受 post 参数
     * accesstoken String
     * 接口会自动判断用户是否已点赞，如果否，则点赞；如果是，则取消点赞。点赞的动作反应在返回数据的 action 字段中，up or down。
     * 返回值示例
     * {"success": true, "action": "down"}
     * @param {replyId}
     * @param {author}
     * @param {index}
     */
    like (replyId, author, index) {
      if (!this.isLogin) {
        return this.$message.warning('请先登录')
      }
      if (author.loginname === this.userInfo.loginname) {
        return this.$message.warning('不能给自己点赞')
      }
      Axios.post(`${API_CONFIG.like}${replyId}/ups`, {
        accesstoken: this.accessToken
      }).then(res => {
        if (res.data.success) {
          if (res.data.action === 'up') {
            // 返回up 点赞成功 向数组末尾添加元素
            this.detail.replies[index].ups.push(this.userInfo.id) // 向数组末尾添加元素，返回的是添加后新数组的长度，原有数组改变
            this.detail.replies[index].is_uped = true // 已点赞
          } else {
            // 返回down 取消点赞 删除数组的最后一项
            this.detail.replies[index].ups.pop()
            this.detail.replies[index].is_uped = false // 取消点赞
          }
        }
      }).catch(e => {
        this.$message.warning('响应超时')
      })
    },
    // 不是真正的回复某人，只能在回复前面加上@某人
    replyOther (loginname) {
      var top = document.querySelector('.reply-from').offsetTop
      window.scrollTo(0, top)
      this.simplemde.value(`@${loginname} `)
    }

  },
  // 过滤器
  filters: {
    // 是否置顶/精华
    tag: function (detail) {
      if (detail.top) {
        return '置顶'
      }
      if (detail.good) {
        return '精华'
      }
    },
    // 标签tab
    comeFrom: function (tab) {
      switch (tab) {
        case 'ask':
          return '问答'
        case 'good':
          return '精华'
        case 'share':
          return '分享'
        case 'dev':
          return '测试'
        case 'job':
          return '招聘'
        default:
          return 'cnode'
      }
    }
  },

  mounted () {
    this.initEditor()
  }

}
</script>

<style>
.editor-toolbar{
  border: 0;
  border-bottom: 1px solid #e0e0e0;
}
.CodeMirror{
  border: 0;
}
.CodeMirror,.CodeMirror-scroll{
  min-height: 160px;
}
.el-textarea__inner{
  border: none;
}
</style>
