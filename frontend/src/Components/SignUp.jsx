import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function SignUp() {
    let navigate = useNavigate();
    const [credentials, setcredentials] = useState({ name: "", password: "", email: "" });
    const handleSubmit = async (e) => {
        e.preventDefault();
        for(const key in credentials){
            if(credentials[key].length < 5){
                toast.warning("Minimum length should be 5");
                return;
            }
        }
        const response = await fetch(`http://localhost:5000/api/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: credentials.name,
                password: credentials.password,
                email: credentials.email
            })
        });
        const recieve = await response.json();
        if (!recieve.Success) {
            toast.error("Error Occured");
            console.log(recieve);
            return;
        } else {
            localStorage.setItem("_id",recieve.User._id);
            localStorage.setItem("authToken", recieve.token);
            localStorage.setItem("username", recieve.User.name);
            localStorage.setItem("userEmail", recieve.User.email);
            navigate('/');
        }
    };
    const handleChange = (event) => {
        setcredentials({ ...credentials, [event.target.name]: event.target.value });
    }
    return (
        <div className="form_container">
            <form onSubmit={handleSubmit} className="form">
                <div className="mb-3">
                    <label className="form-label fw-bold">Full Name</label>
                    <input type="Text" className="form-control" name='name' value={credentials.name} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1 fw-bold" className="form-label fw-bold">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name='email' onChange={handleChange} />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1 fw-bold" className="form-label fw-bold">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" name='password' onChange={handleChange} />
                </div>
                <div className='mb-3 mb4'>
                    <button type="submit" className="btn btn-primary fw-bold">Register</button>
                    <Link to="/login" className='new' style={{width:"150px"}}>Already a User?</Link>
                </div>
            </form>
        </div>
    )
}
