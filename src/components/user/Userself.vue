<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <!-- 个人信息 -->
          <el-form
            :model="editForm"
            :rules="editFormRules"
            ref="editFormRef"
            label-width="70px"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="editForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="editForm.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="phone">
              <el-input v-model="editForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="用户头像" prop="userPic">
              <image-upload :userPic="editForm.userPic" @img-str="getImgsStr" />
              <!-- 放置上传图片 -->
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="editUser"
                >确 定 修 改</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
// import ImageUpload from '@/components/ImageUpload'
import ImageUpload from '@/components/ImageUpload/base64'
import { findById, updateUser } from '@/api/user'
import { getItem } from '@/utils/storage'

export default {
  components: { ImageUpload },
  data() {
    //验证手机号码的规则
    var checkphone = (rule, value, cb) => {
      const regphone = /^1[34578]\d{9}$/
      if (regphone.test(value)) {
        return cb()
      }
      //返回一个错误提示
      cb(new Error('请输入合法的手机号码'))
    }

    return {
      //获取查询用户信息的参数
      editForm: {},
      editFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名称',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '用户名在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '用户名在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: 'blur'
          },
          {
            validator: checkphone,
            message: '手机号码不正确，请重新输入',
            trigger: 'blur'
          }
        ]
      }
      // 图片渲染
      // flag: false
    }
  },
  created() {
    this.getUserInfo()
  },
  computed: {},
  methods: {
    // 获取用户信息
    async getUserInfo() {
      //获取当前用户数据
      const userId = getItem('userInfo')
      const res = await findById(userId.id)

      //如果返回状态为异常状态则报错并返回
      if (res.status !== 200) return this.$message.error('获取用户列表失败')
      //如果返回状态正常，将请求的数据保存在data中
      // console.log(res.data)
      this.editForm = res.data
      // this.flag = true
    },
    getImgsStr(imgsStr) {
      this.editForm.userPic = imgsStr
      console.log(this.editForm)
    },
    editUser() {
      //点击确定按钮，修改信息
      //调用validate进行表单验证
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请填写完整用户信息')
        console.log(this.editForm)

        //发送请求完成添加用户的操作
        const res = await updateUser(this.editForm)
        console.log(res)
        //判断如果添加失败，就做提示
        if (res.status !== 200) return this.$message.error('修改信息失败')
        //添加成功的提示
        this.$message.success('修改信息成功')
        //重新请求最新的数据
        this.getUserInfo()
      })
    }
  }
}
</script>

<style></style>
