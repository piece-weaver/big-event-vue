<template>
  <el-card class="page-container" :shadow="shadow">
    <div v-if="title || $slots.header || $slots.actions" class="page-header">
      <div class="page-header-left">
        <h2 v-if="title" class="page-title">{{ title }}</h2>
        <slot name="header" />
      </div>
      <div v-if="$slots.actions" class="page-header-right">
        <slot name="actions" />
      </div>
    </div>

    <div class="page-body" :class="{ 'is-loading': loading }">
      <el-skeleton v-if="loading" :rows="5" animated />
      <slot v-else />
    </div>

    <div v-if="$slots.footer" class="page-footer">
      <slot name="footer" />
    </div>
  </el-card>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  shadow: {
    type: String,
    default: 'hover',
    validator: (value) => ['never', 'hover', 'always'].includes(value)
  }
})
</script>

<style lang="scss" scoped>
@use '@/assets/variables.scss' as *;

.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all $transition-duration-base;

  :deep(.el-card__body) {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-bottom: $spacing-md;
  border-bottom: 1px solid $border-color-lighter;
  margin-bottom: $spacing-lg;

  .page-header-left {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
  }

  .page-header-right {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    flex-shrink: 0;
    margin-left: $spacing-md;
  }

  .page-title {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: $text-primary;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.page-body {
  flex: 1;
  overflow: auto;

  &.is-loading {
    padding: $spacing-sm 0;
  }
}

.page-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: $spacing-sm;
  padding-top: $spacing-md;
  border-top: 1px solid $border-color-lighter;
  margin-top: $spacing-md;
}

// 响应式
@include mobile-only {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: $spacing-md;

    .page-header-left {
      width: 100%;
    }

    .page-header-right {
      width: 100%;
      margin-left: 0;
      flex-wrap: wrap;
    }
  }

  .page-title {
    font-size: $font-size-md;
  }
}

@include tablet-only {
  .page-header {
    .page-title {
      font-size: $font-size-md;
    }
  }
}
</style>
