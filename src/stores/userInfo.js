import { defineStore } from 'pinia'
import { ref } from 'vue'

const useUserInfoStore = defineStore('userInfo', () => {
  const Info = ref('')
  
  const setInfo = (newInfo) => {
    Info.value = newInfo
  }
  
  const removeInfo = () => {
    Info.value = ''
  }
  
  const updateInfo = (partialInfo) => {
    Info.value = { ...Info.value, ...partialInfo }
  }
  
  return {
    Info,
    setInfo,
    removeInfo,
    updateInfo
  }
}, {
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'userInfo',
        storage: localStorage
      }
    ]
  }
})

export default useUserInfoStore