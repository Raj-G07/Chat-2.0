import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { setAuthUser } from "../redux/authSlice";
import { useEffect } from "react";
import SummaryApi from "../common";

const Login=()=>{
    const [input, setInput] = useState({
        email: "",
        password: "",
      })
      const dispatch= useDispatch();
      const [loading,setLoading]= useState(false)
      const {user} = useSelector(store=>store.auth)
      const navigate = useNavigate()
      const onSubmitHandler= async (e)=>{
        e.preventDefault()
        try{
            setLoading(true)
            const res = await axios.post(SummaryApi.login.url, input, {
                headers: {
                  'Content-Type': 'application/json'
                },
                withCredentials: true
              });
              if(res.data.success){
                  navigate("/");
                  dispatch(setAuthUser(res.data.user))
                  toast.success(res.data.message)
                  setInput({
                    email: "",
                    password: "",
                  })
              }
        }catch(error){
         toast.error(error.response.data.message);  
         console.log(error)
        }finally{
            setLoading(false)
        }
       
      }
      useEffect(()=>{
        if(user){
          navigate("/");
        }
      },[])
    return (
        <div className="p-4 h-screen flex items-center justify-center">
        <div className="min-w-96 mx-auto">
            <div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100"> 
            <h1 className="text-3xl font-bold text-center">Login</h1>
            <form onSubmit={onSubmitHandler}  action="">
                <div>
                <label className='label p-2'>
                    <span className='text-base label-text'>Email</span>
                </label>
                <input  
                value={input.username}
                onChange={(e) => setInput({ ...input,email: e.target.value })}
                className='w-full input input-bordered h-10' type="text" placeholder="User Name"></input>
                </div>
                <div>
                <label className='label p-2'>
                    <span className='text-base label-text'>Password</span>
                </label>
                <input  
                 value={input.password}
                 onChange={(e) => setInput({ ...input, password: e.target.value })}
                className='w-full input input-bordered h-10' type="password" placeholder="Password"></input>
                </div>
                {loading ?(
                    <button className="btn btn-block btn-sm mt-2 border border-slate-700b">
                        Loading...
                    </button>
                ):(
                     <button type='submit' className='btn btn-block btn-sm mt-2 border border-slate-700b'>Login</button> 
                )}
                <p className='text-center my-2'>Don't have an account? <Link to="/signup"> signup </Link></p>
            </form>
            </div>
        </div>
      </div>
    )
}


export default Login