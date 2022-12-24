const router = require('express').Router()
const Message = require('../models/Message')


//create message
router.post("/", async (req, res) => {
    const newMessage = new Message({
        conversationId: req.body.conversationId,
        senderId: req.body.senderId,
        messageText: req.body.messageText
    })
    try {
        const createdMessage = await newMessage.save()
        res.status(200).json(createdMessage)
    } catch (err) {
        res.status(500).json(err)
    }
})


//get all messages
router.get("/:conversationId", async (req, res) => {
    try {
        const message = await Message.find({
            conversationId: req.params.conversationId
        })
        res.status(200).json(message)
    } catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router