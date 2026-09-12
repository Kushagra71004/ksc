import express  from "express"
import { verifyToken } from "../middleware/auth.js"
import Message from '../models/Message.js'

const messageRoutes=(io)=>{
    const router = express.Router()
    router.get("/:groupId",verifyToken,async(req,res)=>{
        console.log("inside get message");
    try{
        const groupId=req.params.groupId
        const message=await Message.find({groupId:groupId}).select('userId content type createdAt')
            .sort({ createdAt: 1 })
            .populate("userId", "username");
        res.status(201).json(message)
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Failed to fetch messages" });
    }
})
router.post("/:groupId",verifyToken,async(req,res)=>{
    const {groupId} = req.params
    const {message} = req.body
    const userId = req.user
    const newMessage = await Message.create({
        groupId,
        content:message,
        userId,
        type:"text"
    })
    await newMessage.populate("userId", "username");
    io.to(groupId).emit("chat-message",newMessage)
    res.status(201).json(newMessage);
})

return router
}
export default messageRoutes