# AGENTS.md - Big Event Vue Project Guidelines

This document provides comprehensive guidelines and instructions for AI agents working on this Vue 3 content management system.

## Project Overview

**Tech Stack:**
- Vue 3.5+ with Composition API and `<script setup>` syntax
- Vite 6 as build tool and development server
- Element Plus 2.9+ for UI components (Chinese locale)
- Pinia 2.3+ for state management with persistence
- Vue Router 4.5+ for routing
- Axios for HTTP requests
- VueQuill for rich text editing
- SCSS for styling

**Architecture:**
- All API calls route through `/api` proxy to backend at `http://localhost:8080`
- Frontend runs on `http://localhost:5173`
- Token-based authentication with localStorage persistence

## Build Commands

```bash
npm run dev          # Start dev server at http://localhost:5173
npm run build        # Build for production (outputs to dist/)
npm run preview      # Preview production build locally
npm install          # Install dependencies
```

**No test suite currently exists.** Manual code review is required.

## Directory Structure

```
src/
├── api/              # API service functions (named exports with Service suffix)
├── assets/           # Static assets (images, global SCSS)
│   ├── images/       # PNG, JPG assets (logos, backgrounds)
│   ├── main.scss     # Main entry styles (transitions, animations)
│   └── global.scss   # Global styles (utility classes, component overrides)
├── components/       # Reusable Vue components (PascalCase)
├── composables/      # Composables (useXxx pattern)
├── constants/        # Project constants
├── router/           # Vue Router configuration with navigation guards
├── stores/           # Pinia stores (setup syntax with persistence)
├── types/            # TypeScript interfaces (or JSDoc type definitions)
├── utils/            # Utility functions (request.js with axios interceptor)
├── views/            # Page components (organized by feature folder)
│   ├── Login.vue     # Login page
│   ├── Main.vue      # Layout wrapper (el-container with sidebar)
│   ├── article/      # Article management feature
│   └── user/         # User profile feature
├── App.vue           # Root component
└── main.js           # Application entry point (plugins configuration)
```

## Code Style Guidelines

### Imports

**Order:** Vue core → Vue Router/Pinia → Element Plus → Project modules → Utils/Constants

**Syntax:** Use double quotes for all imports, single quotes for string literals elsewhere.

```javascript
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { userLoginService } from '@/api/user.js'
import { useTokenStore } from '@/stores/token.js'
import request from '@/utils/request.js'
```

### Naming Conventions

| Type               | Convention      | Example                      |
|--------------------|-----------------|------------------------------|
| Components         | PascalCase      | `PageHeader.vue`, `UserCard` |
| Regular files      | kebab-case      | `user-login.js`, `use-auth`  |
| Variables/functions| camelCase       | `userInfo`, `articleList`    |
| Constants          | UPPER_SNAKE_CASE| `API_BASE_URL`, `MAX_SIZE`   |
| Composables        | `use` prefix    | `useAuth`, `useForm`         |
| Stores             | camelCase       | `token.js`, `userInfo.js`    |
| Props              | camelCase       | `pageTitle`, `isLoading`     |
| API functions      | Feature + Service| `userLoginService`          |

### Composition API

```javascript
const props = defineProps({
  title: { type: String, required: true },
  isLoading: { type: Boolean, default: false },
  data: { type: Array, default: () => [] }
})

const emit = defineEmits(['update', 'delete', 'refresh'])

const loading = ref(false)
const tableData = ref([])

const fetchData = async () => {
  loading.value = true
  try {
    const result = await someApiService()
    tableData.value = result.data
  } catch (error) {
    console.error('Failed to fetch data:', error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}
```

### State Management (Pinia)

```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTokenStore = defineStore('token', () => {
  const token = ref('')

  const isAuthenticated = computed(() => !!token.value)

  const setToken = (newToken) => { token.value = newToken }
  const removeToken = () => { token.value = '' }

  return { token, isAuthenticated, setToken, removeToken }
}, { persist: { enabled: true, strategies: [{ key: 'token', storage: localStorage }] } })
```

### API Layer

**File:** `src/api/{feature}.js`

```javascript
import request from '@/utils/request.js'

export const userLoginService = (loginData) => {
  return request.post('/user/login', loginData)
}

export const userInfoService = () => {
  return request.get('/user/profile')
}

export const articleListService = (params) => {
  return request.get('/article/list', { params })
}
```

**Rules:**
- Use named exports only
- Prefix functions with feature name and `Service` suffix
- Never make axios calls directly in components
- Handle errors in components using try-catch

### Error Handling

- Centralized error handling in `src/utils/request.js` interceptor
- Components catch errors with try-catch and log via `console.error()`
- User-facing errors use `ElMessage.error()`
- Confirmations use `ElMessageBox.confirm()`

```javascript
try {
  await someService()
  ElMessage.success('操作成功')
} catch (error) {
  console.error('Operation failed:', error)
  ElMessage.error(error.response?.data?.message || '操作失败')
}
```

### HTTP Requests

**Configuration:** `src/utils/request.js`
- Base URL: `/api` (proxied to `http://localhost:8080`)
- Timeout: 30000ms
- Auth: Bearer token via interceptor
- 401 handling: Clear token, redirect to `/login`

```javascript
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useTokenStore } from '@/stores/token.js'

const request = axios.create({
  baseURL: '/api',
  timeout: 30000
})

request.interceptors.request.use((config) => {
  const tokenStore = useTokenStore()
  if (tokenStore.token) {
    config.headers.Authorization = `Bearer ${tokenStore.token}`
  }
  return config
})

request.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const tokenStore = useTokenStore()
      tokenStore.removeToken()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default request
```

### VueQuill Editor

**Usage:** Import from `@vueup/vue-quill`

```javascript
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

components: { QuillEditor }

<QuillEditor
  theme="snow"
  v-model:content="content"
  contentType="html"
  toolbar="full"
  class="editor"
/>
```

### Routing

**File:** `src/router/index.js`

```javascript
const routes = [
  { path: '/login', component: () => import('@/views/Login.vue') },
  {
    path: '/',
    component: () => import('@/views/Main.vue'),
    redirect: '/article/manage',
    children: [
      { path: '/article/category', component: () => import('@/views/article/ArticleCategory.vue') },
      { path: '/article/manage', component: () => import('@/views/article/ArticleManage.vue') },
      { path: '/user/info', component: () => import('@/views/user/UserInfo.vue') },
      { path: '/user/avatar', component: () => import('@/views/user/UserAvatar.vue') },
      { path: '/user/resetpassword', component: () => import('@/views/user/UserResetPassword.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '大事件管理系统'
  const tokenStore = useTokenStore()
  if (!tokenStore.isAuthenticated && to.path !== '/login') {
    next('/login')
  } else {
    next()
  }
})
```

### Styling

**Guidelines:**
- Use SCSS with `lang="scss"` and `scoped` attribute
- 2-space indentation
- Flexbox for layout (avoid floats)
- Use global utility classes from `global.scss`
- Element Plus component overrides via `:deep()` selector

**Utility Classes:**
```scss
.flex                    // display: flex; align-items: center; justify-content: space-between
.text-center             // text-align: center
.text-right              // text-align: right
.mt-10, .mt-20           // margin-top
.mb-10, .mb-20           // margin-bottom
.pt-10, .pt-20           // padding-top
.pb-10, .pb-20           // padding-bottom
.page-container          // min-height: 100%; box-sizing: border-box
```

**Component Style Pattern:**
```vue
<style lang="scss" scoped>
.component-name {
  height: 100%;
  display: flex;
  flex-direction: column;

  :deep(.el-inner-class) {
    // Override Element Plus styles
  }
}
</style>
```

### Templates

**Element Plus Components:**
- Tables with `v-loading` for loading states
- Forms with `v-model` bindings and validation
- Dialogs and drawers for CRUD operations
- Pagination with `el-pagination`

```vue
<el-table :data="tableData" style="width: 100%" v-loading="loading">
  <el-table-column prop="title" label="标题" />
  <el-table-column prop="categoryName" label="分类" />
  <el-table-column label="操作">
    <template #default="{ row }">
      <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
    </template>
  </el-table-column>
</el-table>

<el-pagination
  v-model:current-page="currentPage"
  v-model:page-size="pageSize"
  :total="total"
  :page-sizes="[10, 20, 50]"
  layout="total, sizes, prev, pager, next, jumper"
/>
```

## Global Styles

**File:** `src/assets/global.scss`

Contains:
- Reset styles (margin: 0, padding: 0, box-sizing: border-box)
- Typography (font-family, colors, text decoration)
- Utility classes (.flex, .text-center, spacing classes)
- Component overrides (el-table, el-dialog, el-drawer, el-card, el-form)
- Transition animations (fade-slide)
- Responsive breakpoints (max-width: 768px)

## Key Conventions

1. All API calls go through `src/api/` services
2. Use `@/` alias for all `src/` imports
3. Use Element Plus for all UI components
4. Handle errors via centralized request interceptor
5. Use Pinia with persistence for token/user state
6. 2-space indentation, double quotes in imports
7. Always use `<script setup>` syntax
8. Lazy load route components
9. Responsive design for mobile (breakpoint: 768px)
