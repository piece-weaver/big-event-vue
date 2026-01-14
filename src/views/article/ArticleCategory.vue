<script setup>
import { Edit, Delete } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { categoryListService, categoryAddService, categoryUpdateService, categoryDeleteService } from '@/api/category.js'

const categorys = ref([])
const dialogVisible = ref(false)
const title = ref('')
const formRef = ref()
const loading = ref(false)
const submitLoading = ref(false)

const categoryModel = ref({
  categoryName: '',
  categoryAlias: ''
})

const rules = {
  categoryName: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 1, max: 50, message: '分类名称长度在1-50个字符', trigger: 'blur' },
    { pattern: /^\S+$/, message: '分类名称不能包含空格', trigger: 'blur' }
  ],
  categoryAlias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    { min: 1, max: 50, message: '分类别名长度在1-50个字符', trigger: 'blur' },
    { pattern: /^\S+$/, message: '分类别名不能包含空格', trigger: 'blur' }
  ]
}

const articleCategoryList = async () => {
  loading.value = true
  try {
    const result = await categoryListService()
    categorys.value = result.data
  } catch (error) {
    console.error('获取分类列表失败:', error)
  } finally {
    loading.value = false
  }
}

articleCategoryList()

const openDialog = () => {
  title.value = '添加分类'
  dialogVisible.value = true
  clearForm()
}

const addCategory = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        const result = await categoryAddService(categoryModel.value)
        ElMessage.success(result.message || '添加成功')
        dialogVisible.value = false
        clearForm()
        articleCategoryList()
      } catch (error) {
        console.error('添加分类失败:', error)
      } finally {
        submitLoading.value = false
      }
    }
  })
}

const updateCategory = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        const result = await categoryUpdateService(categoryModel.value.id, {
          categoryName: categoryModel.value.categoryName,
          categoryAlias: categoryModel.value.categoryAlias
        })
        ElMessage.success(result.message || '修改成功')
        dialogVisible.value = false
        clearForm()
        articleCategoryList()
      } catch (error) {
        console.error('修改分类失败:', error)
      } finally {
        submitLoading.value = false
      }
    }
  })
}

const updateCategoryEcho = (row) => {
  title.value = '编辑分类'
  dialogVisible.value = true
  categoryModel.value = {
    id: row.id,
    categoryName: row.categoryName,
    categoryAlias: row.categoryAlias
  }
}

const clearForm = () => {
  categoryModel.value = {
    categoryName: '',
    categoryAlias: ''
  }
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

const deleteCategory = (row) => {
  ElMessageBox.confirm(
    '你确认删除该分类信息吗？',
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        const result = await categoryDeleteService(row.id)
        ElMessage.success(result.message || '删除成功')
        articleCategoryList()
      } catch (error) {
        console.error('删除分类失败:', error)
      }
    })
    .catch(() => {
      ElMessage.info('取消删除')
    })
}
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>文章分类</span>
        <div class="extra">
          <el-button type="primary" @click="openDialog">添加分类</el-button>
        </div>
      </div>
    </template>
    <el-table :data="categorys" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" width="100" type="index"></el-table-column>
      <el-table-column label="分类名称" prop="categoryName"></el-table-column>
      <el-table-column label="分类别名" prop="categoryAlias"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="updateCategoryEcho(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="deleteCategory(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
  </el-card>

  <el-dialog v-model="dialogVisible" :title="title" width="30%">
    <el-form ref="formRef" :model="categoryModel" :rules="rules" label-width="100px" style="padding-right: 30px">
      <el-form-item label="分类名称" prop="categoryName">
        <el-input v-model="categoryModel.categoryName" minlength="1" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="categoryAlias">
        <el-input v-model="categoryModel.categoryAlias" minlength="1" maxlength="50"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="title === '添加分类' ? addCategory() : updateCategory()" :loading="submitLoading">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>