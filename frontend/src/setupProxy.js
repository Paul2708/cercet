const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:42069',
            changeOrigin: true,
            pathRewrite: {
                "^/api": ""
            }
        })
    );
};