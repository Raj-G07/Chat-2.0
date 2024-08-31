import { Avatar, DialogContent } from "@mui/material";
import React from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import {MessageCircle, Send} from 'lucide-react'
import Slide from '@mui/material/Slide';
import {  FaHeart, FaRegHeart } from "react-icons/fa";
import { useState } from "react";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setPosts, setSelectedPost } from "../redux/postSlice";
import toast from "react-hot-toast";
import SummaryApi from "../common";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const Post=({post})=>{
    const [text,setText]= useState("")
    const [open, setOpen] = useState(false);
    const [commentDial,setCommentDial]= useState(false)
    const {user} = useSelector(store=>store.auth)
    const dispatch= useDispatch()
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
    const {posts}= useSelector(store=>store.post)
    const [postLike, setPostLike] = useState(post.likes.length);
    const [comment, setComment] = useState(post.comments);
    const handleClickOpen = () => {
        setOpen(true);
      };
      const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("");
        }
    }
    const likeOrDislikeHandler = async () => {
      try {
          const action = liked ? 'dislike' : 'like';
          const res = await axios.get(`${SummaryApi.handler.url}/${post._id}/${action}`, { withCredentials: true });
          console.log(res.data);
          if (res.data.success) {
              const updatedLikes = liked ? postLike - 1 : postLike + 1;
              setPostLike(updatedLikes);
              setLiked(!liked);

              // apne post ko update krunga
              const updatedPostData = posts.map(p =>
                  p._id === post._id ? {
                      ...p,
                      likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
                  } : p
              );
              dispatch(setPosts(updatedPostData));
              toast.success(res.data.message);
          }
      } catch (error) {
          console.log(error);
      }
  }
  const commentHandler = async () => {

    try {
        const res = await axios.post(`${SummaryApi.handler.url}/${post._id}/comment`, { text }, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
        if (res.data.success) {
            const updatedCommentData = [...comment, res.data.comment];
            setComment(updatedCommentData);

            const updatedPostData = posts.map(p =>
                p._id === post._id ? { ...p, comments: updatedCommentData } : p
            );

            dispatch(setPosts(updatedPostData));
            toast.success(res.data.message);
            setText("");
        }
    } catch (error) {
        console.log(error);
    }
}
    const deletePostHandler = async () => {
      try {
          const res = await axios.delete(`${SummaryApi.deletePost.url}/${post._id}`, { withCredentials: true })
          if (res.data.success) {
              const updatedPostData = posts.filter((postItem) => postItem?._id !== post?._id);
              dispatch(setPosts(updatedPostData));
              toast.success(res.data.message);
          }
      } catch (error) {
          console.log(error);
          toast.error(error.response.data.messsage);
      }
  }
      const handleClose = () => {
        setOpen(false);
      };
    return (
        <div className="my-8 w-full max-w-sm mx-auto">
        <div className="flex items-center justify-between">  
          <div className="flex items-center gap-2">
         <Avatar className="w-14 h-14 rounded-full border-2 border-white shadow-md" src={post.author?.profilePhoto} alt="post_image"/>
         <div className="flex items-center gap-3">
          <h1>
            {post.author?.username}
          </h1>
          {user?._id === post.author._id && <h1 className="text-blue-500">Author</h1>}
         </div>
        </div >
         <div>
         <Button onClick={handleClickOpen}>
           •••
         </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent className="flex flex-col items-center text-sm text-center">
          {
            post?.author?._id!== user?._id && 
          <Button className="cursor-pointer w-fit text-[#ED4956] font bold"  variant='text'  onClick={handleClose}>Unfollow</Button>
          }
          <Button className="cursor-pointer w-fit" variant="text" onClick={handleClose}>Add to favorites</Button>
          {
            user && user?._id === post?.author._id &&
          <Button className="cursor-pointer w-fit"variant="text" onClick={deletePostHandler}>Delete</Button>
          }
        </DialogContent>
      </Dialog>
       </div>
       </div> 
       <img   
       className='rounded-sm my-2 w-full aspect-square object-cover' 
       src={post.image}
       alt="post_image"/>
       <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
        {
          liked ? <FaHeart onClick={likeOrDislikeHandler} size={'24'} className='cursor-pointer text-red-600' /> : <FaRegHeart onClick={likeOrDislikeHandler} size={'22px'} className='cursor-pointer hover:text-gray-600' />  
                   }
         <MessageCircle onClick={()=>{
          dispatch(setSelectedPost(post))
          setCommentDial(true)}} className="'cursor-pointer hover:text-gray-600 "/>
         <Send className="'cursor-pointer hover:text-gray-600"/>
        </div>
       </div>
       <span className='font-medium block mb-2'>{postLike} likes</span>
       <p >
        <span className="font-medium mr-2">{post.author?.username}</span>
        {post.caption}
       </p>
       {
        comment.length>0 && (
          <span onClick={()=>{
            dispatch(setSelectedPost(post))
           setCommentDial(true)}} className="cursor-pointer text-sm text-gray-400">View all {comment.length} comments</span>
        )
       }
       <CommentDialog commentDial={commentDial} setCommentDial={setCommentDial}/>
       <div className='flex items-center justify-between' >
        <input
        type="text"
        value={text}
        placeholder="Add a comment..."
        onChange={changeEventHandler}
        className="w-full p-3 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 color:white"
        />
        {
          text && <span onClick={commentHandler} className='text-[#3BADF8] cursor-pointer'>Post</span>
          }
       </div>
        </div>
        
    )
}

export default Post