import { Avatar, Button } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/authSlice";
import Messages from "./Messages";
import { MessageCircleCode } from 'lucide-react';
import { useState } from "react";
import axios from 'axios';
import { setMessages } from "../redux/chatSlice";
import { useEffect } from "react";
import Searchbar from "./Searchbar";
import SummaryApi from "../common";
const ChatPage=()=>{
    const {user,suggestedUsers,selectedUser}= useSelector(store=>store.auth)
    const [textMessage,setTextMessage]= useState("");
    const {onlineUsers,messages}= useSelector(store=>store.chat)
    const dispatch = useDispatch();

    const sendMessageHandler = async (receiverId) => {
        try {
            const res = await axios.post(`${SummaryApi.sendMessage.url}/${receiverId}`, { textMessage }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setMessages([...messages,res.data.newMessage]))
                setTextMessage("");
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null));
        }
    },[]);
 
    return(
        <div className='flex h-screen'>
          <div className="flex sm:h-[350px] md:h-[450px] rounded-lg backdrop-filter backdrop-blur-lg bg-opacity-0">
          <section className='w-full md:w-1/6 my-8'>
           <Searchbar/>
          <h1 className='font-bold mb-4 px-3 text-xl'>{user?.username}</h1>
          <div >
            {
                suggestedUsers.map((suggestedUser) => {
                    const isOnline= onlineUsers.includes(suggestedUser?._id)
                    return (
                        <div onClick={() => dispatch(setSelectedUser(suggestedUser))} className='flex gap-3 items-center p-3 cursor-pointer'>
                            <Avatar className="w-14 h-14 rounded-full border-2 border-white shadow-md hover:border-blue-500" src={suggestedUser?.profilePicture} />
                        <div className='flex flex-col'>
                            <span className='font-medium'>{suggestedUser?.username}</span>
                            <span className={`text-xs font-bold ${isOnline? 'text-green-700':'text-rose-600'}`}>{isOnline ? 'online' : 'offline'}</span>
                        </div>
                    </div>
                )
            })
        }
          </div>

          </section>
          </div>
          {
                selectedUser ? (
                    <section className='flex-1 border-lime-50 flex flex-col h-full'>
                        <div className='flex gap-3 items-center px-3 py-2 fixed top-0 bg-white w-full z-10 '>
                                <Avatar className="w-14 h-14 rounded-full border-2 border-white shadow-md" src={selectedUser?.profilePicture} alt='profile' />
                                  <div className='flex flex-col'>
                                <span className="font-medium">{selectedUser?.username}</span>
                            </div>
                        </div>
                        <Messages selectedUser={selectedUser}/>
                        <div className='flex items-center'>
                            <input type="text" value={textMessage} onChange={(e)=>setTextMessage(e.target.value)} className='border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 w-full' placeholder="Messages..." />
                            <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"onClick={()=>sendMessageHandler(selectedUser?._id)}>Send</Button>
                        </div>
                    </section>
                ) : (
                    <div className='flex flex-col items-center justify-center mx-auto'>
                        <MessageCircleCode className="w-32 h-32 my-4 text-blue-500 bg-gray-100 rounded-full p-4 border-2 border-blue-500 flex justify-center items-center" />
                        <h1 className='text-4xl font-bold text-center text-blue-500'>Your messages</h1>
                        <span className="text-blue-500 font-bold italic ">Send a message to start a chat.</span>
                    </div>
                )
            }
        </div>
    )
}

export default ChatPage