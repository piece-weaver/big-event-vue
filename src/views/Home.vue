<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { DataLine, Document, Folder, Edit } from '@element-plus/icons-vue'
import { articleListService } from '@/api/article.js'
import { categoryListService } from '@/api/category.js'
import PageContainer from '@/components/Common/PageContainer.vue'

const router = useRouter()

const stats = ref([
  { key: 'articles', label: '文章总数', value: 0, icon: Document, iconClass: 'icon-document' },
  { key: 'published', label: '已发布', value: 0, icon: Edit, iconClass: 'icon-published' },
  { key: 'drafts', label: '草稿', value: 0, icon: Document, iconClass: 'icon-draft' },
  { key: 'categories', label: '分类总数', value: 0, icon: Folder, iconClass: 'icon-folder' }
])

const recentArticles = ref([])
const loading = ref(false)

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStateText = (state) => {
  return state === 1 ? '已发布' : '草稿'
}

const getStateType = (state) => {
  return state === 1 ? 'success' : 'info'
}

const fetchData = async () => {
  loading.value = true
  try {
    const [articlesResult, categoriesResult] = await Promise.all([
      articleListService({ pageNum: 1, pageSize: 100 }),
      categoryListService()
    ])

    const articles = articlesResult.data.items || []
    const categories = categoriesResult.data || []

    const publishedCount = articles.filter(a => a.state === 1).length
    const draftCount = articles.filter(a => a.state === 0).length

    stats.value = [
      { key: 'articles', label: '文章总数', value: articles.length, icon: Document, iconClass: 'icon-document' },
      { key: 'published', label: '已发布', value: publishedCount, icon: Edit, iconClass: 'icon-published' },
      { key: 'drafts', label: '草稿', value: draftCount, icon: Document, iconClass: 'icon-draft' },
      { key: 'categories', label: '分类总数', value: categories.length, icon: Folder, iconClass: 'icon-folder' }
    ]

    recentArticles.value = articles.slice(0, 5).map(article => ({
      ...article,
      createTime: formatDate(article.createTime)
    }))
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

const goToArticleManage = () => {
  router.push('/article/manage')
}

const goToCategoryManage = () => {
  router.push('/article/category')
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <PageContainer title="首页" :loading="loading">
    <div class="home-container">
      <el-row :gutter="20" class="stats-row">
        <el-col :xs="12" :sm="6" v-for="stat in stats" :key="stat.key">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon" :class="stat.iconClass">
                <el-icon :size="32">
                  <component :is="stat.icon" />
                </el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stat.value }}</div>
                <div class="stat-label">{{ stat.label }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="content-row">
        <el-col :xs="24" :lg="16">
          <el-card class="recent-articles-card">
            <template #header>
              <div class="card-header">
                <span>最近文章</span>
                <el-button type="primary" link @click="goToArticleManage">
                  查看全部 →
                </el-button>
              </div>
            </template>
            <el-table :data="recentArticles" style="width: 100%" v-if="recentArticles.length > 0">
              <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
              <el-table-column prop="categoryId" label="分类" width="120">
                <template #default="{ row }">
                  <el-tag size="small" type="info">
                    {{ row.categoryId ? '分类' + row.categoryId : '未分类' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="发布时间" width="160" />
              <el-table-column prop="state" label="状态" width="100" align="center">
                <template #default="{ row }">
                  <el-tag :type="getStateType(row.state)" size="small">
                    {{ getStateText(row.state) }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
            <el-empty v-else description="暂无文章" :image-size="120" />
          </el-card>
        </el-col>

        <el-col :xs="24" :lg="8">
          <el-card class="quick-actions-card">
            <template #header>
              <div class="card-header">
                <span>快捷操作</span>
              </div>
            </template>
            <div class="quick-actions">
              <el-button type="primary" size="large" @click="goToArticleManage" class="action-btn">
                <el-icon><Edit /></el-icon>
                写文章
              </el-button>
              <el-button size="large" @click="goToCategoryManage" class="action-btn">
                <el-icon><Folder /></el-icon>
                管理分类
              </el-button>
            </div>

            <el-divider />

            <div class="system-info">
              <h4>系统信息</h4>
              <p>大事件管理系统 v1.0</p>
              <p>基于 Vue 3 + Element Plus</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </PageContainer>
</template>

<style lang="scss" scoped>
@use '@/assets/variables.scss' as *;

.home-container {
  padding: 0;
}

.stats-row {
  margin-bottom: $spacing-lg;
}

.stat-card {
  margin-bottom: $spacing-md;

  .stat-content {
    display: flex;
    align-items: center;
    gap: $spacing-md;
  }

  .stat-icon {
    width: 56px;
    height: 56px;
    border-radius: $border-radius-md;
    display: flex;
    align-items: center;
    justify-content: center;

    &.icon-document {
      background-color: rgba($primary-color, 0.1);
      color: $primary-color;
    }

    &.icon-published {
      background-color: rgba($success-color, 0.1);
      color: $success-color;
    }

    &.icon-draft {
      background-color: rgba($warning-color, 0.1);
      color: $warning-color;
    }

    &.icon-folder {
      background-color: rgba($info-color, 0.1);
      color: $info-color;
    }
  }

  .stat-info {
    flex: 1;

    .stat-value {
      font-size: $font-size-2xl;
      font-weight: $font-weight-bold;
      color: $text-primary;
      line-height: 1.2;
    }

    .stat-label {
      font-size: $font-size-sm;
      color: $text-secondary;
      margin-top: $spacing-xs;
    }
  }
}

.content-row {
  margin-bottom: $spacing-lg;
}

.recent-articles-card,
.quick-actions-card {
  height: 100%;
  margin-bottom: $spacing-md;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    font-size: $font-size-md;
    font-weight: $font-weight-bold;
    color: $text-primary;
  }
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;

  .action-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-sm;
  }
}

.system-info {
  h4 {
    font-size: $font-size-sm;
    font-weight: $font-weight-bold;
    color: $text-primary;
    margin: 0 0 $spacing-sm 0;
  }

  p {
    font-size: $font-size-xs;
    color: $text-secondary;
    margin: $spacing-xs 0;
  }
}

@include mobile-only {
  .stats-row {
    .el-col {
      margin-bottom: $spacing-md;
    }
  }

  .content-row {
    .el-col {
      margin-bottom: $spacing-md;
    }
  }
}

@include tablet-only {
  .stats-row {
    .el-col {
      margin-bottom: $spacing-md;
    }
  }

  .content-row {
    .el-col {
      margin-bottom: $spacing-md;
    }
  }
}
</style>
