<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <el-form 
      :model="formModel" 
      :rules="rules"
      ref="form" 
      size="large" 
      autocomplete="off" 
      v-if="isRegister">
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input 
          v-model="formModel.username" 
          :prefix-icon="User" 
          placeholder="请输入用户名">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="formModel.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请再次输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button 
            @click="register"
            class="button" 
            type="primary" 
            auto-insert-space>
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>
      <el-form 
        :model="formModel"
        :rules="rules"
        ref="form" 
        size="large" 
        autocomplete="off" 
        v-else>
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input 
            v-model="formModel.username"
            :prefix-icon="User" 
            placeholder="请输入用户名">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button 
            @click="login"
            class="button" 
            type="primary" 
            auto-insert-space
            >登录
            </el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup>
  import { User, Lock } from '@element-plus/icons-vue'
  import { userRegisterService,userLoginService } from '@/api/user.js'
  import { ref,watch } from 'vue'
  import { useUserStore } from '@/stores';
  import { ElMessage } from 'element-plus';
  import { useRouter } from 'vue-router';

  const isRegister = ref(false)
  const form = ref()
  const formModel = ref({
    username: '',
    password: '',
    repassword: ''
  })

  const rules = {
    username: [
      {
        // 1、非空校验
        required: true, message: '请输入用户名', trigger: 'blur'
      },
      {
        // 2、长度校验
        min: 5, max: 10, message: '用户名必须是5-10位的字符', trigger: 'blur'
      },
    ],
    password: [
      {
        // 1、非空校验
        required: true, message: '请输入密码', trigger: 'blur'
      },
      {
        // 2、正则匹配，\S非空字符
        pattern: /^\S{6,15}$/, message: '密码必须是6-15位的非空字符'
      }
    ],
    repassword: [
      {
        required: true, message: '请输入密码', trigger: 'blur'
      },
      {
        pattern: /^\S{6,15}$/, message: '密码必须是6-15位的非空字符'
      },
      {
        // callback() 校验成功
        // callback(new Error()) 校验失败
        // 无论成功还是不成功都要进行回调
        validator: (rule, value, callback) => {
          if (value !== formModel.value.password) {
            callback(new Error('再次输入密码不一致'))
          }
          else {
            callback()  // 校验成功
          }
        }
      }
    ]
  }

  const userStore = useUserStore()
  const router = useRouter()

  const register = async() => {
    // 注册成功之前的预校验 失败会自动提示
    await form.value.validate()
    await userRegisterService(formModel.value)
    ElMessage.success('注册成功！')
    isRegister.value = false
  }

  const login = async() => {
    await form.value.validate()
    const res = await userLoginService(formModel.value)
    userStore.setToken(res.data.token)
    ElMessage.success('登录成功！')
    router.push('/')
  }

  // 切换清空表单内容
  watch(isRegister,() => {
    formModel.value = {
      username: '',
      password: '',
      repassword: ''
    }
  })
</script>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>