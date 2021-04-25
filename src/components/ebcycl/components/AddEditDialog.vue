<template>
  <!-- 编辑商品的对话框 -->
  <el-dialog
    :title="`${data.id ? '修改' : '新增'}文章`"
    :visible.sync="show"
    @close="clear"
  >
    <el-form
      :model="editEbcyclForm"
      :rules="editEbcyclRules"
      ref="editEbcyclFormRef"
      label-width="100px"
    >
      <el-form-item label="文章图片" prop="titleImg">
        <image-upload
          :userPic="editEbcyclForm.titleImg"
          @img-str="getImgsStr"
          ref="imgUpload"
        />
      </el-form-item>

      <el-form-item label="文章标题" prop="title">
        <el-input
          type="textarea"
          autosize
          v-model="editEbcyclForm.title"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="data.id" label="发布者" prop="username">
        <el-input disabled v-model="editEbcyclForm.username"></el-input>
      </el-form-item>
      <el-form-item v-if="data.id" label="点击量" prop="clickNum">
        <el-input disabled v-model="editEbcyclForm.clickNum"></el-input>
      </el-form-item>
      <el-form-item v-if="data.id" label="发布时间" prop="createTime">
        <el-input disabled v-model="editEbcyclForm.createTime">
          <!-- {{ editEbcyclForm.createTime | dateFormat }} -->
        </el-input>
      </el-form-item>
      <el-form-item label="文章简介" prop="intro">
        <el-input
          type="textarea"
          autosize
          v-model="editEbcyclForm.intro"
        ></el-input>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <quill-editor
          class="quill-editor"
          v-model="editEbcyclForm.content"
          :options="editorOptions"
        ></quill-editor>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import ImageUpload from '@/components/ImageUpload/base64'
// import { parseTimeByString } from '@/filters'
import { addEbcycl, updateEbcycl } from '@/api/ebcycl'
import { getItem } from '@/utils/storage'
export default {
  name: '',
  components: { ImageUpload },
  props: {
    data: {
      default: () => {},
      type: Object
    }
  },
  data() {
    return {
      show: false,
      editEbcyclForm: {
        id: null,
        title: null,
        titleImg: null,
        username: null,
        clickNum: null,
        intro: null,
        createTime: null,
        content: null
      },
      editEbcyclRules: {
        titleImg: [{ required: true, message: '请添加图片', trigger: 'blur' }],
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        intro: [{ required: true, message: '请输入简介', trigger: 'blur' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      },
      editorOptions: {
        placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
            [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
            ['blockquote', 'code-block'], // 引用  代码块
            ['link'], // ["link", "image", "video"] // 链接、图片、视频
            // [{ align: [] }], // 对齐方式
            [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
            [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
            [{ header: [1, 2, 3, 4, 5, 6, false] }] // 标题
          ]
        }
      }
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    getImgsStr(imgsStr) {
      this.editEbcyclForm.titleImg = imgsStr
      console.log(this.editEbcyclForm)
    },
    clear() {
      // 关闭弹层清空表单
      this.editEbcyclForm = {}
      this.$refs.imgUpload.$refs.imgBroadcastUpload.clearFiles()
      // this.$emit('updateList')
    },
    open() {
      this.show = true
      if (this.data.id) {
        // this.editEbcyclForm = null
        // console.log(this.editEbcyclForm)
        this.editEbcyclForm = this.data
        // 将时间格式化
        // this.editEbcyclForm.createTime = parseTimeByString(
        //   this.editEbcyclForm.createTime
        // )
        console.log(this.editEbcyclForm.createTime)
      } else {
        this.editEbcyclForm = {}
      }
      // 清除校验效果
      this.$nextTick(() => {
        this.$refs.editEbcyclFormRef.clearValidate()
      })
    },
    async confirm() {
      this.$refs.editEbcyclFormRef.validate(async (valid) => {
        if (valid) {
          // 提交
          if (!this.data.id) {
            // 新增
            //获取当前用户数据
            const userInfo = getItem('userInfo')
            this.editEbcyclForm.username = userInfo.username
            console.log(this.editEbcyclForm)
            await addEbcycl(this.editEbcyclForm)
            console.log('新增')
          } else {
            // 修改
            this.editEbcyclForm.id = this.data.id
            this.$delete(this.editEbcyclForm, 'createTime')
            console.log(this.editEbcyclForm)
            await updateEbcycl(this.editEbcyclForm)
            console.log('修改')
          }
          this.$message.success('操作成功')
          this.show = false
          this.$emit('updateList')
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.quill-editor {
  line-height: normal;
  /deep/ .ql-editor {
    height: 300px !important;
  }
  // /deep/ .ql-container {
  //   overflow-y: auto;
  //   height: 300px !important;
  // }
}
</style>
