<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>地址管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.address"
            clearable
            @clear="getLogisticsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getLogisticsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="openDialog()">添加地址</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="logisticsList" stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="收件人" prop="username" width="150">
        </el-table-column>
        <el-table-column
          label="电话"
          prop="phone"
          width="150"
        ></el-table-column>
        <el-table-column label="地址" prop="address"></el-table-column>
        <el-table-column label="描述" prop="remark"></el-table-column>
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
              @click="removeLogistics(scope.row.id)"
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
    <add-edit-logistics
      ref="dialogRef"
      :data="editLogisticsForm"
      @updateList="updateList"
    />
  </div>
</template>

<script>
import AddEditLogistics from './components/AddEditLogistics'
import { getMallLogisticsList, deleteById } from '@/api/mallLogistics'
// import { parseTimeByString } from '@/filters'

export default {
  components: {
    AddEditLogistics
  },
  data() {
    return {
      // 查询参数
      queryInfo: {
        address: '',
        pageNo: 1,
        pageSize: 5
      },
      editLogisticsForm: {},
      logisticsList: [],
      total: null
    }
  },
  created() {
    this.getLogisticsList()
  },
  methods: {
    async getLogisticsList() {
      // 根据分页获取对应的商品列表
      const res = await getMallLogisticsList(this.queryInfo)
      if (res.status !== 200) {
        return this.$message.error('获取地址信息失败')
      }
      // console.log(res.data)
      this.$message.success('获取地址信息成功')
      this.logisticsList = res.data.list
      // this.logisticsList.map((item) => {
      //   // 将时间进行格式化
      //   item.createTime = parseTimeByString(item.createTime)
      // })
      console.log(this.logisticsList)
      this.total = res.data.count
    },
    handleSizeChange(newSize) {
      //当页号发生改变时，更改pagesize，重新请求
      this.queryInfo.pageSize = newSize
      this.getLogisticsList()
    },
    handleCurrentChange(newPage) {
      //当页码发生改变时，更改pagesize，重新请求
      this.queryInfo.pageNo = newPage
      this.getLogisticsList()
    },
    // 删除商品
    async removeLogistics(id) {
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
      this.getLogisticsList()
    },
    // 添加 编辑
    openDialog(logistics = {}) {
      this.editLogisticsForm = logistics
      this.$nextTick(() => {
        this.$refs.dialogRef.open()
      })
    },
    // 新增|修改 后更新列表
    updateList() {
      // if (!this.currArticle.id) {
      //   this.requestParams.page = 1
      // }
      this.getLogisticsList()
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
