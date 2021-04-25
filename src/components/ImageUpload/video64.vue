<template>
  <div>
    <el-upload
      :on-change="imgBroadcastChange"
      :http-request="handleVodUploadSuccess"
      :on-remove="handleVodRemove"
      :before-remove="beforeVodRemove"
      :on-exceed="handleUploadExceed"
      :on-preview="preview"
      list-type="picture-card"
      :file-list="fileList"
      accept="video/mp4"
      action=""
      multiple
      :limit="1"
      ref="videoBroadcastUpload"
    >
      <i class="el-icon-plus"></i>
      <div slot="tip" class="el-upload__tip">
        仅支持MP4视频格式上传，且不超过200M
      </div>
    </el-upload>
    <el-dialog
      append-to-body
      title="视频预览"
      :visible.sync="showDialog"
      :destroy-on-close="true"
    >
      <video :src="videoUrl" style="width:100%" alt="" controls />
    </el-dialog>
  </div>
</template>

<script>
import { uploadImgToBase64 } from '@/utils' // 导入本地图片转base64的方法

export default {
  name: '',
  components: {},
  props: {
    videoUrl: {
      type: String
    }
  },
  data() {
    return {
      fileList: [], //上传文件列表
      showDialog: false // 控制显示弹层
    }
  },
  computed: {},
  watch: {
    videoUrl: {
      handler(newvalue, oldvalue) {
        // console.log('旧数据' + oldvalue)
        // console.log('新数据' + newvalue)
        this.fileList = []
        // 判断新数据不为null的话，将新值传给数组
        if (newvalue) {
          this.fileList.push({ url: newvalue })
        }
        // this.fileList = []
        // console.log(this.fileList)
      }
    }
  },
  created() {},
  mounted() {
    // 渲染完，父组件传过来的videoUrl为null时，清空数组
    if (this.videoUrl) {
      this.fileList.push({ url: this.videoUrl })
      // console.log(this.fileList)
    } else {
      this.fileList = []
    }
  },
  methods: {
    preview(file) {
      // 这里应该弹出一个层 层里是点击的图片地址
      this.videoUrl = file.url
      console.log(this.videoUrl)

      this.showDialog = true
      // this.playerOptions.poster = this.data.title_img
    },
    //修改回掉
    imgBroadcastChange(file, fileList) {
      const isLt2M = file.size / 1024 / 1024 < 200 // 上传头像图片大小不能超过 2MB
      if (!isLt2M) {
        // this.fileList = fileList.filter(
        //   (v) => v.uid !== file.uid
        // )
        this.$message.error(
          '视频选择失败，每张图片大小不能超过 200MB,请重新选择!'
        )
      } else {
        this.fileList = []
        this.fileList.push(file)
        // console.log(this.fileList)
        // this.$message.success('图片选择成功!')
      }
    },
    //视图上传多于一个视频
    handleUploadExceed(files, fileList) {
      this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },

    beforeVodRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleVodRemove(file, fileList) {
      console.log(file)

      this.fileList = fileList
      this.$message({
        type: 'success',
        message: '移除成功'
      })
    },
    //上传视频转为based4格式
    async handleVodUploadSuccess(e) {
      const videoBroadcastListBase64 = []
      // console.log('图片转base64开始...')
      // 并发 转码轮播图片list => base64
      const filePromises = this.fileList.map(async (file) => {
        const response = await uploadImgToBase64(file.raw)
        return response.result
      })
      // 按次序输出 base64图片
      for (const textPromise of filePromises) {
        videoBroadcastListBase64.push(await textPromise)
      }
      // console.log('视频转base64结束..., ', videoBroadcastListBase64)
      // this.fileList.imgsStr = videoBroadcastListBase64.join()
      // console.log(this.fileList)
      // 子向父传值
      this.$emit('video-str', videoBroadcastListBase64.join())
    }
  }
}
</script>

<style scoped lang="less"></style>
