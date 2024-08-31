import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast"
import { useEffect } from "react";
import { useSelector } from "react-redux";
import SummaryApi from "../common";
const Signup=()=>{
    const [input, setInput] = useState({
        email: "",
        username: "",
        password: "",
      });
      const {user}= useSelector(store=>store.auth)
      const [loading,setLoading]= useState(false)
      const navigate= useNavigate();
      const onSubmitHandler= async (e)=>{
        e.preventDefault()
        try{
            setLoading(true)
            const res = await axios.post(SummaryApi.signup.url, input, {
                headers: {
                  'Content-Type': 'application/json'
                },
                withCredentials: true
              });
              if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
                setInput({
                    email: "",
                    username: "",
                    password: "",
                  })
              } 
        }catch(error){
         console.log(error)
        }finally{
            setLoading(false)
        }
         
      }
      useEffect(()=>{
        if(user){
         navigate("/")
        }
      },[])
    return (
        <div className="p-4 h-screen flex items-center justify-center">
        <div className="min-w-96 mx-auto">
            <div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100"> 
            <h1 className="text-3xl font-bold text-center">Signup</h1>
            <form onSubmit={onSubmitHandler} action="">
                <div>
                <label className='label p-2'>
                    <span className='text-base label-text'>Email</span>
                </label>
                <input 
                value={input.email}
                onChange={(e) => setInput({ ...input, email: e.target.value })}
                 className='w-full input input-bordered h-10' type="text" placeholder="rajgg@gmail.com"></input>
                </div>
                <div>
                <label className='label p-2'>
                    <span className='text-base label-text'>UserName</span>
                </label>
                <input  
                value={input.username}
                onChange={(e) => setInput({ ...input, username: e.target.value })}
                className='w-full input input-bordered h-10' type="text" placeholder="Raj Gupta"></input>
                </div>
                <div>
                <label className='label p-2'>
                    <span className='text-base label-text'>Password</span>
                </label>
                <input  
                 value={input.password}
                 onChange={(e) => setInput({ ...input, password: e.target.value })}
                className='w-full input input-bordered h-10' type="password" placeholder="De1231@"></input>
                </div>
                {loading ?(
                    <button className="btn btn-block btn-sm mt-2 border border-slate-700b">
                        Loading...
                    </button>
                ):(
                     <button type='submit' className='btn btn-block btn-sm mt-2 border border-slate-700b'>Singup</button> 
                )}
                <p className='text-center my-2'>Already have an account? <Link to="/login"> login </Link></p>
                <div>
                </div>
            </form>
            </div>
        </div>
      </div>
    )
}


export default Signup