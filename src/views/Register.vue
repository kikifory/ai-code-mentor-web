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
          <h1>加入 AI Code Mentor</h1>
          <p>创建账号后，即可体验 AI 教学式代码分析与算法学习辅助。</p>
          <div class="feature-list">
            <div class="feature-item">
              <span class="dot"></span>
              智能算法讲解
            </div>
            <div class="feature-item">
              <span class="dot"></span>
              自动复杂度分析
            </div>
            <div class="feature-item">
              <span class="dot"></span>
              个性化学习记录
            </div>
          </div>
        </div>
      </div>

      <div class="form-panel">
        <div class="form-card">
          <div class="form-header">
            <h2>创建账号</h2>
            <p>填写以下信息完成注册</p>
          </div>

          <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名" size="large" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="form.password"
                type="password"
                show-password
                placeholder="请输入密码"
                size="large"
              />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="form.confirmPassword"
                type="password"
                show-password
                placeholder="请再次输入密码"
                size="large"
              />
            </el-form-item>
            <el-button type="primary" size="large" class="submit-btn" @click="handleRegister">
              注册
            </el-button>
          </el-form>

          <div class="bottom-text">
            已有账号？
            <RouterLink to="/login" class="link">立即登录</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import { register } from '@/api/auth'
import '@/styles/auth.css'

const router = useRouter()
const formRef = ref<FormInstance>()
const form = reactive({ username: '', password: '', confirmPassword: '' })

const validateConfirmPassword = (_rule: unknown, value: string, callback: (err?: Error) => void) => {
  if (!value) callback(new Error('请再次输入密码'))
  else if (value !== form.password) callback(new Error('两次输入密码不一致'))
  else callback()
}

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }]
}

async function handleRegister() {
  const valid = await formRef.value?.validate()
  if (!valid) return

  try {
    await register({ username: form.username, password: form.password })
    router.push('/login')
  } catch {}
}
</script>

<style scoped>
.intro-content h1 {
  font-size: 52px;
  color: #243447;
  margin-bottom: 24px;
}

.form-panel {
  width: 460px;
}
</style>
