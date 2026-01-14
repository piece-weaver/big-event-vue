# 大事件前端项目

## 项目简介

大事件（Big Event）是一个基于Vue 3 + Vite的内容管理系统前端项目，提供用户管理、文章发布、分类管理等功能。项目严格按照后端API文档规范开发，确保前后端数据交互的一致性和完整性。
后端项目地址：https://github.com/piece-weaver/big-event

效果图展示：
<img src="https://big-event-demo-123.oss-cn-beijing.aliyuncs.com/big_event_cover.png" alt="登录页面" style="zoom:50%;" />

<img src="https://big-event-demo-123.oss-cn-beijing.aliyuncs.com/big_event_cover_article.png" alt="文章页面" style="zoom:50%;" />

<img src="https://big-event-demo-123.oss-cn-beijing.aliyuncs.com/big_event_cover_category.png" alt="分类页面" style="zoom:50%;" />

## 技术栈

- **框架**: Vue 3.5.13
- **构建工具**: Vite 6.0.11
- **UI框架**: Element Plus 2.9.3
- **状态管理**: Pinia 2.3.1
- **路由**: Vue Router 4.5.0
- **HTTP客户端**: Axios 1.7.9
- **富文本编辑器**: @vueup/vue-quill
- **样式预处理**: Sass 1.83.4

## 项目结构

```
big-event/
├── docs/                      # 项目文档
│   ├── API_DOCUMENTATION.md    # API接口文档（完整版）
│   └── README.md              # 文档说明
├── public/                     # 静态资源
│   └── favicon.ico
├── src/                       # 源代码目录
│   ├── api/                # API接口
│   │   ├── article.js     # 文章相关API
│   │   ├── category.js    # 分类相关API
│   │   ├── user.js        # 用户相关API
│   │   ├── upload.js      # 上传相关API
│   │   ├── config.js      # API配置
│   │   └── index.js       # API统一导出
│   ├── assets/             # 静态资源
│   │   ├── images/        # 图片资源
│   │   │   ├── avatar.jpg
│   │   │   ├── cover.jpg
│   │   │   ├── default.png
│   │   │   ├── login_bg.jpg
│   │   │   ├── logo.png
│   │   │   └── logo2.png
│   │   ├── main.scss      # 主样式文件
│   │   └── global.scss     # 全局样式
│   ├── components/          # 公共组件
│   │   └── PageHeader.vue # 页面头部组件
│   ├── composables/         # 组合式函数
│   │   └── useAuth.js     # 认证相关逻辑
│   ├── constants/           # 常量定义
│   │   └── index.js       # 项目常量（错误码、验证规则等）
│   ├── router/              # 路由配置
│   │   └── index.js       # 路由定义
│   ├── stores/              # 状态管理
│   │   ├── token.js       # Token状态
│   │   └── userInfo.js    # 用户信息状态
│   ├── types/               # 类型定义
│   │   └── index.js       # TypeScript类型（JSDoc风格）
│   ├── utils/               # 工具函数
│   │   └── request.js     # Axios封装（含请求拦截、响应拦截、错误处理）
│   ├── views/               # 页面组件
│   │   ├── article/       # 文章管理页面
│   │   │   ├── ArticleCategory.vue
│   │   │   └── ArticleManage.vue
│   │   ├── user/          # 用户管理页面
│   │   │   ├── UserAvatar.vue
│   │   │   ├── UserInfo.vue
│   │   │   └── UserResetPassword.vue
│   │   ├── Login.vue       # 登录页面
│   │   └── Main.vue        # 主布局页面
│   ├── App.vue              # 根组件
│   └── main.js              # 入口文件
├── .gitignore              # Git忽略文件
├── index.html              # HTML模板
├── jsconfig.json           # JS配置
├── package.json            # 项目配置
├── vite.config.js         # Vite配置
└── README.md              # 项目说明
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

开发服务器默认运行在 `http://localhost:5173`

### 生产构建

```bash
npm run build
```

构建产物将输出到 `dist` 目录

### 预览构建

```bash
npm run preview
```

## 主要功能

### 用户管理
- 用户注册/登录（支持JWT认证）
- 用户信息管理（昵称、邮箱）
- 头像上传（支持图片格式）
- 密码修改（含原密码验证）

### 文章管理
- 文章分类管理（CRUD）
- 文章内容管理（CRUD）
- 文章搜索和筛选（按分类、状态）
- 富文本编辑器（支持图片上传）
- 文章封面图片上传
- 文章状态管理（草稿/已发布）

### 系统功能
- 路由守卫和权限控制
- 响应式设计
- 错误处理和提示
- 持久化存储（Token、用户信息）
- 请求防重复提交
- 加载状态显示

## 开发规范

### 命名规范
- 组件：PascalCase（如：PageHeader.vue）
- 文件：kebab-case（如：use-auth.js）
- 变量：camelCase（如：userInfo）
- 常量：UPPER_SNAKE_CASE（如：API_BASE_URL）

### 代码风格
- 使用2空格缩进
- 单引号优先
- 函数和类使用驼峰命名
- 组件使用组合式API
- 遵循ESLint规则

### 目录结构规范
- 按功能模块组织代码
- 公共组件放在components目录
- 业务逻辑放在composables目录
- 类型定义放在types目录
- 常量定义放在constants目录

## API接口

### 基础配置

- Base URL: `/api`
- 超时时间: 30000ms
- 认证方式: JWT Bearer Token

### API接口说明

项目API接口文档位于 `docs/API_DOCUMENTATION.md`，包含完整的接口说明。

### 请求示例

```javascript
import { userLoginService } from '@/api/user.js'

const login = async () => {
  try {
    const result = await userLoginService({
      username: 'admin',
      password: '123456'
    })
    console.log('登录成功:', result.data)
  } catch (error) {
    console.error('登录失败:', error)
  }
}
```

### 错误处理

项目已实现统一的错误处理机制：

1. **请求拦截器**：自动添加Token到请求头
2. **响应拦截器**：统一处理错误响应
3. **错误码映射**：将后端错误码转换为友好的错误提示
4. **请求取消**：防止重复请求

### 错误码说明

| 错误码 | 说明 |
|--------|------|
| 0 | 操作成功 |
| 1001 | 用户名已存在 |
| 1002 | 用户名或密码错误 |
| 1006 | 原密码错误 |
| 1007 | 新密码与原密码一致 |
| 1008 | 新密码与确认密码不一致 |
| 2001 | 分类不存在 |
| 2002 | 分类下存在文章，无法删除 |
| 2003 | 文章不存在 |
| 3001 | 文件上传失败 |
| 3002 | 文件格式不支持 |
| 4002 | 必要参数不能为空 |
| 4003 | 参数格式错误 |

## 数据验证规则

### 用户相关
- 用户名：5-16位非空字符
- 密码：5-16位非空字符
- 昵称：1-10位非空字符
- 邮箱：标准邮箱格式

### 分类相关
- 分类名称：1-50位非空字符
- 分类别名：1-50位非空字符

### 文章相关
- 文章标题：1-100位非空字符
- 文章内容：非空
- 文章分类：必选
- 文章状态：0（草稿）或1（已发布）

## 状态管理

### Token Store
```javascript
import { useTokenStore } from '@/stores/token.js'

const tokenStore = useTokenStore()
tokenStore.setToken('your-jwt-token')
tokenStore.removeToken()
console.log(tokenStore.token)
console.log(tokenStore.isAuthenticated())
```

### User Info Store
```javascript
import useUserInfoStore from '@/stores/userInfo.js'

const userInfoStore = useUserInfoStore()
userInfoStore.setInfo({ id: 1, username: 'admin' })
userInfoStore.updateInfo({ nickname: '管理员' })
userInfoStore.removeInfo()
```

## 路由配置

### 路由守卫

项目实现了路由守卫，确保未登录用户只能访问登录页面：

```javascript
router.beforeEach((to, from, next) => {
  const tokenStore = useTokenStore()
  const isAuthenticated = tokenStore.isAuthenticated()

  if (to.path === '/login') {
    if (isAuthenticated) {
      next('/')
    } else {
      next()
    }
  } else {
    if (isAuthenticated) {
      next()
    } else {
      ElMessage.warning('请先登录')
      next('/login')
    }
  }
})
```

### 路由列表

| 路径 | 组件 | 说明 |
|------|------|------|
| /login | Login.vue | 登录页面 |
| / | Main.vue | 主布局 |
| /article/category | ArticleCategory.vue | 文章分类 |
| /article/manage | ArticleManage.vue | 文章管理 |
| /user/info | UserInfo.vue | 基本资料 |
| /user/avatar | UserAvatar.vue | 更换头像 |
| /user/resetpassword | UserResetPassword.vue | 重置密码 |

## 性能优化

### 已实现的优化

1. **路由懒加载**：所有页面组件使用动态导入
2. **请求防重复**：使用CancelToken防止重复请求
3. **状态持久化**：使用Pinia持久化插件
4. **加载状态**：所有数据加载操作都有loading状态
5. **代码分割**：Vite自动进行代码分割

### 组件优化

- 使用`v-loading`指令显示加载状态
- 表单验证使用Element Plus内置验证
- 图片上传使用Element Plus Upload组件
- 富文本编辑器使用@vueup/vue-quill

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 部署指南

### 开发环境

1. 克隆项目
2. 安装依赖：`npm install`
3. 启动开发服务器：`npm run dev`
4. 访问 `http://localhost:5173`

### 生产环境

1. 构建项目：`npm run build`
2. 将`dist`目录部署到Web服务器
3. 配置服务器代理（如需要）

### 环境变量

项目支持通过环境变量配置API地址：

```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

## 常见问题

### 1. 跨域问题

开发环境已配置代理，生产环境需要在服务器端配置CORS。

### 2. Token过期

Token过期时会自动跳转到登录页面，并清除本地存储的Token。

### 3. 图片上传失败

确保上传接口地址正确，且服务器支持文件上传。

### 4. 富文本编辑器样式

富文本编辑器使用Snow主题，如需自定义样式，可在组件中覆盖样式。

## 开发注意事项

1. **API调用**：所有API调用都应使用`src/api`目录下的服务函数
2. **错误处理**：不要在组件中重复处理错误，使用统一的错误处理机制
3. **状态管理**：使用Pinia进行状态管理，避免直接操作localStorage
4. **路由跳转**：使用`router.push()`进行路由跳转
5. **表单验证**：使用Element Plus的表单验证规则
6. **代码注释**：保持代码简洁，避免不必要的注释

## 更新日志

### v1.0.0 (2026-01-13)
- 初始版本发布
- 实现用户管理功能
- 实现文章分类管理功能
- 实现文章管理功能
- 实现文件上传功能
- 完善错误处理机制
- 优化用户体验

## 许可证

MIT

## 联系方式

如有问题或建议，请联系开发团队。
