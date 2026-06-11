<template>
  <div class="report-container" v-loading="loading">
    <el-card v-if="report">
      <h2>{{ report.title }}</h2>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="语言">{{ report.language }}</el-descriptions-item>
        <el-descriptions-item label="分析时间">{{ formatDate(report.createdAt) }}</el-descriptions-item>
      </el-descriptions>

      <el-divider content-position="left">用户代码</el-divider>
      <pre class="code-block"><code>{{ report.code }}</code></pre>

      <el-divider content-position="left">总体评价</el-divider>
      <div v-html="renderMarkdown(report.summary)" class="markdown-body"></div>

      <el-divider content-position="left">算法思路</el-divider>
      <div v-html="renderMarkdown(report.algorithmIdea)" class="markdown-body"></div>

      <el-divider content-position="left">错误分析</el-divider>
      <div v-html="renderMarkdown(report.errorAnalysis)" class="markdown-body"></div>

      <el-divider content-position="left">边界情况</el-divider>
      <div>
        <el-tag v-for="(edge, idx) in edgeCases" :key="idx" style="margin-right: 8px; margin-bottom: 8px">
          {{ edge }}
        </el-tag>
        <span v-if="edgeCases.length === 0">无</span>
      </div>

      <el-divider content-position="left">复杂度分析</el-divider>
      <div><strong>时间复杂度：</strong> <span v-html="renderMarkdown(report.timeComplexity)"></span></div>
      <div><strong>空间复杂度：</strong> <span v-html="renderMarkdown(report.spaceComplexity)"></span></div>

      <el-divider content-position="left">优化建议</el-divider>
      <div v-html="renderMarkdown(report.optimization)" class="markdown-body"></div>

      <el-divider content-position="left">教学引导</el-divider>
      <div v-html="renderMarkdown(report.teachingGuide)" class="markdown-body"></div>

      <el-divider content-position="left">下一步建议</el-divider>
      <ul>
        <li v-for="(step, idx) in nextSteps" :key="idx">{{ step }}</li>
      </ul>

      <el-button type="primary" @click="copyReport" style="margin-top: 20px">复制分析报告</el-button>

      <el-divider content-position="left">💬 AI 问答助手</el-divider>
      <div class="chat-container">
        <div class="chat-messages" ref="chatContainer">
          <div v-for="(msg, idx) in conversations" :key="idx" class="chat-message">
            <div class="message-question">
              <span class="label">我：</span>
              <div>{{ msg.question }}</div>
            </div>
            <div class="message-answer">
              <span class="label">AI：</span>
              <div v-html="renderMarkdown(msg.answer)" class="markdown-body"></div>
            </div>
          </div>
          <div v-if="asking" class="chat-message loading-message">
            <span class="label">AI：</span>
            <span>正在思考中...</span>
          </div>
        </div>
        <div class="chat-input">
          <el-input
            type="textarea"
            v-model="newQuestion"
            placeholder="输入你的追问，例如：为什么这里要用哈希表？能再详细解释边界条件吗？"
            :rows="3"
          />
          <el-button type="primary" @click="sendQuestion" :loading="asking" style="margin-top: 10px">发送</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import MarkdownIt from 'markdown-it'
import {
  getDetail,
  getConversations,
  askQuestion,
  type ConversationItem,
  type ReportDetail
} from '@/api/analysis'
import { toStringList } from '@/utils/parseList'

const route = useRoute()
const md = new MarkdownIt({ html: true, linkify: true, typographer: true })

const loading = ref(false)
const report = ref<ReportDetail | null>(null)
const conversations = ref<ConversationItem[]>([])
const newQuestion = ref('')
const asking = ref(false)
const chatContainer = ref<HTMLElement>()

const recordId = computed(() => Number(route.params.id))
const edgeCases = computed(() => toStringList(report.value?.edgeCases))
const nextSteps = computed(() => toStringList(report.value?.nextSteps))

const renderMarkdown = (text: string) => (text ? md.render(text) : '')

const formatDate = (dateStr: string) => (dateStr ? new Date(dateStr).toLocaleString() : '')

async function fetchDetail() {
  if (!recordId.value) return
  loading.value = true
  try {
    const res = await getDetail(recordId.value)
    report.value = res.data
    await fetchConversations()
  } catch {
    ElMessage.error('获取报告失败')
  } finally {
    loading.value = false
  }
}

async function fetchConversations() {
  if (!recordId.value) return
  try {
    const res = await getConversations(recordId.value)
    conversations.value = res.data || []
    scrollToBottom()
  } catch {
  }
}

async function sendQuestion() {
  if (!newQuestion.value.trim()) {
    ElMessage.warning('请输入问题')
    return
  }
  asking.value = true
  try {
    await askQuestion(recordId.value, newQuestion.value)
    newQuestion.value = ''
    await fetchConversations()
  } catch {
    ElMessage.error('网络错误，请稍后再试')
  } finally {
    asking.value = false
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

function copyReport() {
  if (!report.value) return
  const r = report.value
  const content = [
    `# ${r.title}`,
    '',
    `**语言**: ${r.language}`,
    `**分析时间**: ${formatDate(r.createdAt)}`,
    '',
    '## 用户代码',
    '```',
    r.code,
    '```',
    '',
    `## 总体评价\n${r.summary || '无'}`,
    `## 算法思路\n${r.algorithmIdea || '无'}`,
    `## 错误分析\n${r.errorAnalysis || '无'}`,
    `## 边界情况\n${edgeCases.value.join(', ') || '无'}`,
    `## 复杂度分析\n- 时间复杂度: ${r.timeComplexity || '无'}\n- 空间复杂度: ${r.spaceComplexity || '无'}`,
    `## 优化建议\n${r.optimization || '无'}`,
    `## 教学引导\n${r.teachingGuide || '无'}`,
    `## 下一步建议\n${nextSteps.value.map((s) => `- ${s}`).join('\n') || '无'}`
  ].join('\n')

  navigator.clipboard.writeText(content).then(
    () => ElMessage.success('报告已复制到剪贴板'),
    () => ElMessage.error('复制失败，请手动复制')
  )
}

onMounted(fetchDetail)
</script>

<style>
@import 'github-markdown-css/github-markdown.css';
.markdown-body {
  box-sizing: border-box;
  padding: 10px;
  font-size: 14px;
  line-height: 1.6;
}
.markdown-body p {
  margin: 0 0 10px;
}
.markdown-body code {
  background: #f5f5f5;
  padding: 2px 4px;
  border-radius: 4px;
}

.code-block {
  background-color: #f5f7fa;
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: monospace;
  font-size: 13px;
}

.chat-container {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  margin-top: 10px;
  background-color: #fafafa;
}
.chat-messages {
  height: 400px;
  overflow-y: auto;
  padding: 12px;
}
.chat-message {
  margin-bottom: 16px;
}
.message-question,
.message-answer {
  padding: 8px 12px;
  border-radius: 8px;
  margin-bottom: 8px;
}
.message-question {
  background-color: #e8f4f8;
  text-align: right;
}
.message-answer {
  background-color: #f0f0f0;
}
.label {
  font-weight: bold;
  margin-right: 8px;
}
.loading-message {
  color: #909399;
}
.chat-input {
  padding: 12px;
  border-top: 1px solid #e4e7ed;
}
</style>
