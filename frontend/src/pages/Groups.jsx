import {useState, useEffect} from 'react'
import {socket} from '../services/socket'
import { useNavigate, Link } from 'react-router-dom';
import { getAllGroups,postGroup, joinGroup } from '../services/api';
const Groups=({setActiveGroup})=>{
    const [createGroup,setCreateGroup]=useState('')
    const [groupsArr, setGroupsArr]=useState([])
    const [joinCode,setJoinCode]=useState('')
    const navigate = useNavigate();
    useEffect(()=>{
        const fetchGroup=async()=>{
            try{const res=await getAllGroups()
            console.log(res.data);
            const groups = res.data.groups
            setGroupsArr(groups)}
            catch(err){
                if (err.response?.status === 401) {
                    if (!localStorage.getItem("token")) {
                        navigate("/login")
                    }
                }
            }
        }
    fetchGroup()
    },[])
    const handleSubmit=async (e)=>{
        try{
            e.preventDefault()
            if (!createGroup.trim()) return;
            setActiveGroup(createGroup)
            const res=await postGroup(createGroup)
            const {_id}=res.data
            socket.emit('join-group',{groupId:_id})
            navigate(`/messages/${_id}`)
        }
        catch(err){
            if (err.response?.status === 401) {
                if (!localStorage.getItem("token")) {
                    navigate("/login")
                }
            }
        }
    }
    const handleCodeSubmit=async (e)=>{
        try{
            e.preventDefault()
            const res = await joinGroup(joinCode)
            const group=res.data
            setGroupsArr(prev=>[...prev,group])
            setJoinCode('')
        }    
        catch(err){
            if (err.response?.status === 401) {
                if (!localStorage.getItem("token")) {
                    navigate("/login")
                }
            }
        }
    }
    return (
        <>  
            <h2>Create Group</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" value={createGroup} onChange={e=>setCreateGroup(e.target.value)}/>
                <button type='submit'>submit</button>
            </form>
            <br />
            <h2>Join Group</h2>
            <form onSubmit={handleCodeSubmit}>
                <input type="text" value={joinCode} onChange={e=>setJoinCode(e.target.value)}/>
                <button type='submit'>submit</button>
            </form>
            <h1>groups</h1>
            <ul>
                {groupsArr.map(grp=>
                    (
                        <li key={grp._id}>
                            <Link  to={`/messages/${grp._id}`} onClick={()=>{socket.emit('join-group',{groupId:grp._id}); setActiveGroup(grp.name)}} >
                                {grp.name}
                            </Link>
                        </li>
                    )
                )}
            </ul>
        </>
    )
}
export default Groups