<template>
  <!-- 编辑商品的对话框 -->
  <el-dialog
    :title="`${data.id ? '修改' : '新增'}商品`"
    :visible.sync="show"
    :destroy-on-close="true"
  >
    <el-form
      :model="editForm"
      :rules="editRules"
      ref="editFormRef"
      label-width="100px"
    >
      <el-form-item label="商品图片" prop="titleImg">
        <image-upload
          :userPic="editForm.titleImg"
          @img-str="getImgsStr"
          ref="imgUpload"
        />
      </el-form-item>
      <el-form-item label="商品标题" prop="title">
        <el-input type="textarea" autosize v-model="editForm.title"></el-input>
      </el-form-item>
      <el-form-item label="商品价格（元）" prop="price">
        <el-input v-model="editForm.price"></el-input>
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
        title: null,
        titleImg: null,
        username: null,
        clickNum: null,
        createTime: null,
        price: null
      },
      editRules: {
        titleImg: [
          { required: true, message: '请添加商品图片', trigger: 'blur' }
        ],
        title: [{ required: true, message: '请输入商品标题', trigger: 'blur' }],
        price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }]
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
            this.$emit('addData', this.editForm)
            // console.log(this.editForm)
            // await addShaolin(this.editForm)
            // console.log('新增')
          } else {
            // 修改
            this.editForm.id = this.data.id
            this.$delete(this.editForm, 'createTime')
            // console.log(this.editForm)
            this.$emit('changeData', this.editForm)
            // await updateShaolin(this.editForm)
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
