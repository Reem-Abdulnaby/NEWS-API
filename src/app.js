const express=require('express')
require('dotenv').config()
const app=express()
const port=process.env.PORT 
const reporterRouter=require('./router/reporter')
const newsRouter=require('./router/news')
require('./db/mongoose')
app.use(express.json())
app.use(reporterRouter)
app.use(newsRouter)

app.listen(port,()=>{
    console.log('server is run '+ port)
})
