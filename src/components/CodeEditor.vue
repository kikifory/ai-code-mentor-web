//代码编辑器组件,封装 Monaco Editor,支持语言选择和代码高亮
<template>
  <div class="code-editor">
    <div class="toolbar">
      <span>代码编辑器</span>
      <el-select v-model="currentLang" size="small" @change="handleLangChange" style="width: 120px">
        <el-option label="Java" value="java" />
        <el-option label="C++" value="cpp" />
        <el-option label="Python" value="python" />
        <el-option label="JavaScript" value="javascript" />
      </el-select>
    </div>
    <div ref="editorContainer" class="editor-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as monaco from 'monaco-editor'

const props = defineProps<{
  modelValue: string
  language?: string   // 外部传入 "Java" / "C++" / "Python" / "JavaScript"
}>()

const emit = defineEmits(['update:modelValue', 'language-change'])

const editorContainer = ref<HTMLElement>()
let editor: monaco.editor.IStandaloneCodeEditor | null = null

// 语言映射：展示名 -> monaco 内部名
const langMap: Record<string, string> = {
  'Java': 'java',
  'C++': 'cpp',
  'Python': 'python',
  'JavaScript': 'javascript'
}
const reverseMap: Record<string, string> = {
  'java': 'Java',
  'cpp': 'C++',
  'python': 'Python',
  'javascript': 'JavaScript'
}

const currentLang = ref(langMap[props.language || 'Java'] || 'java')

const initEditor = () => {
  if (!editorContainer.value) return
  editor = monaco.editor.create(editorContainer.value, {
    value: props.modelValue,
    language: currentLang.value,
    theme: 'vs-dark',
    automaticLayout: true,
    fontSize: 14,
    minimap: { enabled: false }
  })
  editor.onDidChangeModelContent(() => {
    emit('update:modelValue', editor?.getValue() || '')
  })
}

const setLanguage = (lang: string) => {
  if (editor) {
    monaco.editor.setModelLanguage(editor.getModel()!, lang)
  }
}

const handleLangChange = (val: string) => {
  setLanguage(val)
  const displayLang = reverseMap[val]
  if (displayLang) emit('language-change', displayLang)
}

// 外部 language 变化时同步
watch(() => props.language, (newLang) => {
  if (newLang && langMap[newLang] && langMap[newLang] !== currentLang.value) {
    currentLang.value = langMap[newLang]
    setLanguage(currentLang.value)
  }
})

onMounted(() => {
  initEditor()
})

onBeforeUnmount(() => {
  editor?.dispose()
})
</script>

<style scoped>
.code-editor {
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  overflow: hidden;
}
.toolbar {
  background: #2c3e50;
  color: white;
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.editor-container {
  height: 500px;
}
</style>