const router = require('express').Router()
const UserModel = require('../models/User')
const bcrypt = require('bcrypt')


//Register
router.post("/register", async (req, res) => {
    try {
        //password hashing
        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(req.body.password, salt)

        //creating new user
        const newUser = new UserModel({
            userName: req.body.userName,
            email: req.body.email,
            password: hashedPass
        })

        //saving new user and responding
        const user = await newUser.save()
        res.status(200).json(user)
    } catch (err) {
        res.json(err)
    }
})


//Login
router.post("/login", async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email })

        !user && res.status(404).send("user not found")

        const hashedPass = user.password
        const passMatch = await bcrypt.compare(req.body.password, hashedPass)

        !passMatch && res.status(400).send("incorrect password")

        res.status(200).json(user)
    } catch (err) {
        console.log(err)
    }
})

module.exports = router