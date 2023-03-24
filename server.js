const express =require('express')
const next = require('next')

const {CreateProxyMiddleware, createProxyMiddleware}=require("http-proxy-middleware");

const dev =process.env.NODE_ENV !== "production";
const app =next({dev});
const handle =app.getRequestHandler();


app.prepare().then(()=>{
    const server =express()
       //apply proxy in dev mode
       if(dev){
            server.use('/api',createProxyMiddleware({
                target: "http://142.93.208.131",
                // target:"http://localhost:8000",
                changeOrigin:true,
            }))
       }
       server.all('*',(req,res) =>{
        return handle(req,res);
       });

       server.listen(3000,(err)=>{
        if(err) throw err;
        console.log("ready on api/register:8000")
       })
}).catch ((err) =>{
    console.log("error",err);
});