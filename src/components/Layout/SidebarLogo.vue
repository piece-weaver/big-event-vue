<template>
  <div class="sidebar-logo-container" :class="{ 'is-collapsed': isCollapsed }">
    <router-link to="/" class="sidebar-logo-link">
      <img v-if="logo" :src="logo" alt="logo" class="sidebar-logo" />
      <div v-else class="sidebar-logo-placeholder">
        <span class="logo-text">{{ title ? title.charAt(0).toUpperCase() : 'B' }}</span>
      </div>
      <transition name="sidebar-title-fade">
        <span v-if="!isCollapsed" class="sidebar-title">{{ title || 'Big Event' }}</span>
      </transition>
    </router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  logo: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  isCollapsed: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
@use '@/assets/variables.scss' as *;

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: transparent;
  transition: all $transition-duration-base;

  &.is-collapsed {
    .sidebar-logo-link {
      justify-content: center;
      padding: 0;
    }

    .sidebar-logo {
      width: 40px;
      height: 40px;
    }

    .sidebar-logo-placeholder {
      width: 40px;
      height: 40px;
    }
  }
}

.sidebar-logo-link {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  padding: 0 $spacing-md;
  text-decoration: none;
  transition: all $transition-duration-base;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
}

.sidebar-logo {
  width: 48px;
  height: 48px;
  margin-right: $spacing-md;
  border-radius: $border-radius-md;
  object-fit: contain;
  flex-shrink: 0;
  transition: all $transition-duration-base;

  @include mobile-only {
    width: 36px;
    height: 36px;
  }
}

.sidebar-logo-placeholder {
  width: 48px;
  height: 48px;
  border-radius: $border-radius-md;
  background: linear-gradient(135deg, $primary-color 0%, $primary-dark 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: $spacing-md;
  transition: all $transition-duration-base;

  .logo-text {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $white;
  }

  @include mobile-only {
    width: 36px;
    height: 36px;

    .logo-text {
      font-size: $font-size-lg;
    }
  }
}

.sidebar-title {
  font-size: $font-size-md;
  font-weight: $font-weight-bold;
  color: $white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all $transition-duration-base;

  @include mobile-only {
    font-size: $font-size-sm;
  }
}

// 过渡动画
.sidebar-title-fade-enter-active,
.sidebar-title-fade-leave-active {
  transition: opacity $transition-duration-fast;
}

.sidebar-title-fade-enter-from,
.sidebar-title-fade-leave-to {
  opacity: 0;
}

// 响应式
@include mobile-only {
  .sidebar-logo-container {
    height: 64px;
    justify-content: center;
  }

  .sidebar-title {
    display: none;
  }
}

@include tablet-only {
  .sidebar-logo-container {
    height: 80px;
  }

  .sidebar-logo {
    width: 40px;
    height: 40px;
  }

  .sidebar-logo-placeholder {
    width: 40px;
    height: 40px;
  }

  .sidebar-title {
    font-size: $font-size-sm;
  }
}
</style>
