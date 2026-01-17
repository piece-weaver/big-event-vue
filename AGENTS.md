# AGENTS.md - Big Event Vue Project Guidelines

## Project Overview

Vue 3 CMS with Composition API, Vite, Element Plus, Pinia, Vue Router, Axios, VueQuill, and SCSS. API proxies to `http://localhost:8080` via `/api`.

## Build Commands

```bash
npm run dev          # Dev server at http://localhost:5173
npm run build        # Build to dist/
npm run preview      # Preview production build
npm install          # Install dependencies
```

**No lint/test commands available.** Manual review required.

## Directory Structure

```
src/
├── api/           # API services (Feature+Service naming)
├── assets/        # Static assets, global SCSS
├── components/    # Reusable components (PascalCase)
│   ├── Common/    # Common components
│   └── Layout/    # Layout components
├── composables/   # Composables (useXxx pattern)
├── constants/     # Constants
├── router/        # Vue Router with navigation guards
├── stores/        # Pinia stores (setup syntax, persistence)
├── types/         # Type definitions
├── utils/         # Utilities (request.js with axios)
└── views/         # Page components (feature folders)
    ├── article/   # Article pages
    └── user/      # User pages
```

## Code Style

### Imports

Order: Vue → Router/Pinia → Element Plus → Project modules → Utils. Use double quotes.

```javascript
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { userLoginService } from '@/api/user.js'
import { useTokenStore } from '@/stores/token.js'
```

### Naming Conventions

| Type              | Convention      | Example                    |
|-------------------|-----------------|----------------------------|
| Components        | PascalCase      | `PageHeader.vue`           |
| Files             | kebab-case      | `user-login.js`            |
| Vars/functions    | camelCase       | `userInfo`, `fetchData`    |
| Constants         | UPPER_SNAKE     | `API_BASE_URL`             |
| Composables       | `use` prefix    | `useAuth`                  |
| Stores            | camelCase       | `token.js`                 |
| API functions     | Feature+Service | `userLoginService`         |
| Props             | camelCase       | `pageTitle`, `isLoading`   |

### Composition API

```javascript
const props = defineProps({
  title: { type: String, required: true },
  isLoading: { type: Boolean, default: false }
})

const emit = defineEmits(['update', 'delete'])

const loading = ref(false)
const tableData = ref([])

const fetchData = async () => {
  loading.value = true
  try {
    const res = await someApiService()
    tableData.value = res.data
  } catch (error) {
    console.error('Failed:', error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}
```

### State Management (Pinia)

```javascript
export const useTokenStore = defineStore('token', () => {
  const token = ref('')
  const setToken = (v) => { token.value = v }
  const removeToken = () => { token.value = '' }
  return { token, setToken, removeToken }
}, { persist: { enabled: true, strategies: [{ key: 'token', storage: localStorage }] } })
```

### API Layer (`src/api/{feature}.js`)

```javascript
export const userLoginService = (loginData) => {
  return request.post('/user/login', loginData)
}
```

### Error Handling

- Centralized in `src/utils/request.js` interceptor
- Components use try-catch with `console.error()` and `ElMessage.error()`
- `ElMessageBox.confirm()` for confirmations

```javascript
try {
  await someService()
  ElMessage.success('操作成功')
} catch (error) {
  console.error('Failed:', error)
  ElMessage.error(error.response?.data?.message || '操作失败')
}
```

### Templates (Element Plus)

```vue
<el-table :data="tableData" v-loading="loading">
  <el-table-column prop="title" label="标题" />
  <el-table-column label="操作">
    <template #default="{ row }">
      <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
    </template>
  </el-table-column>
</el-table>
```

### Styling

- SCSS with `lang="scss" scoped`
- 2-space indentation
- Use `:deep()` for Element Plus overrides
- Use global utility classes from `global.scss` (`.flex`, `.text-center`, `.mt-4`, etc.)

## Key Conventions

1. All API calls through `src/api/` services
2. Use `@/` alias for all `src/` imports
3. Use Element Plus for UI components
4. Handle errors via centralized interceptor
5. Pinia with persistence for auth state
6. Always use `<script setup>` syntax
7. Lazy load route components
8. Responsive breakpoint: 768px

## Additional Features

### Login Page Features

#### Remember Me
- Uses `localStorage` with key `big_event_login_remember`
- Password stored with Base64 encoding (basic obfuscation, not security encryption)
- Load saved credentials on page mount via `loadRemember()`
- Save/clear credentials on login via `saveRemember()`

```javascript
const REMEMBER_KEY = 'big_event_login_remember'
const encodePassword = (password) => btoa(password)
const decodePassword = (encoded) => atob(encoded)
```

#### Enter Key Login
- Global keydown listener for Enter key
- Only active on login form (not register form)
- Triggers form validation and login

```javascript
const handleKeydown = (event) => {
  if (event.key === 'Enter' && !isRegister.value) {
    event.preventDefault()
    login()
  }
}
```

#### Forgot Password Dialog
- Modal dialog for password recovery
- Email format validation
- Mock code sending (requires backend API for full functionality)

### Home Page

- Statistics cards (articles, published, drafts, categories)
- Recent articles list (max 5 items)
- Quick action buttons

### Tags View

- Auto-add visited pages to tags
- Affix tags (home page, not closable)
- Close tag with navigation to last tag
- Dropdown menu: refresh, close others, close all
- Persistence via localStorage


