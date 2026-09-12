import { useState, useEffect } from 'react'
import { registration } from '../services/api'
import {Link, useNavigate} from 'react-router-dom'


const Register=()=>{
  const [registerUsername,setRegisterUsername]=useState('')
  const [registerPassword,setRegisterPassword]=useState('')
  const navigate= useNavigate()
  const handleRegistration=async (e)=>{
    e.preventDefault()
    try{
    const res=await registration(registerUsername, registerPassword)
    const {token}=res.data
    setRegisterPassword('')
    setRegisterUsername('')
    localStorage.setItem('token',token)
    navigate('/groups')
    }
    catch(error){
      console.error("Login failed:", error)
    }
  }
  useEffect(()=>{
    const token = localStorage.getItem('token')
    if(token) navigate('/groups')
  },[])
  return (
    <>
    <div>
        <p>register</p>
        <form onSubmit={handleRegistration}>
        <label>username</label>
        <input value={registerUsername} onChange={e=>setRegisterUsername(e.target.value)} type="text" />
        <br />
        <label>password</label>
        <input value={registerPassword} onChange={e=>setRegisterPassword(e.target.value)} type="password" />
        <br />
        <button>submit</button>
        </form>
        <Link to="/login">Login Here</Link>
    </div>
    </>
  )
}
export default Register