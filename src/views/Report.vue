//报告详情页
<template>
  <div class="report-container" v-loading="loading">
    <el-card v-if="report">
      <h2>{{ report.title }}</h2>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="语言">{{ report.language }}</el-descriptions-item>
        <el-descriptions-item label="分析时间">{{ formatDate(report.createdAt) }}</el-descriptions-item>
      </el-descriptions>

      <el-divider content-position="left">总体评价</el-divider>
      <el-text>{{ report.summary }}</el-text>

      <el-divider content-position="left">算法思路</el-divider>
      <el-text>{{ report.algorithmIdea }}</el-text>

      <el-divider content-position="left">错误分析</el-divider>
      <el-text>{{ report.errorAnalysis }}</el-text>

      <el-divider content-position="left">边界情况</el-divider>
      <div>
        <el-tag v-for="(edge, idx) in toList(report.edgeCases)" :key="idx" style="margin-right: 8px; margin-bottom: 8px">
          {{ edge }}
        </el-tag>
        <span v-if="toList(report.edgeCases).length === 0">无</span>
      </div>

      <el-divider content-position="left">复杂度分析</el-divider>
      <el-text>时间复杂度：{{ report.timeComplexity || '未提供' }}</el-text><br/>
      <el-text>空间复杂度：{{ report.spaceComplexity || '未提供' }}</el-text>

      <el-divider content-position="left">优化建议</el-divider>
      <el-text>{{ report.optimization }}</el-text>

      <el-divider content-position="left">教学引导</el-divider>
      <el-text>{{ report.teachingGuide }}</el-text>

      <el-divider content-position="left">下一步建议</el-divider>
      <ul>
        <li v-for="(step, idx) in toList(report.nextSteps)" :key="idx">{{ step }}</li>
      </ul>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getDetail } from '@/api/analysis'
import { ElMessage } from 'element-plus'

const route = useRoute()
const loading = ref(false)
const report = ref<any>(null)

const toList = (value: unknown): string[] => {
  if (!value) return []
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed.map(String) : []
    } catch {
      return []
    }
  }
  return []
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString()
}

const fetchDetail = async () => {
  const id = parseInt(route.params.id as string)
  if (isNaN(id)) return
  loading.value = true
  try {
    const res = await getDetail(id)
    report.value = res.data
  } catch (error) {
    ElMessage.error('获取报告失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDetail()
})
</script>

<style scoped>
.report-container {
  max-width: 1000px;
  margin: 20px auto;
  padding: 0 20px;
}
</style>