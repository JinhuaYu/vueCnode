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
  // scrollBehavior:
  // - only available in html5 history mode
  // - defaults to no scroll behavior
  // - return false to prevent scroll
  // scrollBehavior (to, from, savedPosition) {
  //   if (savedPosition) {
  //     // savedPosition is only available for popstate navigations.
  //     return savedPosition
  //   } else {
  //     const position = {}
  //     // new navigation.
  //     // scroll to anchor by returning the selector
  //     if (to.hash) {
  //       position.selector = to.hash
  //     }
  //     // check if any matched route config has meta that requires scrolling to top
  //     if (to.matched.some(m => m.meta.scrollToTop)) {
  //       // cords will be used if no selector is provided,
  //       // or if the selector didn't match any element.
  //       position.x = 0
  //       position.y = 0
  //     }
  //     // if the returned position is falsy or an empty object,
  //     // will retain current scroll position.
  //     return position
  //   }
  // }
})
