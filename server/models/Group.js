import mongoose from 'mongoose'
const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
})
const Group = mongoose.model('Group',groupSchema)
export default Group  