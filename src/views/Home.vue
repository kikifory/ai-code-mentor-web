//首页
<template>
  <div class="home-container">
    <el-row :gutter="24">
      <el-col :span="16">
        <el-card class="welcome-card">
          <h2>欢迎使用 AI Code Mentor</h2>
          <p>提交算法代码，获取 AI 教学式反馈报告，快速提升编码能力。</p>
          <el-button type="primary" size="large" @click="router.push('/analyze')">开始分析 →</el-button>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>常用刷题网站</template>
          <div class="site-buttons">
            <el-button v-for="site in sites" :key="site.name" @click="openSite(site.url)" plain>{{ site.name }}</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card style="margin-top: 24px">
      <template #header>最近分析记录</template>
      <el-table :data="recentRecords" v-loading="loading" style="width: 100%">
        <el-table-column prop="title" label="题目标题" />
        <el-table-column prop="language" label="语言" width="100" />
        <el-table-column prop="createdAt" label="分析时间" width="180" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button link type="primary" @click="router.push(`/report/${row.id}`)">查看报告</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getHistory } from '../api/analysis'

const router = useRouter()
const loading = ref(false)
const recentRecords = ref([])

const sites = [
  { name: 'LeetCode', url: 'https://leetcode.com/' },
  { name: '力扣中国', url: 'https://leetcode.cn/' },
  { name: '牛客网', url: 'https://www.nowcoder.com/' },
  { name: '洛谷', url: 'https://www.luogu.com.cn/' },
  { name: 'Codeforces', url: 'https://codeforces.com/' },
  { name: 'AtCoder', url: 'https://atcoder.jp/' },
  { name: 'AcWing', url: 'https://www.acwing.com/' }
]

const openSite = (url: string) => {
  window.open(url, '_blank')
}

const fetchRecentRecords = async () => {
  loading.value = true
  try {
    const res = await getHistory({ page: 1, size: 5 })
    recentRecords.value = res.data.records || []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchRecentRecords()
})
</script>

<style scoped>
.home-container {
  padding: 20px;
}
.welcome-card {
  background: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
  text-align: center;
  padding: 24px;
}
.site-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>