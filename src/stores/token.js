import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTokenStore = defineStore(
  'token',
  () => {
    const token = ref('')
    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }
    const isAuthenticated = () => {
      return !!token.value
    }
    return {
      token,
      setToken,
      removeToken,
      isAuthenticated
    }
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          key: 'token',
          storage: localStorage
        }
      ]
    }
  }
)
