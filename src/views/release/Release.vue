<template>
  <div class="container">
    <!-- sidebar -->
    <div class="sidebar hidden-sm-and-down">
      <div class="panel">
        <div class="head">Markdown 语法参考</div>
        <div class="body">
          <ul>
            <li><tt>### 单行的标题</tt></li>
            <li><tt>**粗体**</tt></li>
            <li><tt>`console.log('行内代码')`</tt></li>
            <li><tt>```js\n code \n```</tt> 标记代码块</li>
            <li><tt>[内容](链接)</tt></li>
            <li><tt>![文字说明](图片链接)</tt></li>
          </ul>
        </div>
      </div>

      <div class="panel">
        <div class="head">话题发布指南</div>
        <div class="body">
            <p>尽量把话题要点浓缩到标题里</p>
            <p>代码含义和报错可在 <a href="https://segmentfault.com/t/node.js" target="_blank">SegmentFault</a> 提问</p>
        </div>
      </div>

    </div>
    <!-- sidebar end -->

    <!-- main -->
    <div class="main">

      <div class="panel">
        <div class="head">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ isCreate ? '话题发布' : '话题更新' }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="body bg-fff pd-15">
          <!-- form -->
          <el-form ref="form" :model="form" :rules="rules">
            <el-form-item label="选择板块" prop="tab">
              <el-select v-model="form.tab">
                <el-option label="客户端测试" value="dev"></el-option>
                <el-option label="分享" value="share"></el-option>
                <el-option label="问答" value="ask"></el-option>
                <el-option label="招聘" value="job"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="title">
              <el-input v-model.trim="form.title" placeholder="标题字数 10字以上"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input type="textarea" id="markdown-editor"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveTopic()">{{ isCreate ? '提交' : '更新' }}</el-button>
            </el-form-item>
          </el-form>
          <!-- form end -->
        </div>
      </div>

    </div>
    <!-- main end -->
  </div>
</template>

<script>
import SimpleMDE from 'SimpleMDE'
import Axios from 'axios'
import API_CONFIG from '../../api/cnodejs.api'
import { mapState } from 'vuex'
export default {
  name: 'Release',
  data () {
    return {
      form: {
        tab: '', // 发布板块
        title: '' // 标题
      },
      rules: {
        tab: [
          {required: true, message: '请选择发布板块', trigger: 'change'}
        ],
        title: [
          {required: true, message: '请输入标题', trigger: 'blur'},
          {min: 10, message: '标题长度需在10字以上', trigger: 'blur'}
        ]
      },
      isCreate: true // 是否新建话题 默认:true
    }
  },
  computed: {
    ...mapState(['isLogin', 'accessToken'])
  },
  created () {
    if (this.$route.params.id === 'create') {
      this.isCreate = true // create
    } else {
      this.isCreate = false // update
      // 获取话题内容
      this.featchTopic()
    }
  },
  methods: {
    // 获取话题内容
    featchTopic () {
      Axios.get(`${API_CONFIG.topicDetail}${this.$route.params.id}`, {
        params: {
          mdrender: false
        }
      }).then(res => {
        this.form.title = res.data.data.title
        this.form.tab = res.data.data.tab
        this.simplemde.value(res.data.data.content)
      }).catch(e => {
        this.$message.error('没有此话题')
        this.$router.replace('/')
      })
    },

    // 初始化 editor
    initMarkdownEdit () {
      this.simplemde = new SimpleMDE({
        element: document.getElementById('markdown-editor'),
        autoDownloadFontAwesome: false, // 是否需要下载图标
        spellChecker: false //
      })
    },

    // 提交话题
    saveTopic () {
      try {
        if (!this.isLogin) throw new Error('请先登录')
        if (!this.simplemde.value()) throw new Error('内容不能为空')
      } catch (e) {
        return this.$message.warning(e.message)
      }
      this.$refs['form'].validate((valid) => {
        // 验证通过，提交表单
        Axios.post(this.isCreate ? API_CONFIG.cerateTopic : API_CONFIG.updateTopic, {
          accesstoken: this.accessToken,
          topic_id: this.isCreate ? undefined : this.$route.params.id,
          tab: this.form.tab,
          title: this.form.title,
          content: this.simplemde.value()
        }).then(res => {
          if (res.data.success) {
            this.$message.success(this.isCreate ? '话题发布成功' : '话题更新成功')
            this.$router.push({name: 'Topic', params: {id: res.data.topic_id}})
          }
        }).catch(e => e)
      })
    }
  },

  mounted () {
    this.initMarkdownEdit()
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
