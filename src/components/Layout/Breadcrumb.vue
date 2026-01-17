<template>
  <div class="breadcrumb-nav-container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">
        <el-icon class="breadcrumb-icon"><HomeFilled /></el-icon>
        <span>首页</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
        <span v-if="item.path && index < breadcrumbs.length - 1" class="breadcrumb-link">
          {{ item.meta.title }}
        </span>
        <span v-else class="breadcrumb-current">
          {{ item.meta.title }}
        </span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { HomeFilled } from '@element-plus/icons-vue'

const route = useRoute()

const breadcrumbs = computed(() => {
  const matched = route.matched.filter(item => item.meta && item.meta.title)

  return matched.map(item => ({
    path: item.path,
    meta: item.meta
  }))
})
</script>

<style lang="scss" scoped>
@use '@/assets/variables.scss' as *;

.breadcrumb-nav-container {
  display: flex;
  align-items: center;
  height: 100%;

  :deep(.el-breadcrumb) {
    font-size: $font-size-sm;

    .el-breadcrumb__inner {
      display: flex;
      align-items: center;
      color: $text-secondary;

      &.is-link:hover {
        color: $primary-color;
      }
    }

    .el-breadcrumb__item:last-child .el-breadcrumb__inner {
      color: $text-primary;
      font-weight: 500;
    }

    .el-breadcrumb__separator {
      margin: 0 $spacing-xs;
      color: $text-placeholder;
    }
  }

  .breadcrumb-icon {
    margin-right: $spacing-xs;
    font-size: $font-size-base;
  }

  .breadcrumb-link {
    cursor: pointer;
    transition: color $transition-duration-fast;

    &:hover {
      color: $primary-color;
    }
  }

  .breadcrumb-current {
    color: $text-primary;
    font-weight: 500;
  }
}

@include mobile-only {
  .breadcrumb-nav-container {
    :deep(.el-breadcrumb) {
      font-size: $font-size-xs;

      .breadcrumb-icon {
        display: none;
      }
    }
  }
}
</style>
