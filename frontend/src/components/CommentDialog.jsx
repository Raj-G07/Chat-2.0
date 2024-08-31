import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Comment from './Comment';
import toast from 'react-hot-toast';
import { setPosts } from '../redux/postSlice';
import axios from 'axios';
import { useEffect } from 'react';
import SummaryApi from '../common';
const CommentDialog=({commentDial,setCommentDial})=> {
  const [open, setOpen] = useState(false);
  const {selectedPost,posts}= useSelector(store=>store.post)
  const [comment, setComment] = useState([]);
  const [text,setText] = useState("")
  const dispatch= useDispatch()
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  }
  const sendMessageHandler = async () => {

    try {
      const res = await axios.post(`${SummaryApi.handler.url}/${selectedPost?._id}/comment`, { text }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map(p =>
          p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(()=>{
    if(selectedPost){
      setComment(selectedPost.comments);
    }
  },[selectedPost])
  return (
    <div>
      <Dialog
        open={commentDial}
        onClose={()=>setCommentDial(false)}
      >
        <DialogContent  className='max-w-5xl p-0 flex flex-col'>
            <div className='flex flex-col'>
                <div className='W-1/2'>
                <img   className='w-full h-full object-cover rounded-l-lg' src={selectedPost?.image} alt="post_image"/>
                </div >
                <div  className='w-full flex flex-col justify-between'>
                    <div className='flex items-center justify-between p-4'>
                    <div className='flex gap-3 items-center'>
                        <Link>
                        <Avatar className="w-14 h-14 rounded-full border-2 border-white shadow-md" src={selectedPost?.author?.profilePhoto} alt="post_image"/>
                        </Link>
                        <div>
                            <Link className='font-semibold text-xs'>{selectedPost?.author?.username}</Link>
                        </div>
                    <div>
                    <Button onClick={handleClickOpen}>
                        •••
                    </Button>
                    <Dialog
                  open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              >
            <DialogContent>
        <div className='cursor-pointer w-full text-[#ED4956] font-bold'>
                    Unfollow
                  </div>
                  <div className='cursor-pointer w-full'>
                    Add to favorites
                  </div>
        </DialogContent>
                 </Dialog>
                  </div>
                    </div>
                    </div>
                    <hr/>
                    <div className='flex-1 overflow-y-auto max-h-96 p-4'>
                        {
                          comment.map((comment)=> <Comment key={comment._id} comment={comment}/>)
                        }
                    </div>
                    <div className='p-4'>
                     <div className='flex items-center gap-2'>
                        <input type='text' value={text} onChange={changeEventHandler}
                        placeholder='Add a comment...' className="w-full p-4 border border-gray-300 rounded-lg shadow-lg transition duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:shadow-xl focus:scale-105 placeholder-gray-500 text-gray-900 bg-white"/>
                        <Button disabled={!text.trim()} onClick={sendMessageHandler} variant='outline'>Send</Button>
                     </div>
                    </div>
                </div>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default CommentDialog