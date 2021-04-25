<template>
  <!-- 编辑商品的对话框 -->
  <el-dialog
    :title="`${data.id ? '修改' : '新增'}地址`"
    :visible.sync="show"
    @close="clear"
  >
    <el-form
      :model="editLogisticsForm"
      :rules="editLogisticsRules"
      ref="editLogisticsFormRef"
      label-width="100px"
    >
      <el-form-item label="收件人" prop="username">
        <el-input
          type="textarea"
          autosize
          v-model="editLogisticsForm.username"
        ></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="editLogisticsForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input
          type="textarea"
          autosize
          v-model="editLogisticsForm.address"
        ></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input
          type="textarea"
          autosize
          v-model="editLogisticsForm.remark"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addMallLogistics, updateMallLogistics } from '@/api/mallLogistics'
import { getItem } from '@/utils/storage'
export default {
  name: '',
  components: {},
  props: {
    data: {
      default: () => {},
      type: Object
    }
  },
  data() {
    return {
      show: false,
      editLogisticsForm: {
        id: null,
        userId: null,
        username: null,
        phone: null,
        address: null,
        remark: null
      },
      editLogisticsRules: {
        username: [{ required: true, message: '请添加图片', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          {
            pattern: /^1[3578]\d{9}$/,
            message: '手机号格式错误',
            trigger: 'blur'
          }
        ],
        address: [{ required: true, message: '请输入简介', trigger: 'blur' }]
      }
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    clear() {
      // 关闭弹层清空表单
      this.editLogisticsForm = {}
    },
    open() {
      this.show = true
      if (this.data.id) {
        // this.editLogisticsForm = null
        // console.log(this.editLogisticsForm)
        this.editLogisticsForm = this.data
      } else {
        this.editLogisticsForm = {}
      }
      // 清除校验效果
      this.$nextTick(() => {
        this.$refs.editLogisticsFormRef.clearValidate()
      })
    },
    async confirm() {
      this.$refs.editLogisticsFormRef.validate(async (valid) => {
        if (valid) {
          // 提交
          if (!this.data.id) {
            // 新增
            //获取当前用户数据
            const userInfo = getItem('userInfo')
            this.editLogisticsForm.userId = userInfo.id
            // this.editLogisticsForm.username = userInfo.username
            console.log(this.editLogisticsForm)
            await addMallLogistics(this.editLogisticsForm)
            console.log('新增')
          } else {
            // 修改
            this.editLogisticsForm.id = this.data.id
            console.log(this.editLogisticsForm)
            await updateMallLogistics(this.editLogisticsForm)
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
}
</style>
