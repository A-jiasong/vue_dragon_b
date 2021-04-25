<template>
  <!-- 编辑商品的对话框 -->
  <el-dialog
    :title="`${data.id ? '修改' : '新增'}秘籍`"
    :visible.sync="show"
    @close="clear"
  >
    <el-form
      :model="editForm"
      :rules="editEbcyclRules"
      ref="editFormRef"
      label-width="100px"
    >
      <el-form-item label="文章图片" prop="titleImg">
        <image-upload
          :userPic="editForm.titleImg"
          @img-str="getImgsStr"
          ref="imgUpload"
        />
      </el-form-item>
      <el-form-item label="视频" prop="videoUrl">
        <videos-upload
          :videoUrl="editForm.videoUrl"
          @video-str="getVideoStr"
          ref="videoUpload"
        />
      </el-form-item>
      <el-form-item label="文章标题" prop="title">
        <el-input type="textarea" autosize v-model="editForm.title"></el-input>
      </el-form-item>
      <el-form-item v-if="data.id" label="发布者" prop="username">
        <el-input disabled v-model="editForm.username"></el-input>
      </el-form-item>
      <el-form-item v-if="data.id" label="点击量" prop="clickNum">
        <el-input disabled v-model="editForm.clickNum"></el-input>
      </el-form-item>
      <el-form-item v-if="data.id" label="发布时间" prop="createTime">
        <el-input disabled v-model="editForm.createTime"> </el-input>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <quill-editor
          class="quill-editor"
          v-model="editForm.content"
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
import VideosUpload from '@/components/ImageUpload/video64'
// import { addEsoterShaolin, updateEsoterShaolin } from '@/api/esoterShaolin'
import { getItem } from '@/utils/storage'
export default {
  name: '',
  components: { ImageUpload, VideosUpload },
  props: {
    data: {
      default: () => {},
      type: Object
    }
  },
  data() {
    return {
      show: false,
      editForm: {
        id: null,
        title: null,
        titleImg: null,
        username: null,
        clickNum: null,
        createTime: null,
        content: null,
        videoUrl: null
      },
      editEbcyclRules: {
        titleImg: [{ required: true, message: '请添加图片', trigger: 'blur' }],
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        videoUrl: [{ required: true, message: '请添加视频', trigger: 'blur' }],
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
      this.editForm.titleImg = imgsStr
      console.log(this.editForm)
    },
    getVideoStr(videoStr) {
      this.editForm.videoUrl = videoStr
      console.log(this.editForm)
    },
    clear() {
      // 关闭弹层清空表单
      this.editForm = {}
      this.$refs.imgUpload.$refs.imgBroadcastUpload.clearFiles()
      this.$refs.videoUpload.$refs.videoBroadcastUpload.clearFiles()
      // this.$emit('updateList')
    },
    open() {
      this.show = true
      if (this.data.id) {
        // console.log(this.editForm)
        this.editForm = this.data
        console.log(this.editForm.createTime)
      } else {
        this.editForm = {}
      }
      // 清除校验效果
      this.$nextTick(() => {
        this.$refs.editFormRef.clearValidate()
      })
    },
    async confirm() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (valid) {
          // 提交
          // 将数据接收后，提交给父组件，让父组件来进行增加和修改
          if (!this.data.id) {
            // 新增
            //获取当前用户数据
            const userInfo = getItem('userInfo')
            this.editForm.username = userInfo.username
            this.$emit('addEsoter', this.editForm)
            // console.log(this.editForm)
            // await addEsoterShaolin(this.editForm)
            // console.log('新增')
          } else {
            // 修改
            this.editForm.id = this.data.id
            this.$delete(this.editForm, 'createTime')
            // console.log(this.editForm)
            this.$emit('changeEsoter', this.editForm)
            // await updateEsoterShaolin(this.editForm)
            // console.log('修改')
          }
          // this.$message.success('操作成功')
          this.show = false
          // this.$emit('updateList')
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
}
</style>
