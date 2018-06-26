const API_CONFIG = {
  // 以下api 路径均以 https://cnodejs.org/api/v1为前缀
  // **主题
  topics: 'https://cnodejs.org/api/v1/topics', // 文章列表 接收get参数
  topicDetail: 'https://cnodejs.org/api/v1/topic/', // 主题详情 接收get参数
  cerateTopic: 'https://cnodejs.org/api/v1/topics', // 新建主题
  updateTopic: 'https://cnodejs.org/api/v1/topics/update', // 编辑主题
  // **主题收藏
  topicCollect: 'https://cnodejs.org/api/v1/topic_collect/collect', // 收藏主题 post
  topicDeCollect: 'https://cnodejs.org/api/v1/topic_collect/de_collect', // 取消主题
  userCollection: 'https://cnodejs.org/api/v1/topic_collect/', // 用户所收藏的主题
  // **评论
  reply: 'https://cnodejs.org/api/v1/topic/', // 新建评论
  like: 'https://cnodejs.org/api/v1/reply/', // 为评论点赞
  // **用户
  getUser: 'https://cnodejs.org/api/v1/user/', // 用户详情 get
  login: 'https://cnodejs.org/api/v1/accesstoken', // 验证 accessToken 的正确性
  // **消息通知
  countNoReadMsg: 'https://cnodejs.org/api/v1/message/count', // 获取未读消息数
  message: 'https://cnodejs.org/api/v1/messages', // 获取已读和未读消息
  markAll: 'https://cnodejs.org/api/v1/message/mark_all', // 标记全部已读
  markOne: 'https://cnodejs.org/api/v1/message/mark_one/' // 标记单个消息为已读
}

export default API_CONFIG
