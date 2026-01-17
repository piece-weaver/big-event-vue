<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { userInfoUpdateService } from '@/api/user.js'
import useUserInfoStore from '@/stores/userInfo.js'
import PageContainer from '@/components/Common/PageContainer.vue'
import { User, Message, Edit } from '@element-plus/icons-vue'

const userInfoStore = useUserInfoStore()
const userInfo = ref({ ...userInfoStore.Info })
const formRef = ref()
const submitting = ref(false)

const rules = {
    nickname: [
        { required: true, message: '请输入用户昵称', trigger: 'blur' },
        { min: 1, max: 10, message: '昵称必须是1-10位的非空字符串', trigger: 'blur' },
        { pattern: /^\S+$/, message: '昵称不能包含空格', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入用户邮箱', trigger: 'blur' },
        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
    ]
}

const updateInfo = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
        if (valid) {
            submitting.value = true
            try {
                const result = await userInfoUpdateService(userInfo.value)
                ElMessage.success(result.message || '修改成功')
                userInfoStore.setInfo(userInfo.value)
            } catch (error) {
                console.error('修改失败:', error)
            } finally {
                submitting.value = false
            }
        }
    })
}

const resetForm = () => {
    userInfo.value = { ...userInfoStore.Info }
    if (formRef.value) {
        formRef.value.clearValidate()
    }
}
</script>

<template>
    <PageContainer title="基本资料">
        <div class="user-info-container">
            <div class="user-info-card">
                <div class="user-avatar-section">
                    <div class="avatar-wrapper">
                        <el-avatar
                            :size="100"
                            :src="userInfo.userPic || ''"
                            class="user-avatar"
                        >
                            <el-icon :size="40"><User /></el-icon>
                        </el-avatar>
                    </div>
                    <div class="user-basic">
                        <h3 class="user-name">{{ userInfo.nickname || '用户' }}</h3>
                        <p class="user-email">
                            <el-icon><Message /></el-icon>
                            {{ userInfo.email || '未设置邮箱' }}
                        </p>
                    </div>
                </div>

                <el-divider />

                <el-form
                    ref="formRef"
                    :model="userInfo"
                    :rules="rules"
                    label-width="100px"
                    size="large"
                    status-icon
                    class="user-form"
                >
                    <el-form-item label="登录名称">
                        <el-input v-model="userInfo.username" disabled>
                            <template #prefix>
                                <el-icon><User /></el-icon>
                            </template>
                        </el-input>
                        <div class="form-tip">登录账号，不可修改</div>
                    </el-form-item>
                    <el-form-item label="用户昵称" prop="nickname">
                        <el-input
                            v-model="userInfo.nickname"
                            placeholder="请输入用户昵称"
                            maxlength="10"
                            show-word-limit
                        >
                            <template #prefix>
                                <el-icon><Edit /></el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="用户邮箱" prop="email">
                        <el-input
                            v-model="userInfo.email"
                            placeholder="请输入用户邮箱"
                        >
                            <template #prefix>
                                <el-icon><Message /></el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            type="primary"
                            @click="updateInfo"
                            :loading="submitting"
                        >
                            保存修改
                        </el-button>
                        <el-button @click="resetForm">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </PageContainer>
</template>

<style lang="scss" scoped>
@use '@/assets/variables.scss' as *;

.user-info-container {
    display: flex;
    justify-content: center;
    padding: $spacing-lg 0;
}

.user-info-card {
    width: 100%;
    max-width: 600px;
    background-color: $white;
    border-radius: $border-radius-lg;
    padding: $spacing-xl;

    @include mobile-only {
        padding: $spacing-md;
    }
}

.user-avatar-section {
    display: flex;
    align-items: center;
    gap: $spacing-lg;
    margin-bottom: $spacing-lg;

    @include mobile-only {
        flex-direction: column;
        text-align: center;
    }
}

.avatar-wrapper {
    flex-shrink: 0;

    .user-avatar {
        border: 3px solid $gray-200;
        box-shadow: $box-shadow-light;
    }
}

.user-basic {
    flex: 1;

    .user-name {
        font-size: $font-size-xl;
        font-weight: $font-weight-bold;
        color: $text-primary;
        margin: 0 0 $spacing-xs 0;
    }

    .user-email {
        font-size: $font-size-sm;
        color: $text-secondary;
        margin: 0;
        display: flex;
        align-items: center;
        gap: $spacing-xs;

        @include mobile-only {
            justify-content: center;
        }
    }
}

.user-form {
    :deep(.el-input__wrapper) {
        background-color: $gray-50;
    }

    :deep(.el-input.is-disabled .el-input__wrapper) {
        background-color: $gray-100;
    }

    .form-tip {
        font-size: $font-size-xs;
        color: $text-secondary;
        margin-top: $spacing-xs;
    }
}

.el-divider {
    margin: $spacing-lg 0;
}

@include mobile-only {
    .user-avatar-section {
        gap: $spacing-md;
    }
}
</style>
