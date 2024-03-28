import { defineStore } from "pinia";
import { ref } from 'vue'

// 数字模块
export const useCountStore = defineStore('counter',() => {
  const sum = ref(100)

  const add = (val) => {
    sum.value += val
  }

  return {
    sum,
    add
  }
})