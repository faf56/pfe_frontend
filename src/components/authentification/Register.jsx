import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from 'react-bootstrap';
import { Link} from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Style.css';
import { IoClose } from 'react-icons/io5';
import {signup} from "../../service/authservice"

const Register = () => {
  const navigate = useNavigate();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
  
      if (password !== password2) {
        setError("Passwords do not match");
        return;
      }
  
      const userData = {
        firstname,
        lastname,
        email,
        password,
        
      };
  
      try {
        const res = await signup(userData);
        if (res) {
          navigate("/");
        } else {
          setError("Registration failed. Please try again.");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred during registration.");
      }
    };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <Modal  show={true} onHide={handleClose} centered>
      <div className="wrapper">
      <IoClose className="close-icon" onClick={handleClose} />
      <div className="form-box register">
        <form onSubmit={handleSubmit}>
          <h1>Registration</h1>
          <div className="input-box">
            <input
             type='text'
              placeholder='First Name'
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
               required />
            <FaUser className='icon' />
          </div>
          <div className="input-box">
            <input
             type='text'
              placeholder='Last Name'
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
               required />
            <FaUser className='icon' />
          </div>
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
          <div className="input-box">
            <input
             type='password'
              placeholder='Password'
              value={password2}
                onChange={(e) => setPassword2(e.target.value)}
               required />
            <FaLock className='icon' />
          </div>
          <div className="remember-forgot">
            <label><input type="checkbox" /> I agree to the terms & conditions</label>
          </div>
          <button type='submit'>Register</button>
          <div className="register-link">
            <p>Already have an account? <Link to="/login">Login</Link></p>
          </div>
        </form>
      </div>
      </div>
    </Modal>
  );
};

export default Register;
