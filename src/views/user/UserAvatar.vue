<script setup>
import { Plus, Upload, RefreshRight } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { userAvatarUpdateService } from '@/api/user.js'
import useUserInfoStore from '@/stores/userInfo.js'
import { useTokenStore } from '@/stores/token.js'
import PageContainer from '@/components/Common/PageContainer.vue'

const userInfoStore = useUserInfoStore()
const tokenStore = useTokenStore()
const uploadRef = ref()
const imgUrl = ref(userInfoStore.Info.userPic)
const uploading = ref(false)
const loading = ref(false)

const uploadSuccess = (result) => {
    imgUrl.value = result.data
    uploading.value = false
}

const updateAvatar = async () => {
    if (!imgUrl.value) {
        ElMessage.warning('请先选择图片')
        return
    }

    loading.value = true
    try {
        const result = await userAvatarUpdateService(imgUrl.value)
        ElMessage.success(result.message || '头像更新成功')
        userInfoStore.Info.userPic = imgUrl.value
    } catch (error) {
        console.error('头像更新失败:', error)
    } finally {
        loading.value = false
    }
}

const handleSelectImage = () => {
    uploadRef.value.$el.querySelector('input').click()
}

const resetAvatar = () => {
    imgUrl.value = userInfoStore.Info.userPic
    ElMessage.info('已恢复原头像')
}
</script>

<template>
    <PageContainer title="更换头像">
        <div class="avatar-container">
            <div class="avatar-card">
                <div class="avatar-preview-section">
                    <h3 class="section-title">头像预览</h3>
                    <div class="preview-wrapper">
                        <el-avatar
                            :size="200"
                            :src="imgUrl || ''"
                            class="preview-avatar"
                        >
                            <el-icon :size="60"><Plus /></el-icon>
                        </el-avatar>
                        <div class="preview-tip">点击下方按钮更换头像</div>
                    </div>
                </div>

                <el-divider />

                <div class="avatar-upload-section">
                    <h3 class="section-title">上传新头像</h3>
                    <div class="upload-area">
                        <el-upload
                            ref="uploadRef"
                            class="avatar-uploader"
                            :show-file-list="false"
                            :auto-upload="true"
                            action="/api/upload"
                            name="file"
                            :headers="{ Authorization: 'Bearer ' + tokenStore.token }"
                            :on-success="uploadSuccess"
                            :before-upload="() => { uploading = true }"
                        >
                            <img
                                v-if="imgUrl"
                                :src="imgUrl"
                                class="upload-preview"
                            />
                            <div v-else class="upload-placeholder">
                                <el-icon class="upload-icon"><Plus /></el-icon>
                                <span class="upload-text">选择图片</span>
                            </div>
                        </el-upload>
                    </div>
                    <div class="upload-actions">
                        <el-button
                            type="primary"
                            :icon="Upload"
                            size="large"
                            @click="handleSelectImage"
                            :loading="uploading"
                        >
                            选择图片
                        </el-button>
                        <el-button
                            type="success"
                            :icon="RefreshRight"
                            size="large"
                            @click="updateAvatar"
                            :loading="loading"
                            :disabled="!imgUrl"
                        >
                            保存头像
                        </el-button>
                        <el-button
                            size="large"
                            @click="resetAvatar"
                            :disabled="!imgUrl || imgUrl === userInfoStore.Info.userPic"
                        >
                            恢复原头像
                        </el-button>
                    </div>
                    <div class="upload-tip">
                        <el-icon><InfoFilled /></el-icon>
                        <span>支持 jpg、png 格式，大小不超过 2MB</span>
                    </div>
                </div>
            </div>
        </div>
    </PageContainer>
</template>

<script>
import { defineComponent } from 'vue'
import { InfoFilled } from '@element-plus/icons-vue'

export default defineComponent({
    components: {
        InfoFilled
    }
})
</script>

<style lang="scss" scoped>
@use '@/assets/variables.scss' as *;

.avatar-container {
    display: flex;
    justify-content: center;
    padding: $spacing-lg 0;
}

.avatar-card {
    width: 100%;
    max-width: 600px;
    background-color: $white;
    border-radius: $border-radius-lg;
    padding: $spacing-xl;

    @include mobile-only {
        padding: $spacing-md;
    }
}

.section-title {
    font-size: $font-size-md;
    font-weight: $font-weight-bold;
    color: $text-primary;
    margin: 0 0 $spacing-lg 0;
}

.avatar-preview-section {
    text-align: center;
}

.preview-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-md;
}

.preview-avatar {
    border: 4px solid $gray-200;
    box-shadow: $box-shadow-lighter;
    transition: all $transition-duration-base;

    &:hover {
        transform: scale(1.02);
        border-color: $primary-color;
    }
}

.preview-tip {
    font-size: $font-size-sm;
    color: $text-secondary;
}

.avatar-upload-section {
    .upload-area {
        display: flex;
        justify-content: center;
        margin-bottom: $spacing-lg;
    }

    .upload-actions {
        display: flex;
        justify-content: center;
        gap: $spacing-md;
        flex-wrap: wrap;
        margin-bottom: $spacing-md;
    }

    .upload-tip {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: $spacing-xs;
        font-size: $font-size-sm;
        color: $text-secondary;

        :deep(.el-icon) {
            font-size: 16px;
        }
    }
}

.avatar-uploader {
    :deep() {
        .upload-preview {
            width: 200px;
            height: 200px;
            display: block;
            border-radius: $border-radius-lg;
            object-fit: cover;
        }

        .el-upload {
            width: 200px;
            height: 200px;
            border: 2px dashed $border-color;
            border-radius: $border-radius-lg;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: all $transition-duration-fast;
            background-color: $gray-50;

            &:hover {
                border-color: $primary-color;
                background-color: rgba($primary-color, 0.05);
            }
        }

        .upload-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: $spacing-md;

            .upload-icon {
                font-size: 48px;
                color: $text-secondary;
            }

            .upload-text {
                font-size: $font-size-sm;
                color: $text-secondary;
            }
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 200px;
            height: 200px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
}

.el-divider {
    margin: $spacing-xl 0;
}

@include mobile-only {
    .avatar-uploader {
        :deep() {
            .upload-preview,
            .el-upload,
            .el-icon.avatar-uploader-icon {
                width: 150px;
                height: 150px;
            }
        }
    }

    .upload-actions {
        flex-direction: column;

        .el-button {
            width: 100%;
        }
    }
}
</style>
