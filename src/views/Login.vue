<script setup>
import { User, Lock, Message } from '@element-plus/icons-vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { userRegisterService, userLoginService } from '@/api/user.js'
import { useRouter } from 'vue-router'
import { useTokenStore } from '@/stores/token.js'
import { ElMessage } from 'element-plus'

const router = useRouter()
const tokenStore = useTokenStore()
const isRegister = ref(false)

const registerData = ref({
  username: '',
  password: '',
  rePassword: ''
})

const loginData = ref({
  username: '',
  password: ''
})

const rememberMe = ref(false)
const showForgotDialog = ref(false)
const forgotEmail = ref('')
const forgotLoading = ref(false)

const REMEMBER_KEY = 'big_event_login_remember'

const encodePassword = (password) => {
  return btoa(password)
}

const decodePassword = (encoded) => {
  try {
    return atob(encoded)
  } catch {
    return ''
  }
}

const saveRemember = () => {
  if (rememberMe.value && loginData.value.username && loginData.value.password) {
    const rememberData = {
      username: loginData.value.username,
      password: encodePassword(loginData.value.password)
    }
    localStorage.setItem(REMEMBER_KEY, JSON.stringify(rememberData))
  } else {
    localStorage.removeItem(REMEMBER_KEY)
  }
}

const loadRemember = () => {
  const saved = localStorage.getItem(REMEMBER_KEY)
  if (saved) {
    try {
      const rememberData = JSON.parse(saved)
      if (rememberData.username && rememberData.password) {
        loginData.value.username = rememberData.username
        loginData.value.password = decodePassword(rememberData.password)
        rememberMe.value = true
      }
    } catch (e) {
      localStorage.removeItem(REMEMBER_KEY)
    }
  }
}

const rePasswordValidator = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerData.value.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur' },
    { pattern: /^\S+$/, message: '用户名不能包含空格', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 5, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur' },
    { pattern: /^\S+$/, message: '密码不能包含空格', trigger: 'blur' }
  ],
  rePassword: [
    { validator: rePasswordValidator, trigger: 'blur' }
  ]
})

const registerFormRef = ref()
const loginFormRef = ref()

const sendResetCode = async () => {
  if (!forgotEmail.value) {
    ElMessage.warning('请输入邮箱地址')
    return
  }

  const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailReg.test(forgotEmail.value)) {
    ElMessage.warning('请输入有效的邮箱地址')
    return
  }

  forgotLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('验证码已发送至您的邮箱，请查收')
    showForgotDialog.value = false
    forgotEmail.value = ''
  } catch (error) {
    ElMessage.error('发送失败，请稍后重试')
  } finally {
    forgotLoading.value = false
  }
}

const register = async () => {
  if (!registerFormRef.value) return
  
  await registerFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await userRegisterService(registerData.value)
        ElMessage.success(res.message || '注册成功')
        isRegister.value = false
        registerData.value = { username: '', password: '', rePassword: '' }
      } catch (error) {
        console.error('注册失败:', error)
        ElMessage.error(error.response?.data?.message || '注册失败')
      }
    }
  })
}

const login = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await userLoginService(loginData.value)
        ElMessage.success(res.message || '登录成功')
        saveRemember()
        tokenStore.setToken(res.data)
        router.push('/')
      } catch (error) {
        console.error('登录失败:', error)
        ElMessage.error(error.response?.data?.message || '登录失败')
      }
    }
  })
}

const handleKeydown = (event) => {
  if (event.key === 'Enter' && !isRegister.value) {
    event.preventDefault()
    login()
  }
}

onMounted(() => {
  loadRemember()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <el-form ref="registerFormRef" size="large" autocomplete="off" v-if="isRegister" :model="registerData" :rules="rules">
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="registerData.password"></el-input>
        </el-form-item>
        <el-form-item prop="rePassword">
          <el-input :prefix-icon="Lock" type="password" placeholder="请输入再次密码" v-model="registerData.rePassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="register">注册</el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">← 返回</el-link>
        </el-form-item>
      </el-form>

      <el-form ref="loginFormRef" size="large" autocomplete="off" v-else :model="loginData" :rules="rules">
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="loginData.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="loginData.password"></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox v-model="rememberMe">记住我</el-checkbox>
            <el-link type="primary" :underline="false" @click="showForgotDialog = true">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="login">登录</el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">注册 →</el-link>
        </el-form-item>
      </el-form>
    </el-col>

    <el-dialog
      v-model="showForgotDialog"
      title="忘记密码"
      width="420px"
      :close-on-click-modal="false"
      destroy-on-close
      center
    >
      <div class="forgot-password-content">
        <p class="forgot-tip">请输入注册时使用的邮箱地址</p>
        <el-form @submit.prevent="sendResetCode">
          <el-form-item>
            <el-input
              v-model="forgotEmail"
              placeholder="请输入邮箱地址"
              prefix-icon="Message"
              size="large"
            />
          </el-form-item>
          <p class="forgot-desc">我们将发送验证码到您的邮箱，用于重置您的密码</p>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="showForgotDialog = false">取 消</el-button>
        <el-button type="primary" :loading="forgotLoading" @click="sendResetCode">
          发送验证码
        </el-button>
      </template>
    </el-dialog>
  </el-row>
</template>

<style lang="scss" scoped>
/* 样式 */
.login-page {
    height: 100vh;
    background-color: #fff;

    .bg {
        background: url('@/assets/images/logo2.png') no-repeat 60% center / 240px auto,
            url('@/assets/images/login_bg.jpg') no-repeat center / cover;
        border-radius: 0 20px 20px 0;
    }

    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;

        .title {
            margin: 0 auto;
        }

        .button {
            width: 100%;
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}

.forgot-password-content {
    padding: 10px 0;
}

.forgot-tip {
    font-size: 14px;
    color: #303133;
    margin: 0 0 16px 0;
    text-align: center;
}

.forgot-desc {
    font-size: 12px;
    color: #909399;
    margin: 8px 0 0 0;
    text-align: center;
}
</style>