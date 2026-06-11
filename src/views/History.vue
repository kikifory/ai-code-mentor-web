<template>
  <div class="history-container">
    <el-card>
      <template #header>
        <span>历史分析记录</span>
        <div style="float: right; display: flex; gap: 10px;">
          <el-input v-model="searchTitle" placeholder="按标题筛选" style="width: 180px" clearable />
          <el-select v-model="searchLanguage" placeholder="所有语言" style="width: 120px" clearable>
            <el-option label="Java" value="Java" />
            <el-option label="C++" value="C++" />
            <el-option label="Python" value="Python" />
            <el-option label="JavaScript" value="JavaScript" />
          </el-select>
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 260px"
          />
          <el-button @click="resetFilters">重置</el-button>
        </div>
      </template>
      <el-table :data="records" v-loading="loading" stripe>
        <el-table-column prop="title" label="题目标题" min-width="150" />
        <el-table-column prop="summary" label="分析摘要" min-width="250" show-overflow-tooltip />
        <el-table-column prop="language" label="语言" width="100" />
        <el-table-column prop="createdAt" label="分析时间" width="170" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="router.push(`/report/${row.id}`)">查看报告</el-button>
            <el-button link type="danger" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="size"
        :total="total"
        layout="prev, pager, next"
        @current-change="fetchHistory"
        style="margin-top: 20px; justify-content: center"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getHistory, deleteRecord, type HistoryItem, type HistoryQuery } from '@/api/analysis'

const router = useRouter()
const loading = ref(false)
const records = ref<HistoryItem[]>([])
const total = ref(0)
const page = ref(1)
const size = ref(10)
const searchTitle = ref('')
const searchLanguage = ref('')
const dateRange = ref<[Date, Date] | null>(null)

function buildParams(): HistoryQuery {
  const params: HistoryQuery = {
    page: page.value,
    size: size.value,
    title: searchTitle.value || undefined,
    language: searchLanguage.value || undefined
  }
  if (dateRange.value?.length === 2) {
    params.startDate = dateRange.value[0].toISOString().split('T')[0]
    params.endDate = dateRange.value[1].toISOString().split('T')[0]
  }
  return params
}

async function fetchHistory() {
  loading.value = true
  try {
    const res = await getHistory(buildParams())
    records.value = res.data.records
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

function resetFilters() {
  searchTitle.value = ''
  searchLanguage.value = ''
  dateRange.value = null
  page.value = 1
  fetchHistory()
}

async function handleDelete(id: number) {
  await ElMessageBox.confirm('确定删除这条记录吗？', '提示', { type: 'warning' })
  await deleteRecord(id)
  ElMessage.success('删除成功')
  fetchHistory()
}

watch([searchTitle, searchLanguage, dateRange], () => {
  page.value = 1
  fetchHistory()
})

onMounted(fetchHistory)
</script>

<style scoped>
.history-container {
  padding: 20px;
}
</style>
