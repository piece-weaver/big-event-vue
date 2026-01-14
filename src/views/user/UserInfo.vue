<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { userInfoUpdateService } from '@/api/user.js'
import useUserInfoStore from '@/stores/userInfo.js'

const userInfoStore = useUserInfoStore()
const userInfo = ref({ ...userInfoStore.Info })
const formRef = ref()

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
      try {
        const result = await userInfoUpdateService(userInfo.value)
        ElMessage.success(result.message || '修改成功')
        userInfoStore.setInfo(userInfo.value)
      } catch (error) {
        console.error('修改失败:', error)
      }
    }
  })
}
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>基本资料</span>
      </div>
    </template>
    <el-row>
      <el-col :span="12">
        <el-form ref="formRef" :model="userInfo" :rules="rules" label-width="100px" size="large">
          <el-form-item label="登录名称">
            <el-input v-model="userInfo.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickname">
            <el-input v-model="userInfo.nickname"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="userInfo.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateInfo">提交修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>