<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>百科管理</el-breadcrumb-item>
      <el-breadcrumb-item>百科列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.title"
            clearable
            @clear="getEbcyclList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getEbcyclList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="openDialog()">添加百科</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="newsList" stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="文章图片" prop="titleImg" width="150">
          <template slot-scope="scope">
            <el-image :src="scope.row.titleImg" fit="fill"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="文章标题" prop="title"></el-table-column>
        <el-table-column
          label="发布者"
          prop="username"
          width="100"
        ></el-table-column>
        <el-table-column
          label="点击量"
          prop="clickNum"
          width="100"
        ></el-table-column>
        <el-table-column label="发布时间" prop="createTime">
          <!-- <template slot-scope="scope">
            {{ scope.row.createTime | dateFormat }}
          </template> -->
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="openDialog(scope.row)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeEbcycl(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNo"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <add-edit-dialog
      ref="dialogRef"
      :data="editEbcyclForm"
      @updateList="updateList"
    />
  </div>
</template>

<script>
import AddEditDialog from './components/AddEditDialog'
import { getEbcyclList, deleteById } from '@/api/ebcycl'
import { parseTimeByString } from '@/filters'

export default {
  components: {
    AddEditDialog
  },
  data() {
    return {
      // 查询参数
      queryInfo: {
        title: '',
        pageNo: 1,
        pageSize: 5
      },
      editEbcyclForm: {},
      newsList: [],
      total: null
    }
  },
  created() {
    this.getEbcyclList()
  },
  methods: {
    async getEbcyclList() {
      // 根据分页获取对应的商品列表
      const res = await getEbcyclList(this.queryInfo)
      if (res.status !== 200) {
        return this.$message.error('获取百科列表失败')
      }
      // console.log(res.data)
      this.$message.success('获取百科列表成功')
      this.newsList = res.data.list
      this.newsList.map((item) => {
        // 将时间进行格式化
        item.createTime = parseTimeByString(item.createTime)
      })
      // console.log(this.newsList)
      this.total = res.data.count
    },
    handleSizeChange(newSize) {
      //当页号发生改变时，更改pagesize，重新请求
      this.queryInfo.pageSize = newSize
      this.getEbcyclList()
    },
    handleCurrentChange(newPage) {
      //当页码发生改变时，更改pagesize，重新请求
      this.queryInfo.pageNo = newPage
      this.getEbcyclList()
    },
    // 删除商品
    async removeEbcycl(id) {
      //弹窗提示用户是否要删除
      const confirmResult = await this.$confirm(
        '请问是否确定要删除该项',
        '谨慎操作',
        {
          confirmButtonText: '确认删除',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      //如果用户点击确认，则confirmResult 为'confirm'
      //如果用户点击取消, 则confirmResult获取的就是catch的错误消息'cancel'
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      // 没有取消,就发送删除请求
      const res = await deleteById(id)
      if (res.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      // 为了在删除最后一页的最后一条数据时能成功跳转回最后一页的上一页
      const totalPage = Math.ceil((this.total - 1) / this.queryInfo.pageSize) // 总页数
      this.queryInfo.pageNo =
        this.queryInfo.pageNo > totalPage ? totalPage : this.queryInfo.pageNo
      this.queryInfo.pageNo =
        this.queryInfo.pageNo < 1 ? 1 : this.queryInfo.pageNo
      console.log(this.queryInfo.pageNo)
      // const tr = document.querySelectorAll('tr')
      // if (tr.length === 2 && this.pageNo !== 1) {
      //   this.pageNo--
      // }
      this.getEbcyclList()
    },
    // 添加 编辑
    openDialog(ebcycl = {}) {
      this.editEbcyclForm = ebcycl
      this.$nextTick(() => {
        this.$refs.dialogRef.open()
      })
    },
    // 新增|修改 后更新列表
    updateList() {
      // if (!this.currArticle.id) {
      //   this.requestParams.page = 1
      // }
      this.getEbcyclList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-image {
  width: 110px;
  height: 80px;
}
</style>
