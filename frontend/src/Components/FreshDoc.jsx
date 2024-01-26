import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../fresh.css';

const FreshDoc = () => {
    const navigate = useNavigate();
    const [search,setSearch] = useState("");
    const clickHandler = async()=>{
        if(search == "" || localStorage.getItem("authToken") == null) return;
        try {
            const res = await fetch("http://localhost:5000/api/addDocument",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({
                    "_id":localStorage.getItem("_id"),
                    data:{},
                    "title":search
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
    },[]);
    return (
        <div className='fresh'>
            <div>
                <label>Enter Title:</label>
                <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)}></input>
                <span onClick={()=>clickHandler()}>Create</span>
            </div>
        </div>
    );
};

export default FreshDoc;