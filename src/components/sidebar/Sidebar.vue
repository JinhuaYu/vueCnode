<template>
  <aside class="sidebar hidden-sm-and-down">

    <div v-if="from == 'Topic'"> <!-- from是topic -->
      <div class="panel"><!-- user panel -->
        <div class="head">作者</div>
        <div class="userbox pd-15">
          <router-link class="userhead" :to="{name: 'User', params:{loginname:author.loginname}}">
            <img :src="author.avatar_url" alt="">
          </router-link>
          <span class="username">
            <router-link :to="{name: 'User', params:{loginname:author.loginname}}">
              {{author.loginname}}
            </router-link>
          </span>
          <p class="userword">“ 这家伙很懒，什么个性签名都没有留下。 ”</p>
        </div>
      </div><!-- user panel end -->
    </div>

    <div v-else> <!-- from是else -->

      <!-- 已登录，显示用户信息 -->
      <div v-if="isLogin">
        <!-- user panel -->
        <div class="panel">
          <div class="head">个人信息</div>
          <div class="body">
            <div class="userbox">
              <router-link class="userhead" :to="{name: 'User', params:{loginname:userInfo.loginname}}">
                <img :src="userInfo.avatar_url" alt="">
              </router-link>
              <span class="username">
                <router-link :to="{name: 'User', params:{loginname:userInfo.loginname}}">
                  {{userInfo.loginname}}
                </router-link>
              </span>
              <p class="userword">“ 这家伙很懒，什么个性签名都没有留下。 ”</p>
            </div>
          </div>
        </div>
        <!-- 发布话题 -->
        <div class="panel">
          <div class="body">
            <router-link to="/release/create">
              <el-button type="success">发布话题</el-button>
            </router-link>
          </div>
        </div>
      </div> <!-- 已登录 end -->
      <div v-else> <!-- 未登录 -->
        <div class="panel">
          <div class="head">CNode：Node.js专业中文社区</div>
          <div class="body">
            <span>当前是游客状态，您可以 </span>
            <el-button type="primary" size="small" @click="loginDialog(true)">登录</el-button>
          </div>
        </div>
      </div>
      <!-- user panel -->

    </div>
  </aside>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Sidebar',
  data () {
    return {

    }
  },
  props: {
    from: {
      type: String,
      default: ''
    },
    author: {
      type: Object,
      default () {
        return {
          loginname: '--',
          avatar_url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACAQMAAACnuvRZAAAAA1BMVEX29vYACyOqAAAACklEQVQI12MAAgAABAABINItbwAAAABJRU5ErkJggg=='
        }
      }
    }
  },
  computed: {
    ...mapState(['isLogin', 'userInfo'])
  },
  methods: {
    loginDialog (status) {
      this.$store.commit('loginDialog', status)
    }
  }
}
</script>
