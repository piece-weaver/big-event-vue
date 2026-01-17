<script setup>
import {
    Management,
    Promotion,
    UserFilled,
    User,
    Crop,
    EditPen,
    SwitchButton,
    CaretBottom,
    Fold,
    Expand
} from '@element-plus/icons-vue'
import avatar from '@/assets/images/default.png'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

import { userInfoService } from '@/api/user.js'
import useUserInfoStore from '@/stores/userInfo.js'

import SidebarLogo from '@/components/Layout/SidebarLogo.vue'
import Breadcrumb from '@/components/Layout/Breadcrumb.vue'

const route = useRoute()
const userInfoStore = useUserInfoStore()

const isCollapse = ref(false)
const sidebarVisible = ref(false)

const userInfoStoreInfo = userInfoStore.Info

const getUserInfo = async () => {
    try {
        const result = await userInfoService()
        userInfoStore.setInfo(result.data)
    } catch (error) {
        console.error('获取用户信息失败:', error)
    }
}

getUserInfo()

import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { useTokenStore } from '@/stores/token.js'

const router = useRouter()
const tokenStore = useTokenStore()

const currentPageTitle = computed(() => {
    return route.meta.title || ''
})

const toggleSidebar = () => {
    isCollapse.value = !isCollapse.value
}

const toggleMobileSidebar = () => {
    sidebarVisible.value = !sidebarVisible.value
}

const closeMobileSidebar = () => {
    sidebarVisible.value = false
}

const handleCommand = (command) => {
    switch (command) {
        case 'info':
            router.push('/user/info')
            break
        case 'avatar':
            router.push('/user/avatar')
            break
        case 'resetpassword':
            router.push('/user/resetpassword')
            break
        case 'logout':
            ElMessageBox.confirm(
                '你确认要退出登录吗?',
                '温馨提示',
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            )
                .then(async () => {
                    tokenStore.removeToken()
                    userInfoStore.removeInfo()
                    ElMessage.success('退出登录成功')
                    router.push('/login')
                })
                .catch(() => {
                    ElMessage.info('取消了退出登录操作')
                })
            break
    }
}
</script>

<template>
    <div class="layout-container" :class="{ 'is-collapse': isCollapse }">
        <!-- 侧边栏遮罩层（移动端） -->
        <div
            v-if="sidebarVisible"
            class="sidebar-overlay"
            @click="closeMobileSidebar"
        />

        <!-- 左侧菜单 -->
        <el-aside class="sidebar" :class="{ 'is-visible': sidebarVisible }">
            <SidebarLogo
                :logo="''"
                title="大事件管理系统"
                :is-collapsed="isCollapse"
            />
            <el-menu
                :default-active="route.path"
                :collapse="isCollapse"
                background-color="#232323"
                text-color="#bfcbd9"
                active-text-color="#409eff"
                router
                class="sidebar-menu"
            >
                <el-menu-item index="/article/category">
                    <el-icon>
                        <Management />
                    </el-icon>
                    <span>文章分类</span>
                </el-menu-item>
                <el-menu-item index="/article/manage">
                    <el-icon>
                        <Promotion />
                    </el-icon>
                    <span>文章管理</span>
                </el-menu-item>
                <el-sub-menu>
                    <template #title>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>个人中心</span>
                    </template>
                    <el-menu-item index="/user/info">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>基本资料</span>
                    </el-menu-item>
                    <el-menu-item index="/user/avatar">
                        <el-icon>
                            <Crop />
                        </el-icon>
                        <span>更换头像</span>
                    </el-menu-item>
                    <el-menu-item index="/user/resetpassword">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        <span>重置密码</span>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>

        <!-- 右侧主区域 -->
        <el-container class="main-container">
            <!-- 头部区域 -->
            <el-header class="header">
                <div class="header-left">
                    <el-button
                        class="sidebar-toggle"
                        :icon="isCollapse ? Expand : Fold"
                        text
                        @click="toggleSidebar"
                    />
                    <el-button
                        class="mobile-sidebar-toggle"
                        :icon="Management"
                        text
                        @click="toggleMobileSidebar"
                    />
                    <Breadcrumb />
                </div>
                <div class="header-right">
                    <div class="user-info">
                        <span class="welcome-text">你好，<strong class="nickname">{{ userInfoStoreInfo.nickname || '用户' }}</strong></span>
                    </div>
                    <el-dropdown placement="bottom-end" @command="handleCommand">
                        <span class="user-dropdown-trigger">
                            <el-avatar
                                :src="userInfoStoreInfo.userPic ? userInfoStoreInfo.userPic : avatar"
                                :size="36"
                                class="user-avatar"
                            />
                            <el-icon class="dropdown-icon">
                                <CaretBottom />
                            </el-icon>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="info" :icon="User">
                                    基本资料
                                </el-dropdown-item>
                                <el-dropdown-item command="avatar" :icon="Crop">
                                    更换头像
                                </el-dropdown-item>
                                <el-dropdown-item command="resetpassword" :icon="EditPen">
                                    重置密码
                                </el-dropdown-item>
                                <el-dropdown-item command="logout" :icon="SwitchButton" divided>
                                    退出登录
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </el-header>

            <!-- 主内容区域 -->
            <el-main class="main-content">
                <div class="page-wrapper">
                    <transition name="fade-slide" mode="out-in">
                        <router-view :key="route.path" />
                    </transition>
                </div>
            </el-main>

            <!-- 底部区域 -->
            <el-footer class="footer">
                <span class="footer-text">大事件管理系统 © {{ new Date().getFullYear() }} Created by 黑马程序员</span>
            </el-footer>
        </el-container>
    </div>
</template>

<style lang="scss" scoped>
@use '@/assets/variables.scss' as *;

.layout-container {
    height: 100vh;
    display: flex;
    overflow: hidden;
    background-color: $bg-color;
}

// 侧边栏样式
.sidebar {
    width: $sidebar-width;
    background-color: $sidebar-bg-color;
    display: flex;
    flex-direction: column;
    transition: width $transition-duration-base $transition-function-ease-in-out;
    flex-shrink: 0;
    overflow: hidden;
    position: relative;
    z-index: $z-index-fixed;

    &.is-visible {
        transform: translateX(0);
    }

    @include mobile-only {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        z-index: $z-index-fixed;
        transform: translateX(-100%);
        transition: transform $transition-duration-base $transition-function-ease-in-out;
        box-shadow: $box-shadow-dark;

        &.is-visible {
            transform: translateX(0);
        }
    }
}

.sidebar-overlay {
    display: none;

    @include mobile-only {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: ($z-index-fixed - 1);
        animation: fadeIn $transition-duration-fast;
    }
}

.sidebar-menu {
    flex: 1;
    border-right: none;
    overflow-y: auto;
    overflow-x: hidden;

    &.el-menu--collapse {
        :deep(.el-sub-menu__title span),
        :deep(.el-menu-item span) {
            display: none;
        }
    }

    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
        height: 50px;
        line-height: 50px;
        color: $sidebar-text-color;
        transition: all $transition-duration-fast;

        &:hover {
            background-color: $sidebar-hover-color;
            color: $white;
        }

        &.is-active {
            color: $sidebar-active-color;
            background-color: rgba($primary-color, 0.1);
        }
    }

    :deep(.el-sub-menu .el-menu-item) {
        padding-left: 53px !important;
    }
}

// 折叠状态
.layout-container.is-collapse {
    .sidebar {
        width: $sidebar-width-collapsed;

        @include mobile-only {
            width: $sidebar-width;
        }
    }
}

// 主容器样式
.main-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;
}

// 头部样式
.header {
    height: $header-height;
    background-color: $header-bg-color;
    border-bottom: 1px solid $header-border-color;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 $spacing-lg;
    flex-shrink: 0;

    .header-left {
        display: flex;
        align-items: center;
        flex: 1;
        gap: $spacing-md;
        overflow: hidden;
    }

    .header-right {
        display: flex;
        align-items: center;
        gap: $spacing-md;
        flex-shrink: 0;
    }

    .sidebar-toggle {
        padding: 8px;
        font-size: 20px;
        color: $text-regular;

        &:hover {
            color: $primary-color;
        }

        @include mobile-only {
            display: none;
        }
    }

    .mobile-sidebar-toggle {
        display: none;
        padding: 8px;
        font-size: 20px;
        color: $text-regular;

        &:hover {
            color: $primary-color;
        }

        @include mobile-only {
            display: flex;
        }
    }

    .user-info {
        .welcome-text {
            font-size: $font-size-sm;
            color: $text-secondary;
            white-space: nowrap;

            .nickname {
                color: $text-primary;
                font-weight: $font-weight-bold;
            }
        }

        @include mobile-only {
            display: none;
        }
    }

    .user-dropdown-trigger {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        cursor: pointer;
        padding: 4px;
        border-radius: $border-radius-md;
        transition: background-color $transition-duration-fast;

        &:hover {
            background-color: $gray-100;
        }

        .user-avatar {
            border: 2px solid $border-color;
        }

        .dropdown-icon {
            color: $text-secondary;
            font-size: 12px;
        }
    }

    @include header-mobile;
}

// 主内容区域样式
.main-content {
    flex: 1;
    overflow: hidden;
    background-color: $bg-color;
    padding: $spacing-lg;

    @include main-mobile;
}

.page-wrapper {
    height: 100%;
    overflow: auto;
}

// 底部样式
.footer {
    height: $footer-height;
    background-color: $footer-bg-color;
    border-top: 1px solid $header-border-color;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    .footer-text {
        font-size: $font-size-sm;
        color: $footer-text-color;
    }

    @include mobile-only {
        font-size: $font-size-xs;
    }
}

// 过渡动画
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all $transition-duration-base;
}

.fade-slide-enter-from {
    transform: translateX(-20px);
    opacity: 0;
}

.fade-slide-leave-to {
    transform: translateX(20px);
    opacity: 0;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

// 响应式适配
@include mobile-only {
    .header {
        padding: 0 $spacing-md;
    }

    .main-content {
        padding: $spacing-md;
    }
}

@include tablet-only {
    .header {
        padding: 0 $spacing-md;
    }

    .main-content {
        padding: $spacing-md;
    }
}
</style>
