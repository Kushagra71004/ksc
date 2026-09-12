import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../utils/config.js'
const verifyToken=async(req,res,next)=>{
try{
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if(!token){
        return res.status(404).json({error:"error"})
    }
    const decoded=jwt.verify(token, SECRET_KEY)
    req.user = decoded.id
    next()
}catch(err){
    return res.status(401).json({error:"invalid token"})
}
}
export {verifyToken}   