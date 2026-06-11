<template>
  <el-container class="layout-container">
    <el-header>
      <div class="logo">AI Code Mentor</div>
      <el-menu mode="horizontal" router :default-active="$route.path">
        <el-menu-item index="/home">首页</el-menu-item>
        <el-menu-item index="/analyze">代码分析</el-menu-item>
        <el-menu-item index="/history">历史记录</el-menu-item>
        <el-menu-item index="" @click="handleLogout" style="margin-left: auto;">退出</el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const handleLogout = () => {
  userStore.logout()
  ElMessage.success('已退出登录')
  router.push('/login')
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}
.el-header {
  background-color: #2c3e50;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 24px;
}
.logo {
  font-size: 20px;
  font-weight: bold;
  margin-right: 40px;
  color: white;
}
.el-menu {
  background-color: #2c3e50;
  flex: 1;
}
.el-menu-item {
  color: #ecf0f1;
}
.el-menu-item.is-active {
  color: #42b983;
  border-bottom-color: #42b983;
}
</style>