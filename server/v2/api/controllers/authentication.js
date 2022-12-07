const { createProxyMiddleware } = require('http-proxy-middleware');

const apiProxy = createProxyMiddleware({
    target: 'http://192.168.1.224:5050',
    changeOrigin: true
});

module.exports = { apiProxy }