import request from './request'

export interface LoginParams {
  username: string
  password: string
}

export interface RegisterParams {
  username: string
  password: string
}

export interface UserInfo {
  id: number
  username: string
}

export interface LoginData {
  token: string
  user: UserInfo
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export const login = (data: LoginParams): Promise<ApiResponse<LoginData>> => {
  return request.post<ApiResponse<LoginData>, ApiResponse<LoginData>>('/auth/login', data)
}

export const register = (data: RegisterParams): Promise<ApiResponse<null>> => {
  return request.post<ApiResponse<null>, ApiResponse<null>>('/auth/register', data)
}