import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    // 首页/文章列表
    {
      name: 'HomePage',
      path: '/',
      component: () => import('../views/index/Index')
    },
    // 文章详情页
    {
      name: 'Topic',
      path: '/topic/:id',
      component: () => import('../views/topic/Topic')
    },
    // 编辑文章
    {
      name: 'Release',
      path: '/release/:id',
      component: () => import('../views/release/Release')
    },
    // 用户详情页
    {
      name: 'User',
      path: '/user/:loginname',
      component: () => import('../views/user/User')
    },
    // 用户主题收藏
    {
      name: 'Collect',
      path: '/collect/:loginname',
      component: () => import('../views/collect/Collect')
    },
    // 消息
    {
      name: 'Message',
      path: '/message',
      component: () => import('../views/message/Msg')
    }
  ]
})
