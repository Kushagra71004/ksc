import axios from 'axios'
const login=async(username, password)=>{
    const response = await axios.post('http://localhost:3001/user/login',{
      username:username,
      password:password
    })
return response
}
const registration = async (username, password)=>{
    return await axios.post('http://localhost:3001/user/register',{
      username:username,
      password:password
    })
}
const api=axios.create({
    baseURL:'http://localhost:3001'
})


api.interceptors.request.use((config)=>{
    const token=localStorage.getItem('token')
    if(token){
        config.headers.Authorization=`Bearer ${token}`
    }
    return config
})
api.interceptors.response.use(
    response=>response,
    error=>{
        if(error.response&&error.response.status===401){
            localStorage.removeItem('token')
        }
    }
)


const getAllGroups=async()=>{
return await api.get("/groups")
}
const postGroup=async(groupName)=>{
return await api.post("/groups",{groupName})
}
const joinGroup=async(groupId)=>{
    return await api.post(`/groups/${groupId}`)
}
const getAllTransaction = async(groupId)=>{
    return await api.get(`/transaction/${groupId}`)
}
const postTransaction = async({category, amount, type, description,groupId})=>{
    return await api.post(`/transaction/${groupId}`,{category, amount, type, description})
}
const getAllMessages=async(groupId)=>{
    return await api.get(`/messages/${groupId}`)
}
const postMessage=async({message,groupId})=>{
    return await api.post(`/messages/${groupId}`,{message})
}

export {login,registration,getAllGroups,postGroup,getAllMessages,postMessage,joinGroup,postTransaction,getAllTransaction}