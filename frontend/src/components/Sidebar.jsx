import React from "react";
import HomeIcon from '@mui/icons-material/Home';
import MessageIcon from '@mui/icons-material/Message';
import AddBoxIcon from '@mui/icons-material/AddBox';
import LogoutIcon from '@mui/icons-material/Logout';
import Popover from '@mui/material/Popover';
import {Box, Button, Stack, Typography} from "@mui/material"
import Avatar from '@mui/material/Avatar';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../redux/authSlice";
import { useState } from "react";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "../redux/postSlice";
import SummaryApi from "../common";

const Sidebar=()=>{
    const navigate= useNavigate()
    const {user}= useSelector(store=>store.auth)
    const {likeNotification}= useSelector(store=>store.realTimeNotification)
    const dispatch= useDispatch()
    const [open,setOpen]= useState(false)
    const logoutHandler= async()=>{
        try{
        const res= await axios.get(SummaryApi.logout.url,{ withCredentials: true })
        if(res.data.success){
            dispatch(setAuthUser(null))
            dispatch(setSelectedPost(null))
            dispatch(setPosts([]))
            navigate("/login");
            toast.success(res.data.message)
        }
        }catch(error){
            console.log(error)
        }
    }
    const [anchorEl, setAnchorEl] = useState(null);
    
      const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const opened = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
    const sidebarHandler = (textType) => {
        if (textType === "Logout") {
            logoutHandler();
        }else if (textType === "Home") {
            navigate("/");
        }else if (textType === "Create"){
            setOpen(true)
        }else if(textType === "Profile"){
            navigate(`/profile/${user?._id}`)
        }else if(textType=== "Message"){
            navigate('/chat')
        }
    }
    const categories=[
        {name:"Profile",icon: <Avatar className="w-14 h-14 rounded-full border-2 border-white shadow-md" alt="Remy Sharp" src={user?.profilePhoto} />},
        { name:"Home", icon:<HomeIcon/>,},
        { name:"Message", icon:<MessageIcon/>,},
        { name:"Create", icon:<AddBoxIcon/>,},
        {name:"Logout", icon:<LogoutIcon/>,},
    
    ]
    return (
        <div className='fixed top-0 z-10 left-0 px-4 w-1/6 h-screen'>
        <Stack direction="row"
        sx={{
            overflow: "hidden",
            height: { sx: "auto", md: "95%" },
            flexDirection: { md: "column" },
        }}
        >
            <Box sx={{ height: { sx: "auto", md: "92vh" }, borderRight: "1px solid #3d3d3d", px: { sx: 0, md: 2 } }}>
                <h1 className="my-8 pl-3 font-bold text-xl">App</h1>
                <div>
                {categories.map((category,index)=>{
                    return(
                    <div onClick={()=> sidebarHandler(category.name)} key={index} className="flex items-center gap-4 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3">
                        {category.icon}
                        <span>{category.name}</span>
                        {
                            category.name === "Notification" && likeNotification.length>0 && (
                                <div>

                         <Button aria-describedby={id} variant="contained" className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6" onClick={handleClick}>{likeNotification.length}</Button>
                            <Popover id={id} open={opened} anchorEl={anchorEl} onClose={()=> setAnchorEl(null)} anchorOrigin={{
                                vertical: 'bottom', horizontal:'left'
                            }}>
                                <Typography sx={{p:2}}>

                               <div>
                                {
                                    likeNotification.length===0 ? (<p>No new notification</p>):(
                                        likeNotification.map((notification)=>{
                                            return (
                                                <div key={notification.userId} className="flex items-center gap-2 my-2">
                                                   <Avatar className="w-14 h-14 rounded-full border-2 border-white shadow-md"src={notification.userDetails?.profilePicture} /> 
                                                   <p className="text-sm"><span>{notification.userDetails?.username}</span> liked your post</p>
                                                </div>
                                            )
                                        })
                                    )
                                }
                                </div> 
                                </Typography>
                            </Popover>
                                </div>
                            )
                        }
                    </div>
                )
            })}
                </div>
        
                     <CreatePost open={open} setOpen={setOpen}/>
            </Box>

        </Stack>
    </div>
    )
}

export default Sidebar