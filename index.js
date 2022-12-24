const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const helmet = require('helmet')
const dotenv = require('dotenv')
const userRoute = require('./routes/user')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const conversationRoute = require('./routes/conversations')
const messageRoute = require('./routes/messages')
const multer = require('multer')
const path = require('path')


dotenv.config()

mongoose.connect(process.env.MONGO_URL,  
    (err) => {
        if(err) console.log(err)
        else console.log("Connected to MongoDB")
});

const PORT = process.env.PORT || 8080
const app = express()

app.use("/images", express.static(path.join(__dirname, "public/images")))

//Middlewares
app.use(express.json())
app.use(morgan("common"))
app.use(helmet())

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images")
    },
    filename: (req, file, cb) => {
        // console.log(req)
        // console.log(req.)
        cb(null, file.filename)
    }
})

const upload = multer({storage})

app.post("/api/upload", upload.single("file"), (req, res) => {
    try{
        res.status(200).json("File uploaded successfully")
    }catch(err){
        console.log(err)
    }
})

app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)
app.use('/api/conversations', conversationRoute)
app.use('/api/messages', messageRoute)

app.listen(PORT, ()=>{
    console.log(`Your app is running on localhost:${PORT}`)
})

