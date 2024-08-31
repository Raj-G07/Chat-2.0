import React from "react";
import Feed from "./Feed";
import { Outlet } from "react-router-dom";
import RightSideBar from "./RightSideBar";
import useGetAllPost from "../hooks/useGetAllPost";
import useGetSuggestedUsers from "../hooks/userGetSuggestedUsers";

const HomePage=()=>{
   useGetAllPost()
   useGetSuggestedUsers()
   return(
    <div className="flex">
       <div className="flex-grow">
      <Feed/>
       </div>
       <RightSideBar/>
    </div>
   )
}

export default HomePage;