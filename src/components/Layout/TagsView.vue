<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Close, RefreshRight } from '@element-plus/icons-vue'
import useTagsViewStore from '@/stores/tagsView.js'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const tagsViewStore = useTagsViewStore()

const visitedViews = computed(() => tagsViewStore.visitedViews)

const isActive = (view) => {
  return view.path === route.path
}

const addTags = () => {
  if (route.name && route.meta && route.meta.title) {
    tagsViewStore.addTagsView(route)
  }
}

const closeTag = (view) => {
  if (view.affix) {
    ElMessage.warning('该标签不可关闭')
    return
  }
  tagsViewStore.closeSelectedTag(view)
}

const refreshSelectedTag = () => {
  router.replace({
    path: '/redirect' + route.fullPath
  })
}

const closeOthersTags = () => {
  tagsViewStore.closeOtherTags()
  ElMessage.success('已关闭其他标签')
}

const closeAllTags = () => {
  tagsViewStore.closeAllTags()
  ElMessage.success('已关闭所有标签')
}

watch(
  () => route.path,
  () => {
    addTags()
  }
)

onMounted(() => {
  tagsViewStore.initTags()
  if (route.meta && route.meta.title) {
    addTags()
  }
})
</script>

<template>
  <div class="tags-view-container">
    <div class="tags-view-wrapper">
      <router-link
        v-for="tag in visitedViews"
        :key="tag.path"
        :to="tag.path"
        :class="['tags-view-item', { active: isActive(tag) }]"
      >
        <span class="tag-text">{{ tag.title }}</span>
        <el-icon
          v-if="!tag.affix"
          class="close-icon"
          @click.prevent="closeTag(tag)"
        >
          <Close />
        </el-icon>
      </router-link>
    </div>

    <el-dropdown trigger="click" @command="(command) => {
      if (command === 'refresh') {
        refreshSelectedTag()
      } else if (command === 'closeOthers') {
        closeOthersTags()
      } else if (command === 'closeAll') {
        closeAllTags()
      }
    }">
      <el-button type="primary" link class="tags-more-btn">
        <el-icon><MoreFilled /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="refresh" :icon="RefreshRight">
            刷新当前页
          </el-dropdown-item>
          <el-dropdown-item command="closeOthers" :disabled="visitedViews.length <= 1">
            关闭其他标签
          </el-dropdown-item>
          <el-dropdown-item command="closeAll" :disabled="visitedViews.length <= 1">
            关闭所有标签
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script>
import { MoreFilled } from '@element-plus/icons-vue'

export default {
  components: {
    MoreFilled
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/variables.scss' as *;

.tags-view-container {
  height: 40px;
  width: 100%;
  background: $white;
  border-bottom: 1px solid $border-color-lighter;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 $spacing-md;
  box-sizing: border-box;
}

.tags-view-wrapper {
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;

  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
}

.tags-view-item {
  display: inline-block;
  position: relative;
  cursor: pointer;
  height: 26px;
  line-height: 26px;
  border: 1px solid $border-color-lighter;
  background-color: $white;
  padding: 0 10px;
  font-size: $font-size-sm;
  margin-left: 5px;
  margin-top: 4px;
  border-radius: $border-radius-sm;
  text-decoration: none;
  color: $text-secondary;
  transition: all $transition-duration-fast;

  &:first-of-type {
    margin-left: 0;
  }

  &:last-of-type {
    margin-right: $spacing-md;
  }

  &.active {
    background-color: $primary-color;
    color: $white;
    border-color: $primary-color;

    &::before {
      content: '';
      background: $white;
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      position: relative;
      margin-right: 4px;
    }
  }

  &:hover {
    color: $primary-color;
    border-color: rgba($primary-color, 0.3);
  }

  &.active:hover {
    color: $white;
  }

  .tag-text {
    display: inline-block;
    vertical-align: middle;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .close-icon {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    text-align: center;
    transition: all $transition-duration-fast;
    display: inline-block;
    vertical-align: middle;
    margin-left: 4px;

    &:hover {
      background-color: rgba($danger-color, 0.2);
      color: $danger-color;
    }
  }
}

.tags-more-btn {
  padding: 4px 8px;
  font-size: 16px;
  color: $text-secondary;

  &:hover {
    color: $primary-color;
  }
}

@include mobile-only {
  .tags-view-container {
    padding: 0 $spacing-sm;
  }

  .tags-view-item {
    padding: 0 6px;
    margin-left: 3px;

    .tag-text {
      max-width: 60px;
    }
  }
}
</style>
