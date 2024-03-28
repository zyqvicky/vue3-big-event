<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    size="40%"
  >
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select
          v-model="formModel.cate_id"
          width="100%"
        ></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <!-- 此处需要关闭UI的自动上传，不需要配置action -->
        <!-- 只需要做前端的本地图片的预览计课，不需要在提交前上传图标 -->
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onSelectFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <QuillEditor 
          ref="editorRef"
          theme="snow"
          v-model:content="formModel.content"
          content-type="html"
          >
        </QuillEditor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onPub('已发布')">发布</el-button>
        <el-button @click="onPub('草稿')">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup>
  import { ref } from 'vue'
  import channelSelect from './channelSelect.vue';
  import { QuillEditor } from '@vueup/vue-quill'
  import '@vueup/vue-quill/dist/vue-quill.snow.css'
  import { articleDetailService, articleEditService, articlePubService } from '@/api/article';
  import { baseURL } from '@/utils/request'
  import axios from 'axios';

  const visibleDrawer = ref(false)
  const imgUrl = ref('')
  const editorRef = ref()
  const onSelectFile = (uploadFile) => {
    // 实现本地预览
    imgUrl.value = URL.createObjectURL(uploadFile.raw)
    // 用于提交
    formModel.value.cover_img = uploadFile.raw
  }

  const defaultForm = {
    title: '',
    cate_id: '',
    cover_img: '',
    content: '',
    state: ''
  }
  const formModel = ref({
    ...defaultForm
  })

  const emit = defineEmits(['success'])

  const onPub = async(state) => {
    formModel.value.state = state

    // 当前接口需要formData对象
    const fd = new FormData()
    for (let key in formModel.value) {
      fd.append(key, formModel.value[key])
    }

    if (formModel.value.id) {
      await articleEditService(fd)
      ElMessage.success('修改成功！')
      visibleDrawer.value = false
      emit('success', 'edit')
    } else {
      await articlePubService(fd)
      ElMessage.success('添加成功！')
      visibleDrawer.value = false
      emit('success', 'add')
    }
  }

  const open = async(row) => {
    visibleDrawer.value = true
    if (row.id) {
      // 获取编辑对应的信息
      const res = await articleDetailService(row.id)
      formModel.value = res.data.data
      imgUrl.value = baseURL + formModel.value.cover_img

      // 提交给后台需要的数据格式（file对象格式）
      // 网络图片地址转化为file对象
      const file = await imageUrlToFileObject(
        imgUrl.value, 
        formModel.value.cover_img
      )
      formModel.value.cover_img = file

    } else {
      // 重置表单
      formModel.value = {...defaultForm}
      // 重置图片和内容（手动重置）
      imgUrl.value = ''
      editorRef.value.setHTML('')
    }
  }

  async function imageUrlToFileObject(imageUrl, filename) {
    try {
      const res = await axios.get(imageUrl, { responseType: 'arraybuffer'})

      const blob = new Blob([res.data], {
        type: res.headers['content-type']
      })

      const file = new File([blob], filename, {
        type: res.headers['content-type']
      })

      return file
    } catch (err) {
      console.err('error!', err);
      return null
    }
  }

  defineExpose({
    open
  })
</script>

<style lang="scss" scoped>
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