<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/001.jpg" alt style="width: 50px;" />
        <span>Dragon 后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <!-- 侧边栏,宽度根据是否折叠进行设置 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 伸缩侧边栏按钮 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单 -->
        <!-- 侧边栏菜单，:collapse="isCollapse"（设置折叠菜单为绑定的 isCollapse 值），:collapse-transition="false"（关闭默认的折叠动画） -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          unique-opened
          active-text-color="#409eff"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级子菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <!-- 二级菜单模板 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menulist: [
        {
          id: 101,
          order: 1,
          path: 'users',
          authName: '用户管理',
          children: [
            {
              id: 111,
              order: null,
              path: 'userself',
              authName: '个人中心'
            }
          ]
        },
        {
          id: 102,
          order: 2,
          path: 'ebcycl',
          authName: '百科管理',
          children: [
            {
              id: 221,
              order: null,
              path: 'ebcycls',
              authName: '百科列表'
            }
          ]
        },
        {
          id: 103,
          order: 3,
          path: 'esoter',
          authName: '门派管理',
          children: [
            {
              id: 331,
              order: null,
              path: 'esoterShaolin',
              authName: '少林派'
            },
            {
              id: 332,
              order: null,
              path: 'esoterWudang',
              authName: '武当派'
            }
          ]
        },
        {
          id: 104,
          order: 4,
          path: 'contest',
          authName: '比赛管理',
          children: [
            {
              id: 441,
              order: null,
              path: 'contestGame',
              authName: '比赛列表'
            },
            {
              id: 442,
              order: null,
              path: 'contestShow',
              authName: '表演列表'
            }
          ]
        },
        {
          id: 105,
          order: 5,
          path: 'forum',
          authName: '论坛管理',
          children: [
            {
              id: 551,
              order: null,
              path: 'forumShaolin',
              authName: '少林区'
            },
            {
              id: 552,
              order: null,
              path: 'forumWudang',
              authName: '武当区'
            }
          ]
        },
        {
          id: 106,
          order: 6,
          path: 'mall',
          authName: '服装器械城',
          children: [
            {
              id: 661,
              order: 1,
              path: 'clothes',
              authName: '服装列表'
            },
            {
              id: 662,
              order: 2,
              path: 'weapon',
              authName: '器械列表'
            },
            {
              id: 663,
              order: 3,
              path: 'cate',
              authName: '购物车'
            },
            {
              id: 664,
              order: 4,
              path: 'logistics',
              authName: '地址信息'
            }
          ]
        }
      ],
      iconsObj: {
        101: 'el-icon-user-solid',
        102: 'el-icon-s-ticket',
        103: 'el-icon-s-management',
        104: 'el-icon-s-order',
        105: 'el-icon-s-comment',
        106: 'el-icon-s-shop'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created() {
    // 在created 阶段请求左侧菜单数据
    // this.getMenuList(),
    this.activePath = window.sessionStorage.getItem('activePath')
    // 定义一个事件监听,事件监听里面做2件事情,改变activePath和本地的sessionStorage
    // hub.$on('saveNavState', this.saveNavState)
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // async getMenuList() {
    //   // 发送请求获取左侧菜单数据
    //   const { data: res } = await this.$http.get('menus')
    //   if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
    //   this.menulist = res.data
    //   console.log(this.menulist)
    // },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    saveNavState(path) {
      //点击二级菜单的时候保存被点击的二级菜单信息
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
    }
  },
  // beforeDestroy() {
  // 	// 移除事件监听,反之监听多次
  // 	hub.$off('saveNavState')
  // },
  watch: {
    $route(to, from) {
      this.activePath = window.sessionStorage.getItem('activePath')
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #373d41;
  padding-left: 0;
  color: #fff;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;

    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
