import { ref, computed } from 'vue'
import { useTokenStore } from '@/stores/token.js'

export function useAuth() {
  const tokenStore = useTokenStore()
  
  const isAuthenticated = computed(() => tokenStore.isAuthenticated())
  const token = computed(() => tokenStore.token)
  
  const login = (authToken) => {
    tokenStore.setToken(authToken)
  }
  
  const logout = () => {
    tokenStore.removeToken()
  }
  
  return {
    isAuthenticated,
    token,
    login,
    logout
  }
}