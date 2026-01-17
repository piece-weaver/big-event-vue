# Big Event CMS - Vue 3 Content Management System

<div align="center">

![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat-square&logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat-square&logo=vite)
![Element Plus](https://img.shields.io/badge/Element%20Plus-2.9-409EFF?style=flat-square&logo=element)
![Pinia](https://img.shields.io/badge/Pinia-2.3-Yellow?style=flat-square&logo=pinia)

A modern content management system frontend built with Vue 3, Vite, and Element Plus.

[English](README.md) | [中文](README_CN.md)

</div>

## Overview

Big Event CMS is a professional content management system frontend that provides user management, article publishing, and category management features. Built with Vue 3 Composition API and modern web technologies.

## Tech Stack

- **Framework**: Vue 3.5+ with Composition API
- **Build Tool**: Vite 6
- **UI Framework**: Element Plus 2.9+
- **State Management**: Pinia 2.3+ with persistence
- **Routing**: Vue Router 4.5+
- **HTTP Client**: Axios
- **Rich Text Editor**: @vueup/vue-quill
- **Styling**: SCSS with Design Tokens

## Features

### User Management
- User registration and login (JWT authentication)
- User profile management (nickname, email)
- Avatar upload with image preview
- Password reset with validation

### Article Management
- Article category CRUD operations
- Article content management with rich text editor
- Search and filter by category/status
- Cover image upload
- Draft/Published state management

### System Features
- Route guards and permission control
- Responsive design (mobile-friendly)
- Unified error handling
- Persistent storage (Token, User Info)
- Loading states and skeleton screens

## Project Structure

```
big-event-vue/
├── docs/                          # Project documentation
│   └── API_DOCUMENTATION.md       # API documentation
├── public/                        # Static assets
│   └── favicon.ico
├── src/                           # Source code
│   ├── api/                       # API services
│   │   ├── article.js             # Article APIs
│   │   ├── category.js            # Category APIs
│   │   ├── user.js                # User APIs
│   │   ├── upload.js              # Upload APIs
│   │   └── index.js               # API exports
│   ├── assets/                    # Static assets
│   │   ├── images/                # Images
│   │   ├── main.scss              # Main styles
│   │   ├── global.scss            # Global styles
│   │   ├── variables.scss         # Design tokens
│   │   └── breakpoints.scss       # Responsive breakpoints
│   ├── components/                # Reusable components
│   │   ├── Layout/                # Layout components
│   │   │   ├── Breadcrumb.vue     # Breadcrumb navigation
│   │   │   └── SidebarLogo.vue    # Sidebar logo
│   │   └── Common/                # Common components
│   │       ├── PageContainer.vue  # Page container
│   │       └── SkeletonLoading.vue# Loading skeleton
│   ├── constants/                 # Constants
│   │   └── index.js               # Project constants
│   ├── router/                    # Router configuration
│   │   └── index.js               # Route definitions
│   ├── stores/                    # Pinia stores
│   │   ├── token.js               # Token store
│   │   └── userInfo.js            # User info store
│   ├── types/                     # Type definitions
│   │   └── index.js               # JSDoc types
│   ├── utils/                     # Utilities
│   │   └── request.js             # Axios wrapper
│   ├── views/                     # Page components
│   │   ├── article/               # Article pages
│   │   │   ├── ArticleCategory.vue
│   │   │   └── ArticleManage.vue
│   │   ├── user/                  # User pages
│   │   │   ├── UserAvatar.vue
│   │   │   ├── UserInfo.vue
│   │   │   └── UserResetPassword.vue
│   │   ├── Login.vue              # Login page
│   │   └── Main.vue               # Main layout
│   ├── App.vue                    # Root component
│   └── main.js                    # Entry point
├── .gitignore                     # Git ignore rules
├── .vscode/                       # VS Code settings
│   └── extensions.json            # Recommended extensions
├── AGENTS.md                      # AI agent guidelines
├── index.html                     # HTML template
├── jsconfig.json                  # JS configuration
├── package.json                   # Project dependencies
├── vite.config.js                 # Vite configuration
└── README.md                      # This file
```

## Quick Start

### Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The development server runs at `http://localhost:5173`

### Production Build

```bash
npm run build
```

Build output will be in the `dist` directory.

### Preview Build

```bash
npm run preview
```

## API Configuration

The frontend proxies API requests through `/api` to the backend server.

**Default Configuration** (in `vite.config.js`):
- Backend URL: `http://localhost:8080`
- Proxy Path: `/api`
- Timeout: 30000ms

## Development Guidelines

### Code Style

- **Components**: PascalCase (e.g., `PageHeader.vue`)
- **Files**: kebab-case (e.g., `user-login.js`)
- **Variables/Functions**: camelCase (e.g., `userInfo`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Composables**: `use` prefix (e.g., `useAuth`)
- **Indentation**: 2 spaces
- **Imports**: Double quotes

### Directory Conventions

```
src/
├── api/           # All API service functions
├── assets/        # Static assets and global styles
├── components/    # Reusable Vue components
├── composables/   # Composable functions (useXxx)
├── constants/     # Project constants
├── router/        # Vue Router configuration
├── stores/        # Pinia stores
├── types/         # TypeScript interfaces
├── utils/         # Utility functions
└── views/         # Page components
```

### API Layer Pattern

```javascript
// src/api/user.js
import request from '@/utils/request.js'

export const userLoginService = (loginData) => {
  return request.post('/user/login', loginData)
}

export const userInfoService = () => {
  return request.get('/user/profile')
}
```

### State Management (Pinia)

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

## Browser Support

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## Backend Integration

This frontend is designed to work with the Big Event backend:

- Backend Repository: [big-event (Go)](https://github.com/piece-weaver/big-event)
- Ensure the backend is running at `http://localhost:8080`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.txt) file for details.

## Acknowledgments

- [Vue.js](https://vuejs.org/)
- [Element Plus](https://element-plus.org/)
- [Vite](https://vitejs.dev/)
- [Pinia](https://pinia.vuejs.org/)
