const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const helmet = require('helmet')
const dotenv = require('dotenv')
const userRoute = require('./routes/user')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')


dotenv.config()

mongoose.connect(process.env.MONGO_URL,  
    (err) => {
        if(err) console.log(err)
        else console.log("Connected to MongoDB")
});

const PORT = process.env.PORT || 8080
const app = express()

//Middlewares
app.use(express.json())
app.use(morgan("common"))
app.use(helmet())

app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)

app.listen(PORT, ()=>{
    console.log(`Your app is running on localhost:${PORT}`)
})

