<template>
  <div class="skeleton-loading" :class="{ 'is-fullscreen': fullscreen }">
    <template v-if="type === 'table'">
      <el-skeleton :rows="rows" animated>
        <template #template>
          <el-skeleton-item variant="text" style="width: 30%" />
          <el-skeleton-item variant="text" style="width: 20%; margin-left: 16px" />
          <el-skeleton-item variant="text" style="width: 15%; margin-left: 16px" />
        </template>
      </el-skeleton>
      <div class="skeleton-table">
        <div v-for="i in rows" :key="i" class="skeleton-table-row">
          <el-skeleton-item variant="circle" style="width: 40px; height: 40px" />
          <el-skeleton-item variant="text" style="width: 25%; margin-left: 12px" />
          <el-skeleton-item variant="text" style="width: 20%; margin-left: 12px" />
          <el-skeleton-item variant="text" style="width: 15%; margin-left: 12px" />
          <el-skeleton-item variant="text" style="width: 10%; margin-left: 12px" />
        </div>
      </div>
    </template>

    <template v-else-if="type === 'form'">
      <el-skeleton :rows="rows" animated />
    </template>

    <template v-else-if="type === 'card'">
      <el-skeleton :rows="rows" animated />
    </template>

    <template v-else-if="type === 'detail'">
      <div class="skeleton-detail">
        <el-skeleton-item variant="circle" style="width: 80px; height: 80px" />
        <div class="skeleton-detail-content">
          <el-skeleton-item variant="text" style="width: 40%" />
          <el-skeleton-item variant="text" style="width: 60%; margin-top: 12px" />
          <el-skeleton-item variant="text" style="width: 50%; margin-top: 12px" />
        </div>
      </div>
    </template>

    <template v-else>
      <el-skeleton :rows="rows" :animated="animated" />
    </template>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'table', 'form', 'card', 'detail'].includes(value)
  },
  rows: {
    type: Number,
    default: 5
  },
  animated: {
    type: Boolean,
    default: true
  },
  fullscreen: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/variables.scss';
@import '@/assets/breakpoints.scss';

.skeleton-loading {
  width: 100%;
  padding: $spacing-md;

  &.is-fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $white;
    z-index: $z-index-modal-backdrop;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.skeleton-table {
  margin-top: $spacing-md;
}

.skeleton-table-row {
  display: flex;
  align-items: center;
  padding: $spacing-md 0;
  border-bottom: 1px solid $border-color-lighter;

  &:last-child {
    border-bottom: none;
  }
}

.skeleton-detail {
  display: flex;
  align-items: flex-start;
  gap: $spacing-lg;
  padding: $spacing-lg;
}

.skeleton-detail-content {
  flex: 1;
}

// 响应式
@include mobile-only {
  .skeleton-detail {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .skeleton-table-row {
    flex-wrap: wrap;
    gap: $spacing-sm;
  }
}
</style>
