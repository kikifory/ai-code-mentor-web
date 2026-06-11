<template>
  <div class="auth-page">
    <header class="top-bar">
      <div class="logo">AI Code Mentor</div>
      <div class="nav-actions">
        <RouterLink to="/home" class="nav-link">首页</RouterLink>
        <RouterLink to="/analyze" class="nav-link">代码分析</RouterLink>
      </div>
    </header>

    <div class="auth-container">
      <div class="intro-panel">
        <div class="intro-content">
          <h1>欢迎回来</h1>
          <p>登录 AI Code Mentor,继续你的算法学习与代码分析。</p>
          <div class="feature-list">
            <div class="feature-item">
              <span class="dot"></span>
              AI 智能代码评审
            </div>
            <div class="feature-item">
              <span class="dot"></span>
              教学式错误分析
            </div>
            <div class="feature-item">
              <span class="dot"></span>
              历史记录自动保存
            </div>
          </div>
        </div>
      </div>

      <div class="form-panel">
        <div class="form-card">
          <div class="form-header">
            <h2>登录账号</h2>
            <p>请输入账号和密码</p>
          </div>

          <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名" size="large" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="请输入密码"
                show-password
                size="large"
              />
            </el-form-item>
            <el-button type="primary" size="large" class="submit-btn" @click="handleLogin">
              登录
            </el-button>
          </el-form>

          <div class="bottom-text">
            还没有账号？
            <RouterLink to="/register" class="link">立即注册</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import router from '@/router'
import { login } from '@/api/auth'
import { useUserStore } from '@/stores/user'
import '@/styles/auth.css'

const userStore = useUserStore()
const formRef = ref<FormInstance>()
const form = reactive({ username: '', password: '' })

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

async function handleLogin() {
  const valid = await formRef.value?.validate()
  if (!valid) return

  try {
    const res = await login({ username: form.username, password: form.password })
    userStore.setToken(res.data.token)
    router.push('/home')
  } catch {}
}
</script>

<style scoped>
.intro-content h1 {
  font-size: 54px;
  color: #243447;
  margin-bottom: 24px;
}

.form-panel {
  width: 440px;
}
</style>
