import mongoose from 'mongoose'
const messageSchema = new mongoose.Schema({
    groupId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    type:{
        type:String,
        enum:['text', 'expense', 'income'],
        required:true,
        default:'text'
    },
    content: {
        type: String,
        required: true
    },
    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
        default: null
    }
 },
{
timestamps:true
})
const Message = mongoose.model('Message',messageSchema)
export default Message