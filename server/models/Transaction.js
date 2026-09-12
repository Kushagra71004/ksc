import mongoose from 'mongoose'
const transactionSchema = new mongoose.Schema({
    groupId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Group',
        required:true
    },
    type:{
        type:String,
        required:true,
        enum:['income','expense'],
    },
    amount:{
        type:Number,
        required:true,
        min:1
    },
    category:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
},
{
    timestamps: true
})

const Transaction = mongoose.model('Transaction',transactionSchema)
export default Transaction