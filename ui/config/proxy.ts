export default {
  dev: {
    '/api/': {
      target: 'http://localhost:8080',  // 修改为您的后端服务器地址
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
};
