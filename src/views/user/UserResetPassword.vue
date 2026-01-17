<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { userPasswordUpdateService } from '@/api/user.js'
import useUserInfoStore from '@/stores/userInfo.js'
import { useTokenStore } from '@/stores/token.js'
import { useRouter } from 'vue-router'
import PageContainer from '@/components/Common/PageContainer.vue'
import { Lock, Check, Refresh } from '@element-plus/icons-vue'

const userInfoStore = useUserInfoStore()
const tokenStore = useTokenStore()
const router = useRouter()
const formRef = ref()
const loading = ref(false)

const userPasswordInfo = ref({
    oldPwd: '',
    newPwd: '',
    rePwd: ''
})

const passwordStrength = ref(0)

const rePasswordValidator = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次输入新密码'))
    } else if (value !== userPasswordInfo.value.newPwd) {
        callback(new Error('两次输入密码不一致'))
    } else {
        callback()
    }
}

const checkPasswordStrength = () => {
    const password = userPasswordInfo.value.newPwd
    let strength = 0

    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    passwordStrength.value = strength
}

const getStrengthText = () => {
    const texts = ['弱', '一般', '中等', '较强', '强']
    return texts[passwordStrength.value - 1] || '无'
}

const getStrengthType = () => {
    if (passwordStrength.value <= 1) return 'danger'
    if (passwordStrength.value <= 2) return 'warning'
    if (passwordStrength.value <= 3) return 'info'
    return 'success'
}

const rules = {
    oldPwd: [
        { required: true, message: '请输入原密码', trigger: 'blur' },
        { min: 5, max: 16, message: '密码长度在5-16个字符', trigger: 'blur' },
        { pattern: /^\S+$/, message: '密码不能包含空格', trigger: 'blur' }
    ],
    newPwd: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 5, max: 16, message: '密码长度在5-16个字符', trigger: 'blur' },
        { pattern: /^\S+$/, message: '密码不能包含空格', trigger: 'blur' }
    ],
    rePwd: [
        { validator: rePasswordValidator, trigger: 'blur' }
    ]
}

const resetForm = () => {
    userPasswordInfo.value = { oldPwd: '', newPwd: '', rePwd: '' }
    passwordStrength.value = 0
    if (formRef.value) {
        formRef.value.clearValidate()
    }
}

const submit = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
        if (valid) {
            if (userPasswordInfo.value.oldPwd === userPasswordInfo.value.newPwd) {
                ElMessage.error('新密码和原密码一致，请重新输入')
                userPasswordInfo.value.newPwd = ''
                userPasswordInfo.value.rePwd = ''
                return
            }

            loading.value = true
            try {
                const result = await userPasswordUpdateService(userPasswordInfo.value)
                ElMessage.success(result.message || '修改密码成功')

                setTimeout(() => {
                    tokenStore.removeToken()
                    userInfoStore.removeInfo()
                    resetForm()
                    router.push('/login')
                }, 1000)
            } catch (error) {
                console.error('修改密码失败:', error)
                ElMessage.error(error.response?.data?.message || '修改密码失败')
            } finally {
                loading.value = false
            }
        }
    })
}
</script>

<template>
    <PageContainer title="重置密码">
        <div class="password-container">
            <div class="password-card">
                <div class="password-header">
                    <el-icon class="header-icon"><Lock /></el-icon>
                    <h3>密码安全</h3>
                </div>
                <p class="password-tip">为了保护您的账户安全，请定期更换密码</p>

                <el-form
                    ref="formRef"
                    :model="userPasswordInfo"
                    :rules="rules"
                    label-width="120px"
                    size="large"
                    status-icon
                    class="password-form"
                >
                    <el-form-item label="原密码" prop="oldPwd">
                        <el-input
                            v-model="userPasswordInfo.oldPwd"
                            type="password"
                            placeholder="请输入原密码"
                            show-password
                        >
                            <template #prefix>
                                <el-icon><Lock /></el-icon>
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="新密码" prop="newPwd">
                        <el-input
                            v-model="userPasswordInfo.newPwd"
                            type="password"
                            placeholder="请输入新密码"
                            show-password
                            @input="checkPasswordStrength"
                        >
                            <template #prefix>
                                <el-icon><Lock /></el-icon>
                            </template>
                        </el-input>
                        <div v-if="userPasswordInfo.newPwd" class="password-strength">
                            <div class="strength-bar">
                                <div
                                    class="strength-progress"
                                    :style="{ width: (passwordStrength / 5) * 100 + '%' }"
                                    :class="'strength-' + getStrengthType()"
                                />
                            </div>
                            <span class="strength-text" :class="'text-' + getStrengthType()">
                                强度：{{ getStrengthText() }}
                            </span>
                        </div>
                    </el-form-item>

                    <el-form-item label="确认新密码" prop="rePwd">
                        <el-input
                            v-model="userPasswordInfo.rePwd"
                            type="password"
                            placeholder="请再次输入新密码"
                            show-password
                        >
                            <template #prefix>
                                <el-icon><Check /></el-icon>
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="submit" :loading="loading">
                            修改密码
                        </el-button>
                        <el-button @click="resetForm">
                            <el-icon><Refresh /></el-icon>
                            重置
                        </el-button>
                    </el-form-item>
                </el-form>

                <el-divider />

                <div class="password-requirements">
                    <h4>密码要求：</h4>
                    <ul>
                        <li :class="{ active: userPasswordInfo.oldPwd.length >= 5 && userPasswordInfo.oldPwd.length <= 16 }">
                            长度在 5-16 个字符
                        </li>
                        <li :class="{ active: /^\S+$/.test(userPasswordInfo.newPwd) && userPasswordInfo.newPwd }">
                            不能包含空格
                        </li>
                        <li :class="{ active: userPasswordInfo.rePwd && userPasswordInfo.rePwd === userPasswordInfo.newPwd }">
                            两次输入的密码必须一致
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </PageContainer>
</template>

<style lang="scss" scoped>
@use '@/assets/variables.scss' as *;

.password-container {
    display: flex;
    justify-content: center;
    padding: $spacing-lg 0;
}

.password-card {
    width: 100%;
    max-width: 600px;
    background-color: $white;
    border-radius: $border-radius-lg;
    padding: $spacing-xl;

    @include mobile-only {
        padding: $spacing-md;
    }
}

.password-header {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    margin-bottom: $spacing-md;

    .header-icon {
        font-size: 32px;
        color: $primary-color;
    }

    h3 {
        font-size: $font-size-lg;
        font-weight: $font-weight-bold;
        color: $text-primary;
        margin: 0;
    }

    @include mobile-only {
        justify-content: center;
    }
}

.password-tip {
    font-size: $font-size-sm;
    color: $text-secondary;
    margin-bottom: $spacing-xl;
    text-align: center;

    @include mobile-only {
        text-align: left;
    }
}

.password-form {
    :deep(.el-input__wrapper) {
        background-color: $gray-50;
    }
}

.password-strength {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    margin-top: $spacing-xs;
}

.strength-bar {
    flex: 1;
    height: 4px;
    background-color: $gray-200;
    border-radius: 2px;
    overflow: hidden;
}

.strength-progress {
    height: 100%;
    border-radius: 2px;
    transition: all $transition-duration-base;

    &.strength-danger {
        background-color: $danger-color;
    }

    &.strength-warning {
        background-color: $warning-color;
    }

    &.strength-info {
        background-color: $info-color;
    }

    &.strength-success {
        background-color: $success-color;
    }
}

.strength-text {
    font-size: $font-size-xs;
    flex-shrink: 0;

    &.text-danger {
        color: $danger-color;
    }

    &.text-warning {
        color: $warning-color;
    }

    &.text-info {
        color: $info-color;
    }

    &.text-success {
        color: $success-color;
    }
}

.el-divider {
    margin: $spacing-xl 0;
}

.password-requirements {
    h4 {
        font-size: $font-size-sm;
        font-weight: $font-weight-bold;
        color: $text-primary;
        margin: 0 0 $spacing-md 0;
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    li {
        position: relative;
        padding-left: $spacing-lg;
        margin-bottom: $spacing-xs;
        font-size: $font-size-sm;
        color: $text-secondary;
        transition: all $transition-duration-fast;

        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: $gray-300;
            transition: all $transition-duration-fast;
        }

        &.active {
            color: $success-color;

            &::before {
                background-color: $success-color;
            }
        }
    }
}

@include mobile-only {
    .password-header {
        flex-direction: column;
        text-align: center;
    }

    .password-form {
        :deep(.el-form-item) {
            margin-bottom: $spacing-lg;
        }

        :deep(.el-form-item__content) {
            margin-left: 0 !important;
        }

        :deep(.el-form-item__label) {
            float: none;
            display: block;
            text-align: left;
        }
    }
}
</style>
