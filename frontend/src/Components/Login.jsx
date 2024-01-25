import { useEffect, useState } from 'react';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {toast} from "react-toastify";
import '../Login.css';

export default function Login() {
    const [credentials, setcredentials] = useState({ email: "", password: "" });
    let navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        for(const key in credentials){
            if(credentials[key].length < 5){
                toast.error("Minimum length should be 5");
                return;
            }
        }
        const response = await fetch(`http://localhost:5000/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: credentials.email,
                password: credentials.password
            })
        });
        const recieved = await response.json();
        if (!recieved.Success) {
            toast.error("Error Occured");
            console.log(recieved);
            return;
        } else {
            console.log(recieved);
            localStorage.setItem("authToken", recieved.token);
            localStorage.setItem("username", recieved.User.name);
            localStorage.setItem("userEmail", recieved.User.email);
            localStorage.setItem("_id",recieved.User._id);
            console.log(recieved.User);
            
            navigate('/');
        }
    }
    const handleChange = (event) => {
        setcredentials({ ...credentials, [event.target.name]: event.target.value });
    }
    useEffect(()=>{
        if(localStorage.getItem("authToken") !== null){
            navigate("/");
        }
    },[]);
    return (
        <div className="form_container" >
            <form onSubmit={handleSubmit} className='form' >
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label fw-bold">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name='email' onChange={handleChange} />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label fw-bold">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" name='password' onChange={handleChange} />
                </div>
                <div className='mb-3 mb4'>
                    <button type="submit" className="btn btn-primary fw-bold">Login</button>
                    <Link to="/signup" className='new'>New User?</Link>
                </div>
                <div className='d-flex mt-3'>
                </div>
            </form>
        </div>
    )
}