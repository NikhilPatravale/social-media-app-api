const router = require('express').Router()
const Conversation = require('../models/Conversation')
const Message = require('../models/Message')

//create conversation
router.post("/", async (req, res) => {
    const newConversation = new Conversation({
        conversation: [req.body.senderId, req.body.receiverId]
    })
    try {
        const createdConversation = await newConversation.save()
        res.status(200).json(createdConversation)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})


//get conversation
router.get("/", async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.body.conversationId)
        res.status(200).json(conversation)
    } catch (err) {
        res.status(500).json(err)
    }
})


//get all conversations
router.get("/:userId", async (req, res) => {
    try {
        const conversations = await Conversation.find({
            conversation: { $in: [req.params.userId] }
        })
        res.status(200).json(conversations)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router