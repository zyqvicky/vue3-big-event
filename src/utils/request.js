import axios from 'axios'
import { useUserStore } from '@/stores';
import { ElMessage } from 'element-plus';
import router from '@/router';
const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  baseURL,
  timeout: 10000,
});

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const useStore = useUserStore()
  if (useStore.token) {
    config.headers.Authorization = useStore.token
  }
  return config;
}, 
  function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  if (response.data.code === 0) {
    return response
  }
  // 处理业务失败，给出错误提示，抛出错误
  ElMessage.error(response.data.message || '服务异常')
  return Promise.reject(response.data);
}, 
  function (error) {
  // 错误的特殊情况401 =>权限不足，token过期
    if (error.response?.status === 401) {
      router.push('/login')
    }

  // 错误的默认情况
  ElMessage.error(error.response.data.message || '服务异常')
  return Promise.reject(error);
});

export default instance
export { baseURL }