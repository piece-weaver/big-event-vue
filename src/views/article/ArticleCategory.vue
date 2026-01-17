<script setup>
import { Edit, Delete, Plus, Search } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { categoryListService, categoryAddService, categoryUpdateService, categoryDeleteService } from '@/api/category.js'
import PageContainer from '@/components/Common/PageContainer.vue'

const categorys = ref([])
const dialogVisible = ref(false)
const title = ref('添加分类')
const formRef = ref()
const loading = ref(false)
const submitLoading = ref(false)
const searchKeyword = ref('')

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

const filteredCategories = ref([])

const articleCategoryList = async () => {
    loading.value = true
    try {
        const result = await categoryListService()
        categorys.value = result.data
        filterCategories()
    } catch (error) {
        console.error('获取分类列表失败:', error)
        ElMessage.error('获取分类列表失败')
    } finally {
        loading.value = false
    }
}

const filterCategories = () => {
    if (!searchKeyword.value) {
        filteredCategories.value = categorys.value
    } else {
        const keyword = searchKeyword.value.toLowerCase()
        filteredCategories.value = categorys.value.filter(item =>
            item.categoryName.toLowerCase().includes(keyword) ||
            item.categoryAlias.toLowerCase().includes(keyword)
        )
    }
}

const handleSearch = () => {
    filterCategories()
}

const handleReset = () => {
    searchKeyword.value = ''
    filterCategories()
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
    <PageContainer title="文章分类" :loading="loading">
        <template #actions>
            <el-button type="primary" :icon="Plus" @click="openDialog">添加分类</el-button>
        </template>

        <el-form inline class="search-form">
            <el-form-item label="搜索分类">
                <el-input
                    v-model="searchKeyword"
                    placeholder="输入分类名称或别名"
                    prefix-icon="Search"
                    clearable
                    style="width: 240px"
                    @input="handleSearch"
                />
            </el-form-item>
            <el-form-item>
                <el-button :icon="Search" @click="handleSearch">搜索</el-button>
                <el-button @click="handleReset">重置</el-button>
            </el-form-item>
        </el-form>

        <el-table
            :data="filteredCategories"
            style="width: 100%"
            stripe
            border
        >
            <el-table-column label="序号" width="80" type="index" align="center" />
            <el-table-column label="分类名称" min-width="150" prop="categoryName" show-overflow-tooltip />
            <el-table-column label="分类别名" min-width="150" prop="categoryAlias" show-overflow-tooltip />
            <el-table-column label="操作" width="160" align="center" fixed="right">
                <template #default="{ row }">
                    <div class="action-buttons">
                        <el-button
                            :icon="Edit"
                            circle
                            plain
                            type="primary"
                            size="small"
                            @click="updateCategoryEcho(row)"
                            title="编辑"
                        />
                        <el-button
                            :icon="Delete"
                            circle
                            plain
                            type="danger"
                            size="small"
                            @click="deleteCategory(row)"
                            title="删除"
                        />
                    </div>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty
                    :description="searchKeyword ? '未找到匹配的分类' : '暂无分类数据'"
                    :image-size="200"
                />
            </template>
        </el-table>
    </PageContainer>

    <el-dialog
        v-model="dialogVisible"
        :title="title"
        width="500px"
        :close-on-click-modal="false"
        destroy-on-close
    >
        <el-form
            ref="formRef"
            :model="categoryModel"
            :rules="rules"
            label-width="100px"
            status-icon
        >
            <el-form-item label="分类名称" prop="categoryName">
                <el-input
                    v-model="categoryModel.categoryName"
                    placeholder="请输入分类名称"
                    maxlength="50"
                    show-word-limit
                />
            </el-form-item>
            <el-form-item label="分类别名" prop="categoryAlias">
                <el-input
                    v-model="categoryModel.categoryAlias"
                    placeholder="请输入分类别名"
                    maxlength="50"
                    show-word-limit
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button
                    type="primary"
                    @click="title === '添加分类' ? addCategory() : updateCategory()"
                    :loading="submitLoading"
                >
                    {{ title === '添加分类' ? '添加' : '保存' }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style lang="scss" scoped>
@use '@/assets/variables.scss' as *;

.search-form {
    margin-bottom: $spacing-lg;

    :deep(.el-form-item) {
        margin-bottom: 0;
        margin-right: $spacing-md;
    }

    :deep(.el-form-item__label) {
        color: $text-regular;
        font-weight: normal;
    }
}

.action-buttons {
    display: flex;
    justify-content: center;
    gap: $spacing-sm;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: $spacing-sm;
}

@include mobile-only {
    .search-form {
        :deep(.el-form-item) {
            margin-right: 0;
            margin-bottom: $spacing-md;
            width: 100%;

            .el-form-item__content {
                width: 100%;
            }
        }

        .el-button {
            flex: 1;
        }
    }

    .action-buttons {
        flex-direction: column;
        gap: $spacing-xs;
    }

    .el-dialog {
        width: 90% !important;
    }
}
</style>
