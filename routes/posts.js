const router = require('express').Router()
const Post = require('../models/Post')
const User = require('../models/User')


//create post
router.post("/", async (req, res) => {
    try{
        const newPost = new Post(req.body)
        const post = await newPost.save()
        res.status(200).json(post)
    }catch(err){
        res.status(500).json(err)
    }
})


//update post
router.put("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id)
        if(post.userId === req.body.userId){
            const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
                $set: req.body
            })
            res.status(200).json(updatedPost)
        }else{
            res.status(403).json("You can update only your post")
        }
    }catch(err){
        res.status(500).json(err)
    }
})

//delete post
router.delete("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id)
        if(post.userId === req.body.userId){
            await Post.findByIdAndDelete(req.params.id)
            res.status(200).json("Post deleted")
        }else{
            res.status(403).json("You can delete only your post")
        }
    }catch(err){
        res.status(500).json(err)
    }
})


//like post
router.put("/:id/like", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id)
        if(!post.likes.includes(req.body.userId)){
            await Post.findByIdAndUpdate(req.params.id, {
                $push: {likes: req.body.userId}
            })
            res.status(200).json("Post liked")
        }else{
            await Post.findByIdAndUpdate(req.params.id, {
                $pull: {likes: req.body.userId}
            })
            res.status(200).json("Post unliked")
        }
    }catch(err){
        res.status(500).json(err)
    }
})


//get a post
router.get("/:id", async (req, res) => {
    try{
        const post = Post.findById(req.params.id)
        !post && res.status(403).json("Post not found")
        res.status(200).json(post)
    }catch(err){
        res.status(500).json(err)
    }
})


//get feed posts
router.get("/feed/:id", async (req, res) => {
    try{
        const currUser = await User.findById(req.params.id)
        const feedPosts = await Post.find({userId: req.params.id})
        const followingPosts = await Promise.all(
            currUser.following.map(item => Post.find({userId: item}))
        )
        res.status(200).json(feedPosts.concat(...followingPosts))
    }catch(err){
        res.status(500).json(err)
    }
})


//get timeline posts
router.get("/timeline/:userName", async (req, res) => {
    try{
        const user = await User.findOne({userName: req.params.userName})
        const timelinePosts = await Post.find({userId: user._id})
        res.status(200).json(timelinePosts)
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router