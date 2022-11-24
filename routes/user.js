const router = require('express').Router()
const bcrypt = require('bcrypt')
const userModel = require('../models/User')
const { route } = require('./auth')

//update user
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10)
            const hashedPass = await bcrypt.hash(req.body.password, salt)
            req.body.password = hashedPass 
        }
        try{
            const user = await userModel.findByIdAndUpdate(req.body.userId,{
                $set: req.body
            })
            res.status(200).json("Account has been updated successfully")
        } catch(err){
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("You can update only your account")
    }
})

//delete user
router.delete("/:id", async (req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            const user = await userModel.findByIdAndDelete(req.body.userId)
            !user && res.status(404).json("user not found")
            res.status(200).json("Account has been deleted successfully")
        }catch(err){
            res.status(500).json(err)
        }
    }else{
        res.status(403).json("You can delete only your account")
    }
})


//get user
router.get("/:id", async (req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            const user = await userModel.findById(req.body.userId)
            !user && res.status.find(404).json("user not found")
            const {password, updatedAt, ...others} = user._doc
            res.status(200).json(others)
        }catch(err){
            console.log(err)
            res.status(500).json(err)
        }
    }else{
        res.status(403).json("You can get only your details")
    }
})


//follow user
router.put("/:id/follow", async (req, res) => {
    if(req.body.userId !== req.params.id){
        try{
            const userToFollow = await userModel.findById(req.params.id)
            const currUser = await userModel.findById(req.body.userId)

            !userToFollow && res.status(404).json("user not found")
            if(!userToFollow.followers.includes(req.body.userId) 
                && !currUser.following.includes(req.params.id)){
                const followingUser = await userModel.findByIdAndUpdate(req.params.id,{
                    $push: {followers: req.body.userId}
                })
                const followerUser = await userModel.findByIdAndUpdate(req.body.userId,{
                    $push: {following: req.params.id}
                })
                res.status(200).json("User has been followed")
            } else{
                res.status(403).json("User is alreay followed")
            }
        }catch(err){
            res.status(500).json(err)
        }
    }else{
        res.status(403).json("you cant follow yourself")
    }
})


//unfollow user
router.put("/:id/unfollow", async (req, res) => {
    if(req.body.userId !== req.params.id){  
        try{
            const userToUnfollow = await userModel.findById(req.params.id)
            const currUser = await userModel.findById(req.body.userId)
            
            if(currUser.following.includes(req.params.id)){
                const unfollowed = await userModel.findByIdAndUpdate(req.body.userId,{
                    $pull: {following: req.params.id}
                })
                const unfollower = await userModel.findByIdAndUpdate(req.params.id,{
                    $pull: {followers: req.body.userId}
                })
                res.status(200).json("User unfollowed")
            }else{
                res.status(403).json("You are not following this user")
            }
        }catch(err){
            console.log(err)
            res.status(500).json(err)
        }
    }else{
        res.status(403).json("You can't perform unfollow on your own id")
    }
})

module.exports = router