import express  from "express"
import { verifyToken } from "../middleware/auth.js"
import Group from '../models/Group.js'
const router = express.Router()
router.get("/",verifyToken,async (req,res)=>{
    try{
    const id=req.user
    const groups=await Group.find({
        members:id
    }).select('name')
    if(!groups) res.status(401).json({error: "error"})
    res.status(200).json({groups,id})
    }
    catch(err){
        console.log(err);
        res.json(500)
    }
})
router.post("/",verifyToken,async (req,res)=>{
    try{
    const {groupName}=req.body
    const userId=req.user
    const group=new Group({
        name: groupName,
        createdBy: userId,
        members: [userId]
    })
    console.log(req.user);
    const createdGroup=await group.save()
    res.status(200).json(createdGroup)
    }
    catch(err){
        console.log(err)
        res.json(500)
    }
})
router.post('/:id',verifyToken,async(req,res)=>{
    const groupId = req.params.id
    const id=req.user
    try{
        const updatedGroups=await Group.findByIdAndUpdate(
            groupId,
            {$addToSet: {members:id}},
            {new:true}
        )
        res.status(201).json(updatedGroups)
    }
    catch(err){
        console.log(err);
        res.status(401)
    }
})
export default router    