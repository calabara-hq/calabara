const ROUTES = [
    {
        url: '/authentication',
        proxy: {
            target: "http://192.168.1.224:5050/isAuthenticated",
            changeOrigin: true,
            pathRewrite: {
                [`^/authentication`]: '',
            },
        }
    },
]

exports.ROUTES = ROUTES;