<template>
  <!-- 编辑商品的对话框 -->
  <el-dialog
    :title="`${data.replyId === null ? '新增回复' : '修改回复'}`"
    :visible.sync="show"
    :destroy-on-close="true"
  >
    <el-form
      :model="editForm"
      :rules="editRules"
      ref="editFormRef"
      label-width="100px"
    >
      <el-form-item label="内容" prop="content">
        <quill-editor
          v-model="editForm.content"
          :options="editorOptions"
        ></quill-editor>
      </el-form-item>
      <el-form-item v-if="data.replyId" label="发布者" prop="username">
        <el-input disabled v-model="editForm.username"></el-input>
      </el-form-item>
      <el-form-item v-if="data.replyId" label="点赞" prop="like">
        <el-input disabled v-model="editForm.laud"></el-input>
      </el-form-item>
      <el-form-item v-if="data.replyId" label="发布时间" prop="create_time">
        <el-input disabled v-model="editForm.createTime"></el-input>
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
      editForm: {
        id: null,
        replyId: null,
        username: null,
        userPic: null,
        createTime: null,
        content: null,
        laud: null
      },
      editRules: {
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      },
      editorOptions: {
        placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['blockquote'],
            ['code-block', 'image', 'link']
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
    // getImgsStr(imgsStr) {
    //   this.editForm.titleImg = imgsStr
    //   console.log(this.editForm)
    // },
    // clear() {
    //   // 关闭弹层清空表单
    //   this.editForm = {}
    //   this.$refs.imgUpload.$refs.imgBroadcastUpload.clearFiles()
    // },
    open() {
      this.show = true
      console.log(this.data)
      if (this.data.replyId) {
        // 如果有replyId就是要进行编辑的操作
        // this.editForm = null
        this.editForm = this.data
        console.log(this.editForm)
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
          if (!this.data.replyId) {
            // 如果没有replyId就是进行新增的操作
            // 新增
            //获取当前用户数据
            const userInfo = getItem('userInfo')
            this.editForm.userPic = userInfo.userPic
            this.editForm.username = userInfo.username
            this.editForm.replyId = this.data.id
            // this.editForm.title = this.data.title
            console.log(this.editForm)
            this.$emit('addData', this.editForm)
          } else {
            // 修改
            this.editForm.id = this.data.id
            this.$delete(this.editForm, 'createTime')
            console.log(this.editForm)
            this.$emit('changeData', this.editForm)
          }
          this.show = false
        }
      })
    }
  }
}
</script>

<style scoped lang="less"></style>
