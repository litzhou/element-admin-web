var proxyList = {
  '/api': {
    target: 'http://localhost:8082',
    changeOrigin: true
  },
}

console.log('设置代理中...', proxyList)
module.exports = {
  proxyList,
}
