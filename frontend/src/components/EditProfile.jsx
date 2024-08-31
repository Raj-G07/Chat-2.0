import {useRef} from "react";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import { Avatar, Button, CircularProgress, InputLabel } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { setAuthUser } from "../redux/authSlice";
import SummaryApi from "../common";
const EditProfile=()=>{
    const imageRef = useRef();
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const [input, setInput] = useState({
        profilePhoto: user?.profilePhoto,
        about: user?.about,
        gender:user?.gender,
    });
    const navigate= useNavigate();
    const dispatch= useDispatch();

    const selectChangeHandler = (e) => {
        const gender= e.target.value
        setInput({ ...input, gender: gender});
    }


    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) setInput({ ...input, profilePhoto: file });
    }

    const editProfileHandler= async()=>{
        const formData= new FormData();
        formData.append("about",input.about);
        formData.append("gender",input.gender)
        if(input.profilePhoto){
            formData.append("profilePhoto",input.profilePhoto);
        }
       try{
        setLoading(true);
        const res= axios.post(SummaryApi.editProfile.url,formData,{
            headers:{
                'Content-Type':'multipart/form-data'
            },
            withCredentials:true
        })
        if(res.data.success){
            const updatedUserData= {
                ...user,
                about:res.data.user?.about,
                profilePhoto:res.data.user?.profilePhoto,
                gender:res.data.user.gender
            }
            console.log(updatedUserData);
            dispatch(setAuthUser(updatedUserData))
            navigate(`/profile/${user?._id}`)
            toast.success(res.data.message)
        }
       }catch(error){
         navigate(`/profile/${user?._id}`)
         console.log(error)
       }finally{
        setLoading(false)
       }
    }
    return(
        <div className='flex max-w-2xl mx-auto pl-10'>
            <section className='flex flex-col gap-6 w-full my-8'>
             <h1 className='font-bold text-xl'>Edit Profile</h1>
             <div  className='flex items-center justify-between bg-gray-100 rounded-xl p-4'>
                <div className='flex items-center gap-3'>
                <Avatar className="w-14 h-14 rounded-full border-2 border-white shadow-md" src={user?.profilePhoto} alt="post_image" />
                <div>
                <h1 className='font-bold text-sm'>{user?.username}</h1>
                <span className='text-gray-600'>{user?.about || 'About...'}</span>
                </div>
                </div>
             <input ref={imageRef} onChange={fileChangeHandler} type='file' className='hidden'/>
             <Button onClick={() => imageRef?.current.click()} className='bg-[#0095F6] h-8 hover:bg-[#318bc7]'>Change photo</Button>
             </div>
              <div>
                <h1 className='font-bold text-xl mb-2'>About</h1>
                <textarea defaultValue={input.about} onChange={(e)=>setInput({...input, about:e.target.value})} name="about" className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none shadow-sm text-white" placeholder="Write about yourself..."/>
              </div>
              <div>
                <h1 className='font-bold mb-2'>Gender</h1>
                <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Gender</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          defaultValue={input.gender}
          label="gender"
          onChange={selectChangeHandler}
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
        </Select>
      </FormControl>
    </Box>
              </div >
              <div className='flex justify-end'>
               {
                loading ? (
                    <Button className='w-fit bg-[#0095F6] hover:bg-[#2a8ccd]'>
                         <CircularProgress className="mr-2 h-4 w-4" />
                     Please wait
                  </Button>
                ):(
                    <Button onClick={editProfileHandler} className='w-fit bg-[#0095F6] hover:bg-[#2a8ccd]'>Submit</Button>
                )
               }
              </div>
            </section>
        </div>
    )
}

export default EditProfile