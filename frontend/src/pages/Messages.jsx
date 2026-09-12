import { useState, useEffect } from 'react'
import {socket} from '../services/socket'
import { useNavigate, useParams } from 'react-router-dom';
import { postMessage,getAllMessages } from '../services/api';
const Messages = ({activeGroup})=>{
    const [message, setMessage]=useState('')
    const [messages, setMessages]=useState([])
    const {groupId}=useParams()
    const navigate= useNavigate()
    useEffect(()=>{
        const fetch =async ()=>{
            try{
                socket.emit("join-group", { groupId })
                const res = await getAllMessages(groupId)
                const msg = res.data
                setMessages(msg)
            }catch(err){
                if (err.response?.status === 401) {
                    if (!localStorage.getItem("token")) {
                    navigate("/login")
                    }
                }
            }
        }   
    fetch()
    }
    ,[groupId])

    useEffect(()=>{
        const handleNewMessage= (newMessage)=>{
            setMessages(prev=>[...prev,newMessage])
        }
        socket.on("chat-message",handleNewMessage)
        return ()=>{
            socket.off('chat-message',handleNewMessage)
        }
    },[])

    const handleSubmit=async (e)=>{
        e.preventDefault()
        try{
            await postMessage({message,groupId})
        }
        catch(err){
            if (err.response?.status === 401) {
                if (!localStorage.getItem("token")) {
                    navigate("/login")
                }
            }
        }
        setMessage('')
    }
    
    return (
    <>
        <button onClick={()=>navigator.clipboard.writeText(groupId)}>share</button>
        <button onClick={()=>navigate(`/dashboard/${groupId}`)}>Dashboard</button>
        <h1>activeGroup</h1>
        <form onSubmit={handleSubmit}>
            <input type="text" value={message} onChange={e=>setMessage(e.target.value)}/>
            <button type='submit'>submit</button>   
        </form>
        <ul>
            {messages.map((msg)=>(
                
                <li key={msg._id}>{msg.content} by: {msg.userId.username}</li>
            ))}
        </ul>
    </>
    )
}
export default Messages