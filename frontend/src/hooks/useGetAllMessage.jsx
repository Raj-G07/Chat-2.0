import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { setMessages } from "../redux/chatSlice";
import SummaryApi from "../common";

const useGetAllMessage=()=>{
    const dispatch= useDispatch();
    const {selectedUser}= useSelector(store=>store.auth)
    useEffect(()=>{
        const fetchAllMessage= async ()=>{
            try{
                const res= await axios.get(`${SummaryApi.allMessage.url}/${selectedUser?._id}`,{
                    withCredentials:true
                });
                if(res.data.success){
                    dispatch(setMessages(res.data.messages))
                }
            }catch(error){
                console.log(error)
            }
        }
        fetchAllMessage();

    },[selectedUser])

}
export default useGetAllMessage;