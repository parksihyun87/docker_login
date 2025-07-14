import axios from "axios";
import {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {setToken} from "./store";
import apiClient from "./api/axiosInstance";


export default function TestConponent(){
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();
    const newtoken = useSelector(state=>state.token.token);

    useEffect(()=>{
        const fetchdata = async ()=>{
            try{
                const response= await apiClient.post("/reissue",null,
                    {
                        withCredentials:true
                    });
                const token= response.headers["authorization"];
                await dispatch(setToken(token));

                console.log("토큰"+token);
            } catch (e) {
                if(e.response.data)
                    console.log(e.response.data);
            }
        };
        fetchdata();
    },[]);


    const handleAdmin=async (e)=>{
        try{
            const response=await apiClient.get("/admin");
            setMessage(response.data);
        }catch(error){
            if(error.response.status===403){
                setMessage(error.response.data);
            }
            if(error.response.data.message){
                setMessage(error.response.data.message);
            }
            console.log(error);
            console.log(error.response.data.error);
        }

    };

    const handleLogout=async (e)=>{
       dispatch(setToken(null));
       setMessage("로그아웃되었습니다.");
    }

    return(
        <>
            <button onClick={handleLogout}>LOGOUT</button>
            <button onClick={handleAdmin}>ADMIN</button>
            <h1>{message}</h1>

        </>
    );
}