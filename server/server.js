import express from 'express'
import cors from 'cors'
import {PORT, MONGODB_URL} from "./utils/config.js"
import mongoose, { set } from 'mongoose'
import dns from 'node:dns';
import {Server} from 'socket.io'
import { createServer } from 'node:http'
import userRoutes from './routes/auth.routes.js'
import setUpSocket from './socket/socket.js';
import groupRoutes from './routes/groups.routes.js'
import messageRoutes from './routes/messages.routes.js'
import transactionsRoute from './routes/transaction.routes.js';
const app = express();
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your React app's URL/Port
    methods: ["GET", "POST"]
  }
});

if (process.env.NODE_ENV !== 'production') {
  dns.setServers(['8.8.8.8']);
  console.log('Using fallback Google DNS for local development');
}

await mongoose.connect(MONGODB_URL)
    .then(()=>console.log("connected to mongodb"))
    .catch(err=>console.log(err))


app.use(cors({
    origin:"*"
}))
app.use(express.json())
setUpSocket(io)

app.use("/user", userRoutes);
app.use("/groups",groupRoutes)
app.use("/messages",messageRoutes(io))
app.use("/transaction",transactionsRoute(io))

server.listen(PORT,()=>{
    console.log('listening on port',PORT);
})