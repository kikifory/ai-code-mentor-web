<template>
  <div class="code-editor">
    <div class="toolbar">
      <span>代码编辑器</span>
      <el-select v-model="currentLang" size="small" @change="handleLangChange" style="width: 120px">
        <el-option v-for="item in languages" :key="item.monaco" :label="item.label" :value="item.monaco" />
      </el-select>
    </div>
    <div ref="editorContainer" class="editor-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as monaco from 'monaco-editor'

const languages = [
  { label: 'Java', monaco: 'java' },
  { label: 'C++', monaco: 'cpp' },
  { label: 'Python', monaco: 'python' },
  { label: 'JavaScript', monaco: 'javascript' }
] as const

const monacoToLabel = Object.fromEntries(languages.map((item) => [item.monaco, item.label]))
const labelToMonaco = Object.fromEntries(languages.map((item) => [item.label, item.monaco]))

const props = defineProps<{
  modelValue: string
  language?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'language-change': [label: string]
}>()

const editorContainer = ref<HTMLElement>()
let editor: monaco.editor.IStandaloneCodeEditor | null = null

const currentLang = ref(labelToMonaco[props.language || 'Java'] || 'java')

function initEditor() {
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

function setLanguage(lang: string) {
  const model = editor?.getModel()
  if (model) monaco.editor.setModelLanguage(model, lang)
}

function handleLangChange(val: string) {
  setLanguage(val)
  const label = monacoToLabel[val]
  if (label) emit('language-change', label)
}

watch(() => props.language, (label) => {
  const monacoLang = label && labelToMonaco[label]
  if (monacoLang && monacoLang !== currentLang.value) {
    currentLang.value = monacoLang
    setLanguage(monacoLang)
  }
})

onMounted(initEditor)
onBeforeUnmount(() => editor?.dispose())
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
