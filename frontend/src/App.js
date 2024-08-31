import './App.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import HomePage from './components/HomePage';
import Signup from './components/Signup';
import Login from './components/Login'
import MainLayout from './components/MainLayout';
import ChatPage from './components/ChatPage';
import EditProfile from './components/EditProfile';
import Profile from './components/Profile';
import {io} from "socket.io-client"
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSocket } from './redux/socketSlice';
import { setOnlineUsers } from './redux/chatSlice';
import { setLikeNotification } from './redux/rtnSlice';
import ProtectedRoutes from './components/ProtectedRoutes';
import SummaryApi from './common';
const router= createBrowserRouter(
  [{
    path:"/",
    element:<ProtectedRoutes><MainLayout/></ProtectedRoutes>,
    children:[
      {
        path:'/',
        element:<ProtectedRoutes> <HomePage/></ProtectedRoutes> 
      },
      {
        path:'/profile/:id',
        element:<ProtectedRoutes> <Profile/></ProtectedRoutes>
      },
      {
        path:'/account/edit',
        element:<ProtectedRoutes><EditProfile/></ProtectedRoutes>
      },
      {
        path:'/chat',
        element:<ProtectedRoutes><ChatPage/></ProtectedRoutes>
      }
    ]
  },
  {
    path:"/signup",
    element:<Signup/>
  },
  {
    path:"/login",
    element:<Login/>
  },
]
)
function App() {
  const {user}= useSelector(store=>store.auth)
  const {socket} = useSelector(store=>store.socketio)
  const dispatch= useDispatch()
  useEffect(()=>{
    if(user){
      const socketio= io(SummaryApi.domain.url,{
        query:{
          userId:user?._id
        },
        transports:[
        'websocket'
        ]
      });
      dispatch(setSocket(socketio))

      socketio.on('getOnlineUsers',(onlineUsers)=>{
        dispatch(setOnlineUsers(onlineUsers))
      });
      socketio.on('notification',(notification)=>{
        dispatch(setLikeNotification(notification));
      })
      return ()=>{
        socketio.close()
        dispatch(setSocket(null))
      }
    }else if(socket) {
      socket.close()
      dispatch(setSocket(null))
    }
  },[user,dispatch])
  return (
    <div className="p-4 ">
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
