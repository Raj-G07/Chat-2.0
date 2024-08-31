import React from "react";
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';
import { Avatar, Stack,Box } from '@mui/material';
import { useSelector } from 'react-redux'
const RightSideBar=()=>{
    const { user } = useSelector(store => store.auth);
    return (
          <Stack sx={{ flexDirection: { sx: "column", md: "row" } }}>
            <Box sx={{ height: { sx: "auto", md: "92vh" }, borderRight: "1px solid #3d3d3d", px: { sx: 0, md: 2 } }}>
            <Link to={`/profile/${user?._id}`}>
                <Avatar className="w-14 h-14 rounded-full border-2 border-white shadow-md"src={user?.profilePhoto} alt="post_image" />
            </Link>
            <div>
              <h1 className='font-semibold text-sm'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
              <span className='text-gray-600 text-sm'>{user?.about || 'Bio here...'}</span>
            </div>
          <SuggestedUsers/>
            </Box>
          </Stack>
    )
}

export default RightSideBar