const config = {
  baseURL: process.env.VUE_APP_API_BASE_URL || "/api",
  timeout: 30000,
  maxRetries: 3,
  headers: {
    "Content-Type": "application/json",
  },
};

export default config;
