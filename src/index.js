const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user_router')
const productRouter = require('./routers/product_router')
const evidenceRouter = require('./routers/evidence_router')
const blogRouter = require('./routers/blog_router')


var cors = require('cors')

const app = express()
app.use(cors())
const port = process.env.PORT


app.use(express.json())
app.use(userRouter)
app.use(evidenceRouter)
app.use(productRouter)
app.use(blogRouter)


app.listen(port,()=>{
    console.log('Server started at '+port)
})