<template>
  <page-container title="更换头像">
    <el-row>
      <el-col :span="12">
        <el-upload
          ref="uploadRef"
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onUploadFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <img v-else src="@/assets/avatar.jpg" width="278" />
        </el-upload>
        <br />
        <el-button 
          @click="uploadRef.$el.querySelector('input').click()"
          type="primary" 
          :icon="Plus" 
          size="large">
          选择图片
        </el-button>
        <el-button 
          @click="onSubmit"
          type="primary" 
          plain :icon="Upload" 
          size="large">
          上传头像
        </el-button>
      </el-col>
    </el-row>
  </page-container>
</template>

<script setup>
  import { Plus, Upload } from '@element-plus/icons-vue'
  import { ref } from 'vue'
  import { useUserStore } from '@/stores'
  import { userUpdateAvatarService } from '@/api/user'

  const userStore = useUserStore()
  const imgUrl = ref(userStore.user.user_pic)
  const uploadRef = ref()

  const onUploadFile = (uploadFile) => {
    // imgUrl.value = URL.createObjectURL(uploadFile.raw)
    // 基于FileReader读取图片做预览
    const reader = new FileReader()
    reader.readAsDataURL(uploadFile.raw)
    reader.onload = () => {
      imgUrl.value = reader.result
    }
  }

  const onSubmit = async() => {
    await userUpdateAvatarService(imgUrl.value)
    // 重新渲染
    await userStore.getUser()
    ElMessage.success('头像更新成功！')
  }
</script>

<style lang="scss" scoped>
  .avatar-uploader {
    :deep() {
      .avatar {
        width: 278px;
        height: 278px;
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
        width: 278px;
        height: 278px;
        text-align: center;
      }
    }
  }
</style>
