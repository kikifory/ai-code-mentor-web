import request from './request'

export interface AnalyzeParams {
  title: string
  remark?: string
  problemContent: string
  language: string
  code: string
}

export interface HistoryItem {
  id: number
  title: string
  language: string
  createdAt: string
  summary: string
}

export interface ReportDetail {
  id: number
  title: string
  language: string
  code: string
  summary: string
  algorithmIdea: string
  errorAnalysis: string
  edgeCases: string[] | string
  timeComplexity: string
  spaceComplexity: string
  optimization: string
  teachingGuide: string
  nextSteps: string[] | string
  createdAt: string
}

export interface ConversationItem {
  id: number
  question: string
  answer: string
  createdAt: string
}

export interface HistoryQuery {
  page?: number
  size?: number
  title?: string
  language?: string
  startDate?: string
  endDate?: string
}

export const analyze = (data: AnalyzeParams) =>
  request.post('/problems/analyze', data, { timeout: 120000 })

export const getHistory = (params?: HistoryQuery) =>
  request.get('/analysis/history', { params })

export const getDetail = (id: number) =>
  request.get(`/analysis/${id}`)

export const deleteRecord = (id: number) =>
  request.delete(`/analysis/${id}`)

export const getConversations = (id: number) =>
  request.get(`/analysis/${id}/conversations`)

export const askQuestion = (id: number, question: string) =>
  request.post(`/analysis/${id}/ask`, { question })
