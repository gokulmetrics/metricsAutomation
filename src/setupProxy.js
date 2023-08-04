const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports =app=>{
    app.use(
        createProxyMiddleware('/rest/greenhopper/1.0/rapid/charts/velocity.json?rapidViewId=8660',{
            target:'https://jira-ent.web.boeing.com',
            changeOrigin:true
        })
    )
}