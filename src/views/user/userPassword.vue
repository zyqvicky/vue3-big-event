<template>
  <page-container title="重置密码">
    <el-row>
      <el-col :span="12">
        <el-form
          :model="form"
          :rules="rules"
          ref="formRef"
          label-width="100px"
          size="large"
        >
          <el-form-item label="原密码" prop="old_pwd">
            <el-input v-model="form.old_pwd"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="new_pwd">
            <el-input v-model="form.new_pwd"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="re_pwd">
            <el-input v-model="form.re_pwd"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onUpdate">修改密码</el-button>
            <el-button type="primary" plain @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </page-container>
</template>

<script setup>
  import { userUpdatePassService } from '@/api/user'
  import router from '@/router'
  import { ref } from 'vue'
  import { useUserStore } from '@/stores'

  const formRef = ref()
  const userStore = useUserStore()
  const form = ref({
    old_pwd: '',
    new_pwd: '',
    re_pwd: ''
  })

  const rules = ref({
    old_pwd: [
      {
        required: true, message: '请输入旧密码', trigger: 'blur'
      },
      {
        pattern: /^\S{6,15}$/, 
        message: '密码必须是6-15位的非空字符'
      }
    ],
    new_pwd: [
      {
        required: true, message: '请输入新密码', trigger: 'blur'
      },
      {
        pattern: /^\S{6,15}$/, 
        message: '密码必须是6-15位的非空字符'
      },
      {
        validator: (rule, value, callback) => {
          if (value === form.value.old_pwd) {
            callback(new Error('新密码不能与旧密码相同'))
          }
          else {
            callback()  // 校验成功
          }
        }
      }
    ],
    re_pwd: [
      {
        required: true, message: '请再次输入密码', trigger: 'blur'
      },
      {
        pattern: /^\S{6,15}$/, 
        message: '密码必须是6-15位的非空字符'
      },
      {
        validator: (rule, value, callback) => {
          if (value !== form.value.new_pwd) {
            callback(new Error('再次输入密码不一致'))
          }
          else {
            callback()  // 校验成功
          }
        }
      }
    ],
  })

  const onUpdate = async() => {
    const valid = await formRef.value.validate()
    if (valid) {
      await userUpdatePassService(form.value)
      ElMessage.success('密码修改成功！')
      userStore.setToken('')
      userStore.setUser({})
      router.push('/login')
      ElMessage('请重新登录！')
    }
  }

  const onReset = () => {
    formRef.value.resetFields()
  }
</script>
