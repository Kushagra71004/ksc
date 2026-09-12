import express  from "express"
const router = express.Router();
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../utils/config.js';
import User from '../models/User.js'

router.post("/register",async (req,res)=>{
    const {username, password}=req.body
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser= new User({
        username:username,
        password:hashedPassword
    })
    const user= await newUser.save()
    const token = jwt.sign(
        { id: user._id.toString(), username: username },
        SECRET_KEY,
        { expiresIn: '1h' }
    ); 
    res.status(201).json({user,token})
})

router.post("/login", async (req,res)=>{
    const { username, password } = req.body;

try {
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid username or password" });
    }
   const token = jwt.sign(
        { id: user._id.toString(), username: username },
        SECRET_KEY,
        { expiresIn: '1h' }
    ); 
    return res.json({ message: "login successful", token: token });
} catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error" });
}
})
export default router