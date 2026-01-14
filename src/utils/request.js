import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useTokenStore } from '@/stores/token.js';
import router from '@/router';

const baseURL = '/api';
const instance = axios.create({ baseURL, timeout: 30000 });

const pendingRequests = new Map();

const generateRequestKey = (config) => {
  const { method, url, params, data } = config;
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&');
};

const addPendingRequest = (config) => {
  const requestKey = generateRequestKey(config);
  if (pendingRequests.has(requestKey)) {
    config.cancelToken = new axios.CancelToken((cancel) => {
      cancel(`重复请求: ${requestKey}`);
    });
  } else {
    config.cancelToken = new axios.CancelToken((cancel) => {
      pendingRequests.set(requestKey, cancel);
    });
  }
};

const removePendingRequest = (config) => {
  const requestKey = generateRequestKey(config);
  if (pendingRequests.has(requestKey)) {
    const cancel = pendingRequests.get(requestKey);
    cancel(requestKey);
    pendingRequests.delete(requestKey);
  }
};

instance.interceptors.request.use(
  (config) => {
    removePendingRequest(config);
    addPendingRequest(config);
    
    const tokenStore = useTokenStore();
    if (tokenStore.token) {
      config.headers.Authorization = 'Bearer ' + tokenStore.token;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
)

instance.interceptors.response.use(
  (result) => {
    removePendingRequest(result.config);
    
    if (result.data.code === 0) {
      return result.data;
    }
    
    const errorMessage = getErrorMessage(result.data.code, result.data.message);
    ElMessage.error(errorMessage);
    return Promise.reject(result.data);
  },
  (err) => {
    if (axios.isCancel(err)) {
      console.log('请求被取消:', err.message);
      return Promise.reject(err);
    }
    
    if (err.config) {
      removePendingRequest(err.config);
    }
    
    if (err.response) {
      handleErrorResponse(err.response);
    } else if (err.request) {
      ElMessage.error('网络连接失败，请检查网络设置');
    } else {
      ElMessage.error('请求配置错误');
    }
    
    return Promise.reject(err);
  }
)

const getErrorMessage = (code, defaultMessage) => {
  const errorMessages = {
    1001: '用户名已存在',
    1002: '用户名或密码错误',
    1006: '原密码错误',
    1007: '新密码与原密码一致',
    1008: '新密码与确认密码不一致',
    2001: '分类不存在',
    2002: '分类下存在文章，无法删除',
    2003: '文章不存在',
    3001: '文件上传失败',
    3002: '文件格式不支持',
    4002: '必要参数不能为空',
    4003: '参数格式错误'
  };
  
  return errorMessages[code] || defaultMessage || '操作失败';
};

const handleErrorResponse = (response) => {
  const { status, data } = response;
  
  switch (status) {
    case 401:
      ElMessage.error('登录已过期，请重新登录');
      const tokenStore = useTokenStore();
      tokenStore.removeToken();
      router.push('/login');
      break;
    case 403:
      ElMessage.error('没有权限访问该资源');
      break;
    case 404:
      ElMessage.error('请求的资源不存在');
      break;
    case 500:
      ElMessage.error('服务器内部错误，请稍后重试');
      break;
    case 502:
      ElMessage.error('网关错误');
      break;
    case 503:
      ElMessage.error('服务不可用');
      break;
    case 504:
      ElMessage.error('请求超时');
      break;
    default:
      ElMessage.error(data?.message || `请求失败 (${status})`);
  }
};

export default instance;