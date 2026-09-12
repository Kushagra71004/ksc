import express from 'express'
import { verifyToken } from "../middleware/auth.js"
import Transaction from '../models/Transaction.js'
import Message from '../models/Message.js'
const transactionsRoute=(io)=>{
    const router=express.Router()
    router.post('/:id',verifyToken,async (req ,res)=>{
        try{
            const groupId=req.params.id
            const {category,amount,type,description} = req.body
            const userId=req.user
            const transaction = await Transaction.create({
                groupId,
                category,
                description,
                amount,
                type,
                userId
            })
            await transaction.populate("userId","username")
            const message = await Message.create({
                groupId,
                userId,
                type,
                content:category,
                transactionId:transaction._id
            })
            await message.populate("userId","username")
            io.to(groupId).emit("transaction",transaction)
            io.to(groupId).emit("chat-message",message)
            console.log(transaction)
            res.status(201).end()
        }
        catch(err){ 
            console.log(err);
            return res.status(500).json({ err: err.message })
        }   
    })
    router.get('/:id',verifyToken,async (req,res)=>{
        const groupId=req.params.id
        const transaction=await Transaction.find({groupId})
            .sort({createdAt: 1})
            .populate('userId','username')
        res.status(201).json(transaction)
    })
    return router
}
export default transactionsRoute