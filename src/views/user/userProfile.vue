<template>
  <page-container title="基本资料">
    <el-row>
      <el-col :span="12">
        <el-form
          :model="form"
          :rules="rules"
          ref="formRef"
          label-width="100px"
          size="large"
        >
          <el-form-item label="登录名称">
            <el-input v-model="form.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickname">
            <el-input v-model="form.nickname"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </page-container>
</template>

<script setup>
  import { userGetInfoService, userUpdateInfoService } from '@/api/user';
  import { useUserStore } from '@/stores';
  import { ref } from 'vue'

  const formRef = ref()

  const { 
    user: { email, id, nickname, username},
    getUser
  } = useUserStore()

  const form = ref({
    id,
    username,
    nickname,
    email
  })

  const rules = ref({
    nickname: [
      {
        // 1、非空校验
        required: true, message: '请输入昵称', trigger: 'blur'
      },
      {
        pattern: /^\S{2,10}$/,
        message: '昵称必须是2-10位的非空字符串',trigger: 'blur'
      }
    ],
    email: [
      {
        // 1、非空校验
        required: true, message: '请输入邮箱', trigger: 'blur'
      },
      {
        type: 'email', message: '邮箱格式不正确', trigger: 'blur'
      }
    ]
  })

  const onSubmit = async() => {
    await formRef.value.validate()
    await userUpdateInfoService(form.value)
    getUser()
    ElMessage.success('修改成功！')  
  }
</script>