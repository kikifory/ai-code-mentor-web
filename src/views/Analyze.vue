<template>
  <div class="analyze-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="problem-card">
          <template #header>题目信息</template>
          <el-form :model="form" label-width="80px">
            <el-form-item label="题目名称" required>
              <el-input
                v-model="form.title"
                placeholder="例如：两数之和"
                @blur="validateField('title')"
              />
              <span v-if="errors.title" class="error-tip">{{ errors.title }}</span>
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                type="textarea"
                v-model="form.remark"
                placeholder="填写你的疑问或希望 AI 重点分析的方向..."
                :rows="2"
                @blur="validateField('remark')"
              />
              <span v-if="errors.remark" class="error-tip">{{ errors.remark }}</span>
            </el-form-item>
            <el-form-item label="题目原文" required>
              <el-input
                type="textarea"
                v-model="form.problemContent"
                placeholder="粘贴完整的题目描述、输入输出样例、约束条件..."
                :rows="15"
                @blur="validateField('problemContent')"
              />
              <span v-if="errors.problemContent" class="error-tip">{{ errors.problemContent }}</span>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="code-card">
          <template #header>
            <span>代码</span>
            <div style="float: right">
              <el-button @click="handleClear" :disabled="analyzing">清空内容</el-button>
              <el-button
                type="primary"
                @click="handleAnalyze"
                :loading="analyzing"
                style="margin-left: 10px"
              >
                开始分析
              </el-button>
            </div>
          </template>
          <CodeEditor
            v-model="form.code"
            :language="form.language"
            @language-change="form.language = $event"
          />
          <span v-if="errors.code" class="error-tip">{{ errors.code }}</span>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import { analyze } from '@/api/analysis'
import CodeEditor from '@/components/CodeEditor.vue'
import { getFieldGarbledError, type AnalyzeField } from '@/utils/textValidation'

const router = useRouter()
const analyzing = ref(false)
const defaultCode = '// 请在此粘贴你的代码\n'

const form = reactive({
  title: '',
  remark: '',
  problemContent: '',
  language: 'Java',
  code: defaultCode
})

const errors = reactive<Record<AnalyzeField, string>>({
  title: '',
  remark: '',
  problemContent: '',
  code: ''
})

const fields: AnalyzeField[] = ['title', 'remark', 'problemContent', 'code']

function validateField(field: AnalyzeField) {
  errors[field] = getFieldGarbledError(field, form[field], field === 'remark')
  return !errors[field]
}

function validateAll() {
  return fields.every(validateField)
}

watch(() => form.code, () => {
  if (errors.code) validateField('code')
})

function handleClear() {
  Object.assign(form, { title: '', remark: '', problemContent: '', code: defaultCode })
  fields.forEach((field) => { errors[field] = '' })
  ElMessage.info('已清空所有内容')
}

async function handleAnalyze() {
  if (!form.title || !form.problemContent || !form.code.trim()) {
    ElMessage.warning('请填写完整的题目信息和代码')
    return
  }
  if (!validateAll()) {
    const msg = fields.map((field) => errors[field]).find(Boolean)
    ElMessage.error(msg || '输入包含乱码或无效字符，请检查后重试')
    return
  }

  const loadingInstance = ElLoading.service({
    fullscreen: true,
    text: 'AI 正在分析代码，请稍候...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  analyzing.value = true
  try {
    const res = await analyze(form)
    const recordId = res.data.recordId
    if (recordId) {
      ElMessage.success('分析完成，正在跳转报告页...')
      router.push(`/report/${recordId}`)
    } else {
      ElMessage.warning('分析成功，但未返回记录ID，请前往历史记录查看')
      router.push('/history')
    }
  } catch {
  } finally {
    analyzing.value = false
    loadingInstance.close()
  }
}
</script>

<style scoped>
.analyze-container {
  padding: 20px;
}
.problem-card,
.code-card {
  height: calc(100vh - 100px);
  overflow-y: auto;
}
.error-tip {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}
</style>
