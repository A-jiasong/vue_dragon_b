<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>门派管理</el-breadcrumb-item>
      <el-breadcrumb-item>少林派</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.title"
            clearable
            @clear="getEsoterList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getEsoterList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="openDialog()"
            >添加少林功法</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="esotericaList" stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="功法图片" prop="titleImg" width="150">
          <template slot-scope="scope">
            <el-image :src="scope.row.titleImg" fit="fill"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="功法标题" prop="title"></el-table-column>
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
        <el-table-column label="发布时间" prop="createTime"> </el-table-column>
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
              @click="removeEsoterShaolin(scope.row.id)"
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
      :data="editEsoterShaolinForm"
      @addEsoter="addEsoter"
      @changeEsoter="changeEsoter"
    />
  </div>
</template>

<script>
import AddEditDialog from './components/AddEditDialog'
import {
  getEsoterShaolinList,
  deleteById,
  addEsoterShaolin,
  updateEsoterShaolin
} from '@/api/esoterShaolin'
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
      editEsoterShaolinForm: {},
      esotericaList: [],
      total: null
    }
  },
  created() {
    this.getEsoterList()
  },
  methods: {
    async getEsoterList() {
      // 根据分页获取对应的商品列表
      const res = await getEsoterShaolinList(this.queryInfo)
      if (res.status !== 200) {
        return this.$message.error('获取少林秘籍列表失败')
      }
      console.log(res.data)
      this.$message.success('获取少林秘籍列表成功')
      this.esotericaList = res.data.list
      this.esotericaList.map((item) => {
        // 将时间进行格式化
        item.createTime = parseTimeByString(item.createTime)
      })
      // console.log(this.esotericaList)
      this.total = res.data.count
    },
    handleSizeChange(newSize) {
      //当页号发生改变时，更改pagesize，重新请求
      this.queryInfo.pageSize = newSize
      this.getEsoterList()
    },
    handleCurrentChange(newPage) {
      //当页码发生改变时，更改pagesize，重新请求
      this.queryInfo.pageNo = newPage
      this.getEsoterList()
    },
    // 删除商品
    async removeEsoterShaolin(id) {
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
      this.getEsoterList()
    },
    // 添加 编辑
    openDialog(esoterShaolin = {}) {
      this.editEsoterShaolinForm = esoterShaolin
      this.$nextTick(() => {
        this.$refs.dialogRef.open()
      })
    },
    // 新增|修改 后更新列表
    async addEsoter(editForm) {
      const res = await addEsoterShaolin(editForm)
      if (res.status !== 200) {
        return this.$message.error('添加失败')
      }
      this.$message.success('添加成功')
      this.getEsoterList()
    },
    async changeEsoter(editForm) {
      console.log(editForm)
      const res = await updateEsoterShaolin(editForm)
      if (res.status !== 200) {
        return this.$message.error('修改失败')
      }
      this.$message.success('修改成功')
      this.getEsoterList()
    }
    // updateList() {
    //   this.getEsoterList()
    // }
  }
}
</script>

<style lang="less" scoped>
.el-image {
  width: 110px;
  height: 80px;
}
</style>
