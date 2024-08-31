import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSuggestedUsers } from "../redux/authSlice";
import toast from "react-hot-toast";
import { IoSearch } from "react-icons/io5";
const Searchbar= ()=>{
    const [search,setSearch]= useState("");
    const {suggestedUsers}= useSelector(store=>store.auth)
    const dispatch= useDispatch();
    const searchSubmitHandler=(e)=>{
        e.preventDefault()
        const conversationUser= suggestedUsers?.find((user)=>user.username.toLowerCase().includes(search.toLowerCase()));
        if(conversationUser){
            dispatch(setSuggestedUsers([conversationUser]))
        }else {
            toast.error("User not found!")
        }
    }
    return (
        <div className="border-r border-slate-500 p-4 flex flex-col">
         <form onSubmit={searchSubmitHandler} action="" className="flex items-center gap-2">
            <input value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="input input-bordered rounded-md" placeholder="Search..."/>
            <button type='submit' className="btn bg-zinc-700 text-white">
                 <IoSearch className="w-6 h-6 outline-none"/>
            </button>
         </form>
        </div>
    )


}

export default Searchbar;