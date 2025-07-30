import React, { useContext, useState } from 'react'
import  bg from "../assets/authBg.png"
import axios from "axios"
import { FaRegEye } from "react-icons/fa6";
import { IoEye } from "react-icons/io5";
import {useNavigate} from 'react-router-dom'
import { userDataContext } from '../context/UserContext.jsx'

function SignIn  ()  {
    const [showPassword,setShowPassword]=useState(false)
    const {serverUrl,userData,setUserData}=useContext(userDataContext)
    const navigate=useNavigate()
    
    const[email,setEmail]=useState("")
    const [password,setpassword]=useState("")
    const[loading,setLoading]=useState(false)
    const[err,setErr]=useState("")

    const handleSignIn=async(e)=>{
      e.preventDefault()
      setErr("")
      setLoading(true)
      try {
        console.log(email, password)
        let result=await axios.post(`${serverUrl}/api/auth/login`,{
          email,password
        },{withCredentials:true})
        setUserData(result.data)
        setLoading(false)
        navigate("/")
      } catch (error) {
        setUserData(null)
        setLoading(false)
        setErr(error.response.data.message)
      }
      
    }



  return (
    <div className='w-full h-[100vh] bg-cover flex justify-center items-center' style={{backgroundImage:`url(${bg})`}} >
        <form onSubmit={handleSignIn}  className='w-[90%] h-[600px] max-w-[500px] bg-[#00000059] backdrop-blur-md shadow-lg shadow-black flex flex-col items-center justify-cemter gap-[20px] px-[20px] ' >
        <h1 className='text-white text-[30px] font-semibold mt-[100px]
    '>SignIn to <span className='text-blue-400'>Virtual Assistant</span></h1>

        


        <input type="email" placeholder='Email' className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[20px] rounded-full text-[18px]'required onChange={(e)=>setEmail(e.target.value)} value={email} />

        <div className='w-full h-[60px]  border-2 border-white bg-transparent text-white rounded-full text-[18px] relative'>
            <input type={showPassword?"text":"password"} placeholder='password' className='w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px]  ' required onChange={(e)=>setpassword(e.target.value)} value={password}  />

           {!showPassword &&
            <IoEye  className='absolute top-[18px] right-[20px] text-white w-[25px] h-[25px] cursor-pointer'onClick={()=>setShowPassword(true)}/>}

            {showPassword &&
            <FaRegEye  className='absolute top-[18px] right-[20px] text-white w-[25px] h-[25px] cursor-pointer'onClick={()=>setShowPassword(false)}/>}
        </div>

        {err.length>0 && <p className='text-red-500 text-[17px]'>*{err}</p>}

        <button type="submit"  className='min-w-[150px] h-[60px] bg-white rounded-full text-black-semibold bg-white rounded-full text-[19px] ' disabled={loading}> { loading? "Loading..." :"Sign In"}
        </button>
        

        <p className='text-white text-[18px] cursor-pointer  ' onClick={()=>navigate("/signup")}>Want to create new account? <span className='text-blue-400'>Sign Up</span></p>


        



        </form>

        
        </div>
  )
}

export default SignIn