<script setup>
import { Edit, Delete, Plus } from '@element-plus/icons-vue'
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { categoryListService } from '@/api/category.js'
import { articleListService, articleAddService, articleUpdateService, articleDeleteService } from '@/api/article.js'
import { useTokenStore } from '@/stores/token.js'
import { ARTICLE_STATE, ARTICLE_STATE_TEXT, ARTICLE_STATE_OPTIONS } from '@/constants/index.js'

const tokenStore = useTokenStore()
const categorys = ref([])
const categoryId = ref('')
const state = ref('')
const articles = ref([])
const pageNum = ref(1)
const pageSize = ref(5)
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
  } finally {
    loading.value = false
  }
}

const onSizeChange = (size) => {
  pageSize.value = size
  articleList()
}

const onCurrentChange = (num) => {
  pageNum.value = num
  articleList()
}

const resetSearch = () => {
  categoryId.value = ''
  state.value = ''
  articleList()
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
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>文章管理</span>
        <div class="extra">
          <el-button type="primary" @click="openDrawer">添加文章</el-button>
        </div>
      </div>
    </template>
    <el-form inline>
      <el-form-item label="文章分类：">
        <el-select placeholder="请选择" v-model="categoryId" style="width: 100px;">
          <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布状态：">
        <el-select placeholder="请选择" v-model="state" style="width: 100px;">
          <el-option v-for="option in stateOptions" :key="option.value" :label="option.label" :value="option.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="articleList()">搜索</el-button>
        <el-button @click="resetSearch()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="articles" style="width: 100%" v-loading="loading">
      <el-table-column label="文章标题" width="400" prop="title"></el-table-column>
      <el-table-column label="分类" prop="categoryName"></el-table-column>
      <el-table-column label="发表时间" prop="createTime"></el-table-column>
      <el-table-column label="状态">
        <template #default="{ row }">
          <el-tag :type="getStateType(row.state)">{{ getStateText(row.state) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="editArticle(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="deleteArticle(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[5, 10, 15, 20]"
      layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
      @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
  </el-card>

  <el-drawer v-model="visibleDrawer" :title="drawerTitle" direction="rtl" size="50%">
    <el-form ref="formRef" :model="articleModel" :rules="rules" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="articleModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="categoryId">
        <el-select placeholder="请选择" v-model="articleModel.categoryId">
          <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章封面">
        <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false" action="/api/upload"
          name="file" :headers="{ 'Authorization': 'Bearer ' + tokenStore.token }" :on-success="uploadSuccess">
          <img v-if="articleModel.coverImg" :src="articleModel.coverImg" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor theme="snow" v-model:content="articleModel.content" contentType="html"></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveArticle(ARTICLE_STATE.PUBLISHED)" :loading="submitLoading">发布</el-button>
        <el-button type="info" @click="saveArticle(ARTICLE_STATE.DRAFT)" :loading="submitLoading">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
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

/* 抽屉样式 */
.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}

.editor {
    width: 100%;

    :deep(.ql-editor) {
        min-height: 200px;
    }
}
</style>