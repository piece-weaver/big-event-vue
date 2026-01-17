<script setup>
import { Edit, Delete, Plus, Search, Refresh } from '@element-plus/icons-vue'
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { categoryListService } from '@/api/category.js'
import { articleListService, articleAddService, articleUpdateService, articleDeleteService } from '@/api/article.js'
import { useTokenStore } from '@/stores/token.js'
import { ARTICLE_STATE, ARTICLE_STATE_TEXT, ARTICLE_STATE_OPTIONS } from '@/constants/index.js'
import PageContainer from '@/components/Common/PageContainer.vue'

const tokenStore = useTokenStore()
const categorys = ref([])
const categoryId = ref('')
const state = ref('')
const articles = ref([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const visibleDrawer = ref(false)
const drawerTitle = ref('添加文章')
const formRef = ref()
const loading = ref(false)
const submitLoading = ref(false)

const articleModel = ref({
    title: '',
    categoryId: '',
    coverImg: '',
    content: '',
    state: ''
})

const stateOptions = computed(() => ARTICLE_STATE_OPTIONS)

const getStateText = (stateValue) => {
    return ARTICLE_STATE_TEXT[stateValue] || stateValue
}

const getStateType = (stateValue) => {
    return stateValue === ARTICLE_STATE.PUBLISHED ? 'success' : 'info'
}

const rules = {
    title: [
        { required: true, message: '请输入文章标题', trigger: 'blur' },
        { min: 1, max: 100, message: '标题长度在1-100个字符', trigger: 'blur' }
    ],
    categoryId: [
        { required: true, message: '请选择文章分类', trigger: 'change' }
    ],
    content: [
        { required: true, message: '请输入文章内容', trigger: 'blur' }
    ]
}

const articleCategoryList = async () => {
    try {
        const result = await categoryListService()
        categorys.value = result.data
    } catch (error) {
        console.error('获取分类列表失败:', error)
        ElMessage.error('获取分类列表失败')
    }
}

const articleList = async () => {
    loading.value = true
    try {
        const params = {
            pageNum: pageNum.value,
            pageSize: pageSize.value
        }

        if (categoryId.value) {
            params.categoryId = categoryId.value
        }

        if (state.value) {
            params.state = state.value
        }

        const result = await articleListService(params)
        total.value = result.data.total
        articles.value = result.data.items

        for (let i = 0; i < articles.value.length; i++) {
            const categoryId = articles.value[i].categoryId
            const category = categorys.value.find(c => c.id == categoryId)
            articles.value[i].categoryName = category ? category.categoryName : ''
        }
    } catch (error) {
        console.error('获取文章列表失败:', error)
        ElMessage.error('获取文章列表失败')
    } finally {
        loading.value = false
    }
}

const onSizeChange = (size) => {
    pageSize.value = size
    pageNum.value = 1
    articleList()
}

const onCurrentChange = (num) => {
    pageNum.value = num
    articleList()
}

const handleSearch = () => {
    pageNum.value = 1
    articleList()
}

const handleReset = () => {
    categoryId.value = ''
    state.value = ''
    pageNum.value = 1
    articleList()
    ElMessage.success('已重置筛选条件')
}

const openDrawer = () => {
    drawerTitle.value = '添加文章'
    visibleDrawer.value = true
    clearArticleForm()
}

const editArticle = (row) => {
    drawerTitle.value = '编辑文章'
    visibleDrawer.value = true
    articleModel.value = {
        id: row.id,
        title: row.title,
        categoryId: Number(row.categoryId),
        coverImg: row.coverImg,
        content: row.content,
        state: row.state
    }
}

const uploadSuccess = (result) => {
    articleModel.value.coverImg = result.data
    ElMessage.success('图片上传成功')
}

const saveArticle = async (articleState) => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
        if (valid) {
            articleModel.value.state = articleState
            submitLoading.value = true
            try {
                if (articleModel.value.id) {
                    const result = await articleUpdateService(articleModel.value.id, {
                        title: articleModel.value.title,
                        categoryId: articleModel.value.categoryId,
                        coverImg: articleModel.value.coverImg,
                        content: articleModel.value.content,
                        state: articleModel.value.state
                    })
                    ElMessage.success(result.message || '更新成功')
                } else {
                    const result = await articleAddService(articleModel.value)
                    ElMessage.success(result.message || '添加成功')
                }
                visibleDrawer.value = false
                clearArticleForm()
                articleList()
            } catch (error) {
                console.error('保存文章失败:', error)
            } finally {
                submitLoading.value = false
            }
        }
    })
}

const deleteArticle = (row) => {
    ElMessageBox.confirm(
        '你确认删除该文章吗？',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            try {
                const result = await articleDeleteService(row.id)
                ElMessage.success(result.message || '删除成功')
                if (articles.value.length === 1 && pageNum.value > 1) {
                    pageNum.value--
                }
                articleList()
            } catch (error) {
                console.error('删除文章失败:', error)
            }
        })
        .catch(() => {
            ElMessage.info('取消删除')
        })
}

const clearArticleForm = () => {
    articleModel.value = {
        title: '',
        categoryId: '',
        coverImg: '',
        content: '',
        state: ''
    }
    if (formRef.value) {
        formRef.value.clearValidate()
    }
}

articleCategoryList()
articleList()
</script>

<template>
    <PageContainer title="文章管理" :loading="loading">
        <template #actions>
            <el-button type="primary" :icon="Plus" @click="openDrawer">添加文章</el-button>
        </template>

        <el-form inline class="search-form">
            <el-form-item label="文章分类">
                <el-select
                    placeholder="全部"
                    v-model="categoryId"
                    clearable
                    style="width: 160px"
                >
                    <el-option
                        v-for="c in categorys"
                        :key="c.id"
                        :label="c.categoryName"
                        :value="c.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="发布状态">
                <el-select
                    placeholder="全部"
                    v-model="state"
                    clearable
                    style="width: 140px"
                >
                    <el-option
                        v-for="option in stateOptions"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
                <el-button :icon="Refresh" @click="handleReset">重置</el-button>
            </el-form-item>
        </el-form>

        <el-table
            :data="articles"
            style="width: 100%"
            stripe
            border
        >
            <el-table-column label="文章标题" min-width="200" prop="title" show-overflow-tooltip />
            <el-table-column label="分类" width="120" prop="categoryName" align="center" />
            <el-table-column label="发表时间" width="180" prop="createTime" align="center" />
            <el-table-column label="状态" width="100" align="center">
                <template #default="{ row }">
                    <el-tag :type="getStateType(row.state)" size="small">
                        {{ getStateText(row.state) }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="140" align="center" fixed="right">
                <template #default="{ row }">
                    <div class="action-buttons">
                        <el-button
                            :icon="Edit"
                            circle
                            plain
                            type="primary"
                            size="small"
                            @click="editArticle(row)"
                            title="编辑"
                        />
                        <el-button
                            :icon="Delete"
                            circle
                            plain
                            type="danger"
                            size="small"
                            @click="deleteArticle(row)"
                            title="删除"
                        />
                    </div>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="暂无文章数据" :image-size="200" />
            </template>
        </el-table>

        <template #footer>
            <el-pagination
                v-model:current-page="pageNum"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 50, 100]"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
                background
                @size-change="onSizeChange"
                @current-change="onCurrentChange"
            />
        </template>
    </PageContainer>

    <el-drawer
        v-model="visibleDrawer"
        :title="drawerTitle"
        direction="rtl"
        size="50%"
        :show-close="true"
        :close-on-click-modal="false"
    >
        <template #header>
            <h3 class="drawer-title">{{ drawerTitle }}</h3>
        </template>
        <el-form ref="formRef" :model="articleModel" :rules="rules" label-width="100px">
            <el-form-item label="文章标题" prop="title">
                <el-input
                    v-model="articleModel.title"
                    placeholder="请输入标题"
                    maxlength="100"
                    show-word-limit
                />
            </el-form-item>
            <el-form-item label="文章分类" prop="categoryId">
                <el-select placeholder="请选择" v-model="articleModel.categoryId" style="width: 100%">
                    <el-option
                        v-for="c in categorys"
                        :key="c.id"
                        :label="c.categoryName"
                        :value="c.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="文章封面">
                <el-upload
                    class="avatar-uploader"
                    :auto-upload="true"
                    :show-file-list="false"
                    action="/api/upload"
                    name="file"
                    :headers="{ 'Authorization': 'Bearer ' + tokenStore.token }"
                    :on-success="uploadSuccess"
                >
                    <img
                        v-if="articleModel.coverImg"
                        :src="articleModel.coverImg"
                        class="avatar"
                    />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
                <div class="upload-tip">支持 jpg/png 格式，大小不超过 2MB</div>
            </el-form-item>
            <el-form-item label="文章内容" prop="content">
                <div class="editor">
                    <quill-editor
                        theme="snow"
                        v-model:content="articleModel.content"
                        contentType="html"
                        toolbar="full"
                    />
                </div>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    @click="saveArticle(ARTICLE_STATE.PUBLISHED)"
                    :loading="submitLoading"
                >
                    发布
                </el-button>
                <el-button
                    type="info"
                    @click="saveArticle(ARTICLE_STATE.DRAFT)"
                    :loading="submitLoading"
                >
                    草稿
                </el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>

<style lang="scss" scoped>
@use '@/assets/variables.scss' as *;

.search-form {
    margin-bottom: $spacing-lg;

    :deep(.el-form-item) {
        margin-bottom: 0;
        margin-right: $spacing-lg;
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

.drawer-title {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: $text-primary;
    margin: 0;
}

.upload-tip {
    font-size: $font-size-xs;
    color: $text-secondary;
    margin-top: $spacing-xs;
}

.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
            border-radius: $border-radius-md;
            object-fit: cover;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: $border-radius-md;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);

            &:hover {
                border-color: var(--el-color-primary);
            }
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
}

.editor {
    width: 100%;
    border: 1px solid $border-color;
    border-radius: $border-radius-md;
    overflow: hidden;

    :deep(.ql-editor) {
        min-height: 250px;
        max-height: 500px;
        overflow-y: auto;
    }

    :deep(.ql-toolbar) {
        border: none;
        border-bottom: 1px solid $border-color;
        background-color: $gray-50;
        padding: $spacing-sm $spacing-md;
    }

    :deep(.ql-container) {
        border: none;
        background-color: $white;
    }

    :deep(.ql-snow) {
        border: none;
    }
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

    .avatar-uploader {
        :deep() {
            .avatar,
            .el-icon.avatar-uploader-icon {
                width: 120px;
                height: 120px;
            }
        }
    }
}

@include tablet-only {
    .editor {
        :deep(.ql-editor) {
            min-height: 200px;
        }
    }
}
</style>
