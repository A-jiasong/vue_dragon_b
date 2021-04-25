<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>论坛管理</el-breadcrumb-item>
      <el-breadcrumb-item>少林论区</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.title"
            clearable
            @clear="getForumList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getForumList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="openDialog()">添加主题</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table
        :data="forumList"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
      >
        <el-table-column prop="id" label="id" width="100"> </el-table-column>
        <el-table-column prop="createTime" label="日期" sortable width="180">
        </el-table-column>
        <el-table-column prop="username" label="发布者" sortable width="100">
        </el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column label="内容" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div v-html="scope.row.content"></div>
          </template>
        </el-table-column>
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
              @click="removeForumShaolin(scope.row.id)"
            ></el-button>
            <el-button
              v-if="!scope.row.replyId"
              size="mini"
              type="success"
              icon="el-icon-document-add"
              @click="openReplyDialog(scope.row)"
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
      :data="editForumShaolinForm"
      @addData="addData"
      @changeData="changeData"
    />
    <!-- 添加回复 -->
    <add-reply
      ref="replyRef"
      :data="editForumShaolinForm"
      @addData="addData"
      @changeData="changeData"
    />
  </div>
</template>

<script>
import AddEditDialog from './components/AddEditDialog'
import AddReply from './components/AddReply'
import {
  getForumShaolinList,
  deleteById,
  addForumShaolin,
  updateForumShaolin
} from '@/api/forumShaolin'
import {
  addForumShaolinreply,
  updateForumShaolinreply,
  findAllReply
} from '@/api/forumShaolinreply'
import { parseTimeByString } from '@/filters'
export default {
  components: {
    AddEditDialog,
    AddReply
  },
  data() {
    return {
      // 查询参数
      queryInfo: {
        title: '',
        pageNo: 1,
        pageSize: 5
      },
      editForumShaolinForm: {},
      forumList: [],
      total: null
    }
  },
  created() {
    this.getForumList()
  },
  methods: {
    async getForumList() {
      // 根据分页获取对应的商品列表
      const res = await getForumShaolinList(this.queryInfo)
      if (res.status !== 200) {
        return this.$message.error('获取少林论坛列表失败')
      }
      console.log(res.data)
      this.$message.success('获取少林论坛列表成功')
      // this.forumList = res.data.list
      // this.forumList.map((item) => {
      //   // 将时间进行格式化
      //   item.createTime = parseTimeByString(item.createTime)
      // })
      // console.log(this.forumList)
      this.total = res.data.count

      // 调用接口，查询所有的回复信息
      const reply = await findAllReply()
      console.log(reply.data)
      reply.data.map((item) => {
        // 将时间进行格式化
        item.createTime = parseTimeByString(item.createTime)
        // item.title = ''
      })

      // // 1、首先查询到所有的forumList，将数据进行过滤
      // // 2、将回复的数据，存到相应的对象中children。
      // // 3、判断id是否相等，相等就存到相应的对象中children。// 通过过滤来实现

      // 将数据forumList进行循环
      res.data.list.map((forumItem) => {
        // 将时间进行格式化
        forumItem.createTime = parseTimeByString(forumItem.createTime)
        // 获取到当前讨论主题的回帖数据
        const replyArr = reply.data.filter((item) => {
          return item.replyId === forumItem.id
        })
        forumItem.children = replyArr
      })
      this.forumList = res.data.list
      console.log(this.forumList)
      // // 最后将存在reply_id的过滤掉
      // this.forumList = this.forumList.filter((item) => {
      //   return item.replyId === null
      // })
      // console.log(this.forumList)
      // this.total = this.forumList.length
    },
    handleSizeChange(newSize) {
      //当页号发生改变时，更改pagesize，重新请求
      this.queryInfo.pageSize = newSize
      this.getForumList()
    },
    handleCurrentChange(newPage) {
      //当页码发生改变时，更改pagesize，重新请求
      this.queryInfo.pageNo = newPage
      this.getForumList()
    },
    // 删除商品
    async removeForumShaolin(id) {
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
      this.getForumList()
    },
    // 添加 编辑
    openDialog(forumShaolin = {}) {
      this.editForumShaolinForm = forumShaolin
      console.log(forumShaolin)
      // 当有replyId的时候，就进行回复的编辑
      if (forumShaolin.replyId) {
        this.$nextTick(() => {
          this.$refs.replyRef.open()
        })
      } else {
        // 否则进行主题的添加和编辑
        this.$nextTick(() => {
          this.$refs.dialogRef.open()
        })
      }
    },
    // 添加 回复
    openReplyDialog(forumShaolin = {}) {
      this.editForumShaolinForm = forumShaolin
      this.$nextTick(() => {
        this.$refs.replyRef.open()
      })
    },
    // 新增|修改 后更新列表
    async addData(editForm) {
      console.log(editForm)
      // 如果有replyID，就是添加回复
      if (editForm.replyId) {
        // 添加回复
        const res = await addForumShaolinreply(editForm)
        if (res.status !== 200) {
          return this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
      } else {
        // 添加主题
        const res = await addForumShaolin(editForm)
        if (res.status !== 200) {
          return this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
      }
      this.getForumList()
    },
    async changeData(editForm) {
      console.log(editForm)
      if (editForm.replyId) {
        // 修改回复
        const res = await updateForumShaolinreply(editForm)
        if (res.status !== 200) {
          return this.$message.error('修改失败')
        }
        this.$message.success('修改成功')
      } else {
        // 修改主题
        const res = await updateForumShaolin(editForm)
        if (res.status !== 200) {
          return this.$message.error('修改失败')
        }
        this.$message.success('修改成功')
      }

      this.getForumList()
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
