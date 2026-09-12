import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import { socket } from '../services/socket'
import { postTransaction, getAllTransaction } from '../services/api'
const Dashboard=()=>{
    const [category, setCategory]=useState('')
    const [type, setType]=useState('expense')
    const [description,setDescription]=useState('')
    const [amountStr, setAmountStr]=useState("")
    const [transactions,setTransactions]=useState([])
    const [expense,setExpense]=useState("")
    const [income,setIncome]=useState("")
    const [net,setNet]=useState("")
    const {groupId}=useParams()
    useEffect(()=>{
        socket.emit('join-group',{groupId})
    },[groupId])



    useEffect(()=>{
        const fetch=async()=>{
            try{
                const res=await getAllTransaction(groupId)
                const transactionRes=res.data
                setTransactions(transactionRes)
                let expenseSum=0
                let incomeSum=0
                transactionRes.map(transaction=>{
                    if(transaction.type==='expense') {expenseSum=expenseSum+transaction.amount}
                    if(transaction.type==='income') {incomeSum=incomeSum+transaction.amount}
                })
                setExpense(expenseSum)
                setIncome(incomeSum)
                setNet(expenseSum+incomeSum)
            }
            catch(err){
            if (err.response?.status === 401) {
                if (!localStorage.getItem("token")) {
                    navigate("/login")
                }
            }
        }
    }
    fetch()
    },[groupId])



    useEffect(()=>{
        const handleNewTransaction=(transaction)=>{
            setTransactions(prev=>[...prev,transaction])
            if(transaction.type==='expense')setExpense(prev=>prev+transaction.amount)
            if(transaction.type==='income')setIncome(prev=>prev+transaction.amount)
        }
        socket.on('transaction',handleNewTransaction)
        return ()=>{
            socket.off('transaction',handleNewTransaction)
        }
    },[])



    const handleSelectChange=(e)=>{
        setType(e.target.value)
    }
    const handleSubmit= async (e)=>{
        e.preventDefault()
        const amount=Number(amountStr)
        try{
            await postTransaction({category, amount, type, description,groupId})
            setAmountStr("")
            setDescription("")
            setCategory("")
        }
        catch(err){
            if (err.response?.status === 401) {
                if (!localStorage.getItem("token")) {
                    navigate("/login")
                }
            }
        }
    }
    return(
        <>
            <h1>inside dashboard</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    enter transaction amount:
                    <input type="number" value={amountStr} min="1" onChange={e=>setAmountStr(e.target.value)}/>
                </label>
                
                <label>
                    <select value={type} onChange={handleSelectChange}>
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                </label>
                <br />
                <label >
                    type of transaction:
                    <input type="text" value={category} onChange={e=>setCategory(e.target.value)}/>
                </label>
                <br />
                <label>
                    description of transaction: 
                    <textarea value={description} onChange={e=>setDescription(e.target.value)}/>
                </label>
                <br />
                <button type='submit'>
                    submit
                </button>
            </form>
            <h1>{expense} <br /> {income} <br /> {net}   </h1>
            <ul>
                {transactions.map(transaction=>(
                    <li key={transaction._id}>{transaction.amount}</li>
                ))}
            </ul>
        </>
    )
}
export default Dashboard