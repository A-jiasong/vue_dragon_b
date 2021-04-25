<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>服装列表</el-breadcrumb-item>
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
        <el-col :span="4">
          <el-button type="primary" @click="openDialog()">添加商品</el-button>
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
          label="发布者"
          prop="username"
          width="100"
        ></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="price"
          width="120"
        ></el-table-column>
        <el-table-column
          label="点击量"
          prop="clickNum"
          width="100"
        ></el-table-column>
        <el-table-column label="发布时间" prop="createTime"> </el-table-column>
        <el-table-column label="操作" width="180">
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
              @click="removeMallClothes(scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-document-add"
              @click="addCart(scope.row)"
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
      :data="editMallClothesForm"
      @addData="addData"
      @changeData="changeData"
    />
  </div>
</template>

<script>
import AddEditDialog from './components/AddEditDialog'
import {
  getMallClothesList,
  deleteById,
  addMallClothes,
  updateMallClothes
} from '@/api/mallClothes'
import { addMallCart, getMallCartList, updateMallCart } from '@/api/mallCart'
import { parseTimeByString, numFilter } from '@/filters'
import { getItem } from '@/utils/storage'
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
      editMallClothesForm: {},
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
      const res = await getMallClothesList(this.queryInfo)
      if (res.status !== 200) {
        return this.$message.error('获取服装列表失败')
      }
      console.log(res.data)
      this.$message.success('获取服装列表成功')
      this.mallList = res.data.list
      this.mallList.map((item) => {
        // 将时间进行格式化
        item.createTime = parseTimeByString(item.createTime)
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
    async removeMallClothes(id) {
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
    // 添加 编辑
    openDialog(mallClothes = {}) {
      this.editMallClothesForm = mallClothes
      this.$nextTick(() => {
        this.$refs.dialogRef.open()
      })
    },
    // 新增|修改 后更新列表
    async addData(editForm) {
      const res = await addMallClothes(editForm)
      if (res.status !== 200) {
        return this.$message.error('添加失败')
      }
      this.$message.success('添加成功')
      this.getMallList()
    },
    async changeData(editForm) {
      console.log(editForm)
      const res = await updateMallClothes(editForm)
      if (res.status !== 200) {
        return this.$message.error('修改失败')
      }
      this.$message.success('修改成功')
      this.getMallList()
    },
    // updateList() {
    //   this.getMallList()
    // }
    // 添加到购物车
    addCart(editForm) {
      this.$confirm('是否要添加到购物车?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(async () => {
          // 添加之前应该进行判断，判断购物车是否有该商品，通过cartId来判断
          // 如果有，就将该商品的数量进行+1操作
          // 如果没有，再进行添加的操作
          const cartList = await getMallCartList(this.queryInfo)
          const flag = cartList.data.list.filter((item) => {
            return item.cartId === editForm.id
          })
          console.log(flag[0])
          if (flag.length) {
            console.log('进行+1操作')
            this.mallCart.id = flag[0].id
            this.mallCart.num = flag[0].num + 1
            const addNum = await updateMallCart(this.mallCart)
            if (addNum.status !== 200) {
              return this.$message.error('添加失败')
            }
            this.$message.success('添加成功')
          } else {
            console.log('进行添加操作')
            //获取当前用户数据
            const userInfo = getItem('userInfo')
            this.mallCart.cartId = editForm.id
            this.mallCart.userId = userInfo.id
            this.mallCart.title = editForm.title
            this.mallCart.titleImg = editForm.titleImg
            this.mallCart.price = editForm.price
            this.mallCart.num = 1
            const res = await addMallCart(this.mallCart)
            if (res.status !== 200) {
              return this.$message.error('添加失败')
            }
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消添加'
          })
        })
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
