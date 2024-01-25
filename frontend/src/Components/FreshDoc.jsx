import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FreshDoc = () => {
    const navigate = useNavigate();
    const handler = async()=>{
        try {
            const res = await fetch("http://localhost:5000/api/addDocument",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({
                    "_id":localStorage.getItem("_id"),
                    data:{}
                }) 
            })
            const data = await res.json();
            console.log(data);
            if (data.success && data.newDocument && data.newDocument._id) {
                navigate(`/page/${data.newDocument._id}`);
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        if(localStorage.getItem("authToken") == null) return;
        handler();
    },[]);
    return (
        <div>
            
        </div>
    );
};

export default FreshDoc;