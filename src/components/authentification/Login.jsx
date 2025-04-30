
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

  // Modifiez la fonction handleSubmit dans Login.jsx
const handleSubmit = (event) => {
  event.preventDefault();
  const objetuser = {
    email: email,
    password: password,
  };
  
  signin(objetuser)
    .then((result) => {
      if (result.data.success) {
        if (result.data.user.isActive) {
          localStorage.setItem("CC_Token", result.data.token);
          localStorage.setItem("user", JSON.stringify(result.data.user));
          if (result.data.user.role === "admin") {
            navigate('/admin');
          } else {
            navigate('/mon-compte');
          }
        } else {
          alert(`
            Votre compte n'est pas encore activé.
            Un email d'activation a été envoyé lors de votre inscription.
            Veuillez vérifier votre boîte mail ou contacter l'administrateur.
          `);
        }
      } else {
        alert("Identifiants incorrects. Veuillez réessayer.");
      }
    })
    .catch((error) => {
      if (error.response?.data?.message === "Account doesn't exists") {
        alert("Aucun compte trouvé avec cet email. Veuillez vous inscrire.");
      } else if (error.response?.data?.message === "Please verify your credentials") {
        alert("Email ou mot de passe incorrect. Veuillez réessayer.");
      } else {
        alert("Une erreur s'est produite lors de la connexion.");
        console.error(error);
      }
    });
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
            <p>Pas de compte ? <Link to="/register">Créez-en un</Link></p>
          </div>
        </form>
      </div>
      </div>
      
    </Modal>
  );
};

export default Login;
