# Big Event CMS - Vue 3 内容管理系统

<div align="center">

![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat-square&logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat-square&logo=vite)
![Element Plus](https://img.shields.io/badge/Element%20Plus-2.9-409EFF?style=flat-square&logo=element)
![Pinia](https://img.shields.io/badge/Pinia-2.3-Yellow?style=flat-square&logo=pinia)

基于 Vue 3、Vite 和 Element Plus 构建的现代化内容管理系统前端。

[English](README.md) | [中文](README_CN.md)

</div>

## 简介

Big Event CMS 是一款专业的内容管理系统前端，提供用户管理、文章发布和分类管理功能。采用 Vue 3 Composition API 和现代 Web 技术构建。

## 技术栈

- **框架**: Vue 3.5+ 组合式 API
- **构建工具**: Vite 6
- **UI 框架**: Element Plus 2.9+
- **状态管理**: Pinia 2.3+ 持久化存储
- **路由**: Vue Router 4.5+
- **HTTP 客户端**: Axios
- **富文本编辑器**: @vueup/vue-quill
- **样式**: SCSS 设计令牌系统

## 功能特性

### 用户管理
- 用户注册与登录（JWT 认证）
- 用户资料管理（昵称、邮箱）
- 头像上传与预览
- 密码重置与验证

### 文章管理
- 文章分类 CRUD 操作
- 富文本编辑器管理文章内容
- 按分类/状态搜索筛选
- 封面图片上传
- 草稿/发布状态管理

### 系统功能
- 路由守卫与权限控制
- 响应式设计（移动端适配）
- 统一错误处理
- 持久化存储（Token、用户信息）
- 加载状态与骨架屏

## 项目结构

```
big-event-vue/
├── docs/                          # 项目文档
│   └── API_DOCUMENTATION.md       # API 文档
├── public/                        # 静态资源
│   └── favicon.ico
├── src/                           # 源代码
│   ├── api/                       # API 服务
│   │   ├── article.js             # 文章相关 API
│   │   ├── category.js            # 分类相关 API
│   │   ├── user.js                # 用户相关 API
│   │   ├── upload.js              # 上传相关 API
│   │   └── index.js               # API 导出
│   ├── assets/                    # 静态资源
│   │   ├── images/                # 图片资源
│   │   ├── main.scss              # 主样式文件
│   │   ├── global.scss            # 全局样式
│   │   ├── variables.scss         # 设计令牌
│   │   └── breakpoints.scss       # 响应式断点
│   ├── components/                # 可复用组件
│   │   ├── Layout/                # 布局组件
│   │   │   ├── Breadcrumb.vue     # 面包屑导航
│   │   │   ├── SidebarLogo.vue    # 侧边栏 Logo
│   │   │   └── TagsView.vue       # 标签页视图
│   │   └── Common/                # 公共组件
│   │       ├── PageContainer.vue  # 页面容器
│   │       └── SkeletonLoading.vue# 加载骨架屏
│   ├── constants/                 # 常量定义
│   │   └── index.js               # 项目常量
│   ├── router/                    # 路由配置
│   │   └── index.js               # 路由定义
│   ├── stores/                    # Pinia 状态管理
│   │   ├── token.js               # Token 存储
│   │   ├── userInfo.js            # 用户信息存储
│   │   └── tagsView.js            # 标签页存储
│   ├── types/                     # 类型定义
│   │   └── index.js               # JSDoc 类型
│   ├── utils/                     # 工具函数
│   │   └── request.js             # Axios 封装
│   ├── views/                     # 页面组件
│   │   ├── article/               # 文章相关页面
│   │   │   ├── ArticleCategory.vue
│   │   │   └── ArticleManage.vue
│   │   ├── user/                  # 用户相关页面
│   │   │   ├── UserAvatar.vue
│   │   │   ├── UserInfo.vue
│   │   │   └── UserResetPassword.vue
│   │   ├── Home.vue               # 首页
│   │   ├── Login.vue              # 登录页
│   │   ├── Main.vue               # 主布局
│   │   └── Redirect.vue           # 重定向页
│   ├── App.vue                    # 根组件
│   └── main.js                    # 入口文件
├── .gitignore                     # Git 忽略规则
├── .vscode/                       # VS Code 设置
│   └── extensions.json            # 推荐扩展
├── AGENTS.md                      # AI 代理指南
├── index.html                     # HTML 模板
├── jsconfig.json                  # JS 配置
├── package.json                   # 项目依赖
├── vite.config.js                 # Vite 配置
└── README.md                      # 英文说明文档
```

## 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

开发服务器运行在 `http://localhost:5173`

### 生产构建

```bash
npm run build
```

构建输出将在 `dist` 目录中。

### 预览构建

```bash
npm run preview
```

## API 配置

前端通过 `/api` 代理将 API 请求转发到后端服务器。

**默认配置**（在 `vite.config.js` 中）:
- 后端 URL: `http://localhost:8080`
- 代理路径: `/api`
- 超时时间: 30000ms

## 开发规范

### 代码风格

- **组件**: PascalCase（如 `PageHeader.vue`）
- **文件**: kebab-case（如 `user-login.js`）
- **变量/函数**: camelCase（如 `userInfo`）
- **常量**: UPPER_SNAKE_CASE（如 `API_BASE_URL`）
- **组合式函数**: `use` 前缀（如 `useAuth`）
- **缩进**: 2 空格
- **导入**: 双引号

### 目录约定

```
src/
├── api/           # 所有 API 服务函数
├── assets/        # 静态资源和全局样式
├── components     # 可复用 Vue 组件
├── composables    # 组合式函数 (useXxx)
├── constants      # 项目常量
├── router         # Vue Router 配置
├── stores         # Pinia 状态管理
├── types          # TypeScript 接口
├── utils          # 工具函数
└── views          # 页面组件
```

### API 层模式

```javascript
// src/api/user.js
import request from '@/utils/request.js'

export const userLoginService = (loginData) => {
  return request.post('/user/login', loginData)
}

export const userInfoService = () => {
  return request.get('/user/userInfo')
}
```

### 状态管理 (Pinia)

```javascript
// src/stores/token.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTokenStore = defineStore('token', () => {
  const token = ref('')
  const isAuthenticated = computed(() => !!token.value)
  const setToken = (newToken) => { token.value = newToken }
  const removeToken = () => { token.value = '' }
  return { token, isAuthenticated, setToken, removeToken }
}, { persist: { enabled: true } })
```

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 后端集成

此前端设计用于与 Big Event 后端配合使用：

- 后端仓库: [big-event (Go)](https://github.com/piece-weaver/big-event)
- 确保后端运行在 `http://localhost:8080`

## 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m '添加新功能'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 开源协议

本项目基于 MIT 许可证开源 - 详见 [LICENSE](LICENSE.txt) 文件。

## 致谢

- [Vue.js](https://vuejs.org/)
- [Element Plus](https://element-plus.org/)
- [Vite](https://vitejs.dev/)
- [Pinia](https://pinia.vuejs.org/)
