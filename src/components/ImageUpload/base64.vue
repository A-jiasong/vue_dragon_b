<template>
  <div>
    <el-upload
      ref="imgBroadcastUpload"
      multiple
      :file-list="diaLogForm.imgBroadcastList"
      list-type="picture-card"
      accept="image/jpg,image/png,image/jpeg,image/gif"
      action=""
      :on-preview="preview"
      :on-change="imgBroadcastChange"
      :on-remove="imgBroadcastRemove"
      :http-request="submitDialogData"
      :limit="1"
      :on-exceed="masterFileMax"
    >
      <i class="el-icon-plus"></i>
      <div slot="tip" class="el-upload__tip">
        只能上传jpg/png/gif文件，且不超过2M
      </div>
    </el-upload>
    <el-dialog append-to-body title="图片预览" :visible.sync="showDialog">
      <img :src="imgUrl" style="width:100%" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { uploadImgToBase64 } from '@/utils' // 导入本地图片转base64的方法

export default {
  name: 'imgUpload',
  props: {
    userPic: {
      type: String
    }
  },
  data() {
    return {
      diaLogForm: {
        goodsName: '', // 商品名称字段
        imgBroadcastList: [], // 储存选中的图片列表
        imgsStr: '' // 后端需要的多张图base64字符串 , 分割
      },
      showDialog: false, // 控制显示弹层
      imgUrl: ''
    }
  },
  computed: {
    // 设定一个计算属性 判断是否已经上传完了一张
    // fileComputed() {
    //   return this.diaLogForm.imgBroadcastList.length === 1
    // }
  },
  created() {},
  mounted() {
    // 渲染完，父组件传过来的userPic为null时，清空数组
    if (this.userPic) {
      this.diaLogForm.imgBroadcastList.push({ url: this.userPic })
      // console.log(this.diaLogForm.imgBroadcastList)
    } else {
      this.diaLogForm.imgBroadcastList = []
    }
  },
  watch: {
    userPic: {
      handler(newvalue, oldvalue) {
        // console.log('旧数据' + oldvalue)
        // console.log('新数据' + newvalue)
        this.diaLogForm.imgBroadcastList = []
        // 判断新数据不为null的话，将新值传给数组
        if (newvalue) {
          this.diaLogForm.imgBroadcastList.push({ url: newvalue })
        }
        // this.diaLogForm.imgBroadcastList = []
        // console.log(this.diaLogForm.imgBroadcastList)
      }
    }
  },
  methods: {
    // // 获取到父组件传过来的图片字符串
    // getImgStr() {
    //   console.log(this.userPic)
    //   // this.diaLogForm.imgBroadcastList.push({ url: this.userPic })
    // },
    masterFileMax(files, fileList) {
      // console.log(files, fileList);
      this.$message.warning('最多上传1个文件哦！！！')
    },
    preview(file) {
      // 这里应该弹出一个层 层里是点击的图片地址
      this.imgUrl = file.url
      this.showDialog = true
    },
    // 图片选择后 保存在 diaLogForm.imgBroadcastList 对象中
    imgBroadcastChange(file, fileList) {
      const isLt2M = file.size / 1024 / 1024 < 2 // 上传头像图片大小不能超过 2MB
      if (!isLt2M) {
        // this.diaLogForm.imgBroadcastList = fileList.filter(
        //   (v) => v.uid !== file.uid
        // )
        this.$message.error(
          '图片选择失败，每张图片大小不能超过 2MB,请重新选择!'
        )
      } else {
        this.diaLogForm.imgBroadcastList = []
        this.diaLogForm.imgBroadcastList.push(file)
        // console.log(this.diaLogForm.imgBroadcastList)
        // this.$message.success('图片选择成功!')
      }
    },
    // 有图片移除后 触发
    imgBroadcastRemove(file, fileList) {
      this.diaLogForm.imgBroadcastList = fileList
      // console.log(this.diaLogForm.imgBroadcastList)
    },
    // 提交弹窗数据
    async submitDialogData(params) {
      // if (params.file) {
      //   console.log(params.file)
      // }
      const imgBroadcastListBase64 = []
      // console.log('图片转base64开始...')
      // 并发 转码轮播图片list => base64
      const filePromises = this.diaLogForm.imgBroadcastList.map(
        async (file) => {
          const response = await uploadImgToBase64(file.raw)
          // return response.result.replace(/.*;base64,/, '') // 去掉data:image/jpeg;base64,
          return response.result
        }
      )
      // 按次序输出 base64图片
      for (const textPromise of filePromises) {
        imgBroadcastListBase64.push(await textPromise)
      }
      // console.log('图片转base64结束..., ', imgBroadcastListBase64)
      this.diaLogForm.imgsStr = imgBroadcastListBase64.join()
      console.log(this.diaLogForm)
      // 子向父传值
      this.$emit('img-str', this.diaLogForm.imgsStr)
      // 不能直接在这里将图片上传，而是要将图片信息传给父组件，让父组件上传
      // 发请求提交表单
      // const res = await updateUser(this.diaLogForm)
      // console.log(res)
      // //判断如果添加失败，就做提示
      // if (res.status !== 200) return this.$message.error('修改信息失败')
      // //添加成功的提示
      // this.$message.success('修改信息成功')
      // //重新请求最新的数据
      // if (res.status) {
      //   this.$message.success('添加商品成功')
      //   // 一般提交成功后后端会处理，在需要展示商品地方会返回一个图片路径
      // }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none !important;
}
</style>
