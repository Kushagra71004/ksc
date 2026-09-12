import { useState } from 'react'
import { Routes, Route } from "react-router-dom"
import Login from './pages/Login'
import Register from './pages/Register'
import Messages from './pages/Messages'
import Groups from './pages/Groups'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedComponent'
function App() {
  const [activeGroup, setActiveGroup]=useState('')
  return (
    <>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/groups' element={<ProtectedRoute><Groups setActiveGroup={setActiveGroup}/></ProtectedRoute>} />
        <Route path='/messages/:groupId' element={<ProtectedRoute><Messages activeGroup={activeGroup}/></ProtectedRoute>}/>
        <Route path='/dashboard/:groupId'element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
      </Routes>
    </>
  )
}

export default App
