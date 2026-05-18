// 代码分析页面
<template>
  <div class="analyze-container">
    <el-row :gutter="20">
      <!-- 左侧题目信息 -->
      <el-col :span="12">
        <el-card class="problem-card">
          <template #header>题目信息</template>
          <el-form :model="form" label-width="80px">
            <el-form-item label="题目名称" required>
              <el-input v-model="form.title" placeholder="例如：两数之和" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input type="textarea" v-model="form.remark" placeholder="填写你的疑问或希望AI重点分析的方向..." :rows="2" />
            </el-form-item>
            <el-form-item label="题目原文" required>
              <el-input type="textarea" v-model="form.problemContent" placeholder="粘贴完整的题目描述、输入输出样例、约束条件..." :rows="15" />
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <!-- 右侧代码编辑器 -->
      <el-col :span="12">
        <el-card class="code-card">
          <template #header>
            <span>代码</span>
            <div style="float: right">
              <el-button @click="handleClear" :disabled="analyzing">清空内容</el-button>
              <el-button type="primary" @click="handleAnalyze" :loading="analyzing" style="margin-left: 10px">开始分析</el-button>
            </div>
          </template>
          <CodeEditor v-model="form.code" :language="form.language" @language-change="onLanguageChange" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { analyze } from '@/api/analysis'
import CodeEditor from '@/components/CodeEditor.vue'

const router = useRouter()
const analyzing = ref(false)

const form = reactive({
  title: '',
  remark: '',
  problemContent: '',
  language: 'Java',
  code: '// 请在此粘贴你的代码\n'
})

function onLanguageChange(lang: string) {
  form.language = lang
}

function handleClear() {
  form.title = ''
  form.remark = ''
  form.problemContent = ''
  form.code = '// 请在此粘贴你的代码\n'
  ElMessage.info('已清空所有内容')
}

async function handleAnalyze() {
  if (!form.title || !form.problemContent || !form.code.trim()) {
    ElMessage.warning('请填写完整的题目信息和代码')
    return
  }
  analyzing.value = true
  try {
    const res = await analyze(form)
    if (res.code === 200) {
      // 后端返回的数据应包含 recordId
      const recordId = res.data.recordId
      if (recordId) {
        ElMessage.success('分析完成，正在跳转报告页...')
        router.push(`/report/${recordId}`)
      } else {
        // 兼容旧版：跳转历史页
        ElMessage.warning('分析成功，但未返回记录ID，请前往历史记录查看')
        router.push('/history')
      }
    }
  } catch (error) {
    // 错误已由拦截器处理
  } finally {
    analyzing.value = false
  }
}
</script>

<style scoped>
.analyze-container {
  padding: 20px;
}
.problem-card, .code-card {
  height: calc(100vh - 100px);
  overflow-y: auto;
}
</style>