import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSuggestedUsers } from "../redux/authSlice";
import SummaryApi from "../common";


const useGetSuggestedUsers = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const res = await axios.get(`${SummaryApi.userhandler.url}/suggested`, { withCredentials: true });
                if (res.data.success) { 
                    dispatch(setSuggestedUsers(res.data.users));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSuggestedUsers();
    }, []);
};
export default useGetSuggestedUsers;