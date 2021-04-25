<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>我的购物车</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.title"
            clearable
            @clear="getMallList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getMallList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="mallList" stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品图片" prop="titleImg" width="150">
          <template slot-scope="scope">
            <el-image :src="scope.row.titleImg" fit="fill"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="商品标题" prop="title"></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="price"
          width="120"
        ></el-table-column>
        <el-table-column label="数量" width="200">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.num"
              @change="handleChange(scope.row)"
              :min="1"
              :max="50"
              label="描述文字"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeMallCart(scope.row.id)"
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
  </div>
</template>

<script>
import { getMallCartList, deleteById, updateMallCart } from '@/api/mallCart'
import { numFilter } from '@/filters'
export default {
  components: {},
  data() {
    return {
      // 查询参数
      queryInfo: {
        title: '',
        pageNo: 1,
        pageSize: 5
      },
      editMallCartForm: {},
      mallList: [],
      mallCart: {},
      total: null
    }
  },
  created() {
    this.getMallList()
  },
  methods: {
    async getMallList() {
      // 根据分页获取对应的商品列表
      const res = await getMallCartList(this.queryInfo)
      if (res.status !== 200) {
        return this.$message.error('获取购物车列表失败')
      }
      console.log(res.data)
      this.$message.success('获取购物车列表成功')
      this.mallList = res.data.list
      this.mallList.map((item) => {
        // 将时间进行格式化
        // item.createTime = parseTimeByString(item.createTime)
        // 将价格进行格式化
        item.price = numFilter(item.price)
      })
      // console.log(this.mallList)
      this.total = res.data.count
    },
    handleSizeChange(newSize) {
      //当页号发生改变时，更改pagesize，重新请求
      this.queryInfo.pageSize = newSize
      this.getMallList()
    },
    handleCurrentChange(newPage) {
      //当页码发生改变时，更改pagesize，重新请求
      this.queryInfo.pageNo = newPage
      this.getMallList()
    },
    // 删除商品
    async removeMallCart(id) {
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
      this.getMallList()
    },
    async changeData(editForm) {
      console.log(editForm)
      const res = await updateMallCart(editForm)
      if (res.status !== 200) {
        return this.$message.error('修改失败')
      }
      this.$message.success('修改成功')
      // this.getMallList()
    },
    // 修改商品数量时触发
    handleChange(editForm) {
      console.log(editForm)
      this.mallCart.id = editForm.id
      this.mallCart.num = editForm.num
      // 只需要传入两个属性即可
      this.changeData(this.mallCart)
    }
    // updateList() {
    //   this.getMallList()
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
