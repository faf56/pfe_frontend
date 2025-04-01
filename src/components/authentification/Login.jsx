import React from 'react';
import {useState,useEffect } from 'react'
import {signin} from "../../service/authservice"
import './Style.css';

import { Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit=(event)=>{
    event.preventDefault();
    const objetuser = {
    email: email,
    password :password,
    };
    signin(objetuser).then((result)=>{
    console.log(result.data.success)
    console.log(result.data.token)
    console.log(result.data.user)
    if (result.data.success){
    if(result.data.user.isActive){
    localStorage.setItem("CC_Token",result.data.token)
    localStorage.setItem("user",JSON.stringify(result.data.user))
    localStorage.setItem("refresh_token",result.data.refreshToken)
    if (result.data.user.role==="admin") navigate('/admin')
    else navigate('/')
    }
    else alert ("Compte n'est pas encore activé")
    }
    
    else alert("Erreur ! ")
    })
    .catch((error)=>{alert("Error");console.log(error)})
    };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <Modal  show={true} onHide={handleClose} centered >
      
      <div className="wrapper" >
      <IoClose className="close-icon" onClick={handleClose} />
      <div className="form-box login">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className="input-box">
            <input 
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required />
            <FaEnvelope className='icon' />
          </div>
          <div className="input-box">
            <input
             type='password'
             placeholder='Password'
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             required />
            <FaLock className='icon' />
          </div>
          <div className="remember-forgot">
            <label><input type="checkbox" /> Remember me</label>
            <a href="#">Forgot password</a>
          </div>
          <button type='submit'>Login</button>
          <div className="register-link">
            <p>Don't have an account? <Link to="/register">Register</Link></p>
          </div>
        </form>
      </div>
      </div>
      
    </Modal>
  );
};

export default Login;
