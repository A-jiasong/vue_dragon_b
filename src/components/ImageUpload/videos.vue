<template>
  <div>
    <el-form-item label="上传视频">
      <el-upload
        :on-success="handleVodUploadSuccess"
        :on-remove="handleVodRemove"
        :before-remove="beforeVodRemove"
        :on-exceed="handleUploadExceed"
        :file-list="fileList"
        accept="video/*"
        :action="BASE_API + '/admin/vod/video/upload'"
        :limit="1"
        class="upload-demo"
      >
        <el-button size="small" type="primary">上传视频</el-button>
        <el-tooltip placement="right-end">
          <div slot="content">
            仅支持MP4视频格式上传
          </div>
          <i class="el-icon-question" />
        </el-tooltip>
      </el-upload>
    </el-form-item>
  </div>
</template>

<script>
import vod from '@/api/edu/vod'
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      fileList: [], //上传文件列表
      BASE_API: process.env.BASE_API, // 接口API地址
      video: {}, // 课时对象
      title: '',
      sort: 0,
      free: false,
      videoSourceId: '',
      videoOriginalName: ''
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    //成功回调
    handleVodUploadSuccess(response, file, fileList) {
      this.video.videoSourceId = response.data.videoId
      this.video.videoOriginalName = file.name
    },
    //修改回掉
    editVideo(videoId) {
      this.dialogVideoFormVisible = true
      video.getVideoInfoById(videoId).then((response) => {
        this.video = response.data.item
        this.fileList = [{ name: this.video.videoOriginalName }]
      })
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
      vod.removeById(this.video.videoSourceId).then((response) => {
        this.$message({
          type: 'success',
          message: response.message
        })
      })
    },
    handleVodRemove(file, fileList) {
      console.log(file)
      vod.removeById(this.video.videoSourceId).then((response) => {
        this.video.videoSourceId = ''
        this.video.videoOriginalName = ''
        this.fileList = []
        this.$message({
          type: 'success',
          message: response.message
        })
      })
    }
  }
}
</script>

<style scoped lang="less"></style>
