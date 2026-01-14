export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface PaginationParams {
  pageNum: number
  pageSize: number
  categoryId?: number | null
  state?: string | null
}

export interface PaginationData<T = any> {
  total: number
  items: T[]
}

export interface UserInfo {
  id: number
  username: string
  nickname: string
  email: string
  userPic: string
  createTime: string
  updateTime: string
}

export interface Category {
  id: number
  categoryName: string
  categoryAlias: string
  createTime: string
  updateTime: string
}

export interface Article {
  id: number
  title: string
  content: string
  coverImg: string
  state: string
  categoryId: number
  categoryName?: string
  createTime: string
  updateTime: string
}

export interface LoginData {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  password: string
  rePassword: string
}

export interface UpdatePasswordData {
  oldPwd: string
  newPwd: string
  rePwd: string
}

export interface UpdateAvatarData {
  avatarUrl: string
}

export interface UpdateUserInfoData {
  id: number
  username?: string
  nickname: string
  email: string
}

export interface CategoryFormData {
  categoryName: string
  categoryAlias: string
  id?: number
}

export interface ArticleFormData {
  title: string
  categoryId: number
  coverImg: string
  content: string
  state: string
  id?: number
}