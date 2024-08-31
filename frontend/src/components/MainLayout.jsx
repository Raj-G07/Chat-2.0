import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const MainLayout=()=>{
    
    return (
        <div>
          <Sidebar/>
         <div className="pl-[16%]">
          <Outlet/>
         </div>
        </div>
    )
}

export default MainLayout