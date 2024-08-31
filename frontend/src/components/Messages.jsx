import { Avatar, Button } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom'
import useGetAllMessage from "../hooks/useGetAllMessage";
import useGetRTM from "../hooks/useGetRTM";
const Messages=({selectedUser})=>{
    useGetRTM()
    useGetAllMessage()
    const {user} = useSelector(store=>store.auth);
    const {messages}= useSelector(store=>store.chat)
    return (
        <div className='overflow-y-auto flex-1 p-4'>
        <div className='flex justify-center'>
        <div className='flex flex-col items-center justify-center m-7'>
        <Avatar className="w-14 h-14 rounded-full border-2 border-white shadow-md" src={selectedUser?.profilePicture} alt='profile' />
        <span className="text-blue-500 font-bold italic" >{selectedUser?.username}</span>
        <Link to={`/profile/${selectedUser?._id}`}><Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md hover:shadow-lg transition duration-300" >View profile</Button></Link>
        </div>
        </div>

        <div className='flex flex-col gap-3'>{
            messages && messages.map((msg) => {
                        return (
                            <div key={msg._id} className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-2 rounded-lg max-w-xs break-words ${msg.senderId === user?._id ? 'bg-green-600 text-white' : 'bg-purple-600 text-white'}`}>
                                    {msg.message}
                                </div>
                            </div>
                        )
                    })
            }
        </div>
        </div>
    )
}

export default Messages