import { Avatar, Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";
import {useRef} from "react";
import {toast} from "react-hot-toast"
import { readFileAsDataURL } from "../lib/utils";
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../redux/postSlice";
import SummaryApi from "../common";
const CreatePost=({open,setOpen})=>{
    const imageRef = useRef();
    const [file,setFile] = useState("")
    const [caption, setCaption] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [loading,setLoading]=useState(false)
    const {user}= useSelector(store=>store.auth)
    const {posts} = useSelector(store=>store.post)
    const dispatch= useDispatch()
    const fileChangeHandler = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
          setFile(file);
          const dataUrl = await readFileAsDataURL(file);
          setImagePreview(dataUrl);
        }
      }
    const createPostHandler= async(e)=>{
        e.preventDefault()
        const formData = new FormData();
        formData.append("caption", caption);
        if(imagePreview) formData.append("image",file)
        try{
          setLoading(true);
          const res= await axios.post(SummaryApi.addPost.url,formData,{
            headers:{
              'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
          })
          if(res.data.success){
            dispatch(setPosts([res.data.post,...posts]))
            toast.success(res.data.message)
            setOpen(false)
          }
        }catch(error){
             console.log(error)
        }finally{
          setLoading(false)
        }
    }
    return (
     <div>
          <Dialog
                  open={open}
              onClose={()=>setOpen(false)}
              >
                 <DialogTitle id="alert-dialog-title" >
                 {"Creat new post"}
                 </DialogTitle>
             <DialogContent>
             <div className='flex gap-3 items-center'>
                <Avatar className="w-14 h-14 rounded-full border-2 border-white shadow-md" src={user?.profilePhoto} alt="img"/>
             <div>
            <h1 className='font-semibold text-xs'>{user?.username}</h1>
            <span className='text-gray-600 text-xs'>About..</span>
          </div>
             </div>
             <textarea value={caption} onChange={(e)=>setCaption(e.target.value)} className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none shadow-sm text-white" placeholder="Write a caption..."/>
             {
              imagePreview && (
                <div className='relative overflow-hidden rounded-lg shadow-md'>
              <img src={imagePreview} alt="preview_img" className='w-full h-full object-cover rounded-lg' />
            </div>
              )
             }
             <input ref={imageRef} type="file" className="hidden" onChange={fileChangeHandler}  />
             <Button onClick={()=>imageRef.current.click()}className='w-full mx-auto bg-[#0095F6] hover:bg-[#258bcf]'>Select from computer</Button>
             {
              imagePreview && (
               loading ? (
                <Button className="w-full">
                     <CircularProgress className="mr-2 h-4 w-4" />
                     Please wait
                </Button>
               ):(
                <Button onClick={createPostHandler} type="submit" className="w-full">
                  Post
                </Button>
               )
              )
             }
        </DialogContent>
                 </Dialog>
     </div>
    )
}

export default CreatePost