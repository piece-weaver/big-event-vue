<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { userPasswordUpdateService } from '@/api/user.js'
import useUserInfoStore from '@/stores/userInfo.js'
import { useTokenStore } from '@/stores/token.js'

const userInfoStore = useUserInfoStore()
const tokenStore = useTokenStore()
const formRef = ref()

const userPasswordInfo = ref({
  oldPwd: '',
  newPwd: '',
  rePwd: ''
})

const rePasswordValidator = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入新密码'))
  } else if (value !== userPasswordInfo.value.newPwd) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  oldPwd: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { min: 5, max: 16, message: '密码必须是5-16位的非空字符串', trigger: 'blur' },
    { pattern: /^\S+$/, message: '密码不能包含空格', trigger: 'blur' }
  ],
  newPwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 5, max: 16, message: '密码必须是5-16位的非空字符串', trigger: 'blur' },
    { pattern: /^\S+$/, message: '密码不能包含空格', trigger: 'blur' }
  ],
  rePwd: [
    { validator: rePasswordValidator, trigger: 'blur' }
  ]
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
      
      try {
        const result = await userPasswordUpdateService(userPasswordInfo.value)
        ElMessage.success(result.message || '修改密码成功')
        userPasswordInfo.value = { oldPwd: '', newPwd: '', rePwd: '' }
      } catch (error) {
        console.error('修改密码失败:', error)
      }
    }
  })
}
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>修改密码</span>
      </div>
    </template>
    <el-row>
      <el-col :span="12">
        <el-form ref="formRef" :model="userPasswordInfo" :rules="rules" label-width="100px" size="large">
          <el-form-item label="原密码" prop="oldPwd">
            <el-input v-model="userPasswordInfo.oldPwd" type="password"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPwd">
            <el-input v-model="userPasswordInfo.newPwd" type="password"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="rePwd">
            <el-input v-model="userPasswordInfo.rePwd" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit">提交修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>