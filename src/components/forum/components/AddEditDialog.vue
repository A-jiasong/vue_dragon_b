<template>
  <!-- 编辑商品的对话框 -->
  <el-dialog
    :title="`${data.id ? '修改' : '新增'}`"
    :visible.sync="show"
    :destroy-on-close="true"
  >
    <el-form
      :model="editForm"
      :rules="editRules"
      ref="editFormRef"
      label-width="100px"
    >
      <el-form-item label="图片" prop="titleImg">
        <image-upload
          :userPic="editForm.titleImg"
          @img-str="getImgsStr"
          ref="imgUpload"
        />
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input type="textarea" autosize v-model="editForm.title"></el-input>
      </el-form-item>

      <el-form-item label="内容" prop="content">
        <quill-editor
          v-model="editForm.content"
          :options="editorOptions"
        ></quill-editor>
      </el-form-item>
      <el-form-item v-if="data.id" label="发布者" prop="username">
        <el-input disabled v-model="editForm.username"></el-input>
      </el-form-item>
      <el-form-item v-if="data.id" label="点赞" prop="laud">
        <el-input disabled v-model="editForm.laud"></el-input>
      </el-form-item>
      <el-form-item v-if="data.id" label="发布时间" prop="create_time">
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
        username: null,
        userPic: null,
        createTime: null,
        titleImg: null,
        title: null,
        content: null,
        laud: null
      },
      editRules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        titleImg: [{ required: true, message: '请添加图片', trigger: 'blur' }]
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
    getImgsStr(imgsStr) {
      this.editForm.titleImg = imgsStr
      console.log(this.editForm)
    },
    // clear() {
    //   // 关闭弹层清空表单
    //   this.editForm = {}
    //   this.$refs.imgUpload.$refs.imgBroadcastUpload.clearFiles()
    // },
    open() {
      this.show = true
      if (this.data.id) {
        // this.editForm = null
        // console.log(this.editForm)
        this.editForm = this.data
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
          if (!this.data.id) {
            // 新增
            //获取当前用户数据
            const userInfo = getItem('userInfo')
            this.editForm.userPic = userInfo.userPic
            this.editForm.username = userInfo.username
            console.log(this.editForm)
            this.$emit('addData', this.editForm)
          } else {
            // 修改
            this.editForm.id = this.data.id
            this.$delete(this.editForm, 'createTime')
            // console.log(this.editForm)
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
