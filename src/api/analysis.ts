import request from './request'

export interface AnalyzeParams {
  title: string
  remark?: string
  problemContent: string
  language: string
  code: string
}

export interface AnalyzeResponse {
  recordId: number
  summary: string
  algorithmIdea: string
  errorAnalysis: string
  edgeCases: string[]
  timeComplexity: string
  spaceComplexity: string
  optimization: string
  teachingGuide: string
  nextSteps: string[]
}

export function analyze(data: AnalyzeParams) {
  return request.post<any, { code: number; data: AnalyzeResponse }>('/problems/analyze', data, {
    timeout: 120000
  })
}

// 历史记录列表项（增加 summary 字段）
export interface HistoryItem {
  id: number
  title: string
  language: string
  createdAt: string
  summary: string   // 分析摘要
}

export const getHistory = (params?: { page?: number; size?: number; title?: string; language?: string; startDate?: string; endDate?: string }) => {
  return request.get('/analysis/history', { params })
}

export const getDetail = (id: number) => {
  return request.get(`/analysis/${id}`)
}

export const deleteRecord = (id: number) => {
  return request.delete(`/analysis/${id}`)
}