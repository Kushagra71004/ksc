import { useState, useEffect } from 'react'
import {login} from '../services/api'
import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
const Login=()=>{
  const [username,setUsername]=useState('')
  const [password,setPassword]=useState('')
  const navigate = useNavigate()
  useEffect(()=>{
    const token = localStorage.getItem('token')
    if(token) navigate('/groups')
  },[])
  const handleLogin=async(e)=>{
    e.preventDefault()
    try{
      const res=await login(username, password)
      const {token}=res.data
      localStorage.setItem('token',token)
      setUsername('')
      setPassword('')
      navigate('/groups')
    }
    catch(err){
      console.log('error',err);
    }
}

return (
    <>
    <p>login</p>
      <form onSubmit={handleLogin}>
        <label>username</label>
        <input value={username} onChange={e=>setUsername(e.target.value)} type="text" />
        <br />
        <label>password</label>
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" />
        <br />
        <button type='submit'>submit</button>
      </form>
    <Link to="/register">Register Here</Link>
    </>
)
}
export default Login