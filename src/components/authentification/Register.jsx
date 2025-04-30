"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Modal } from "react-bootstrap"
import { Link } from "react-router-dom"
import { FaEnvelope, FaLock, FaUser, FaPhone, FaMapMarkerAlt, FaMars, FaVenus } from "react-icons/fa"
import "bootstrap/dist/css/bootstrap.min.css"
import "./Style.css"
import { IoClose } from "react-icons/io5"
import { signup } from "../../service/authservice"

// Liste des principales villes de Tunisie
const tunisianCities = [
  "Tunis",
  "Sfax",
  "Sousse",
  "Kairouan",
  "Bizerte",
  "Gabès",
  "Ariana",
  "Gafsa",
  "Monastir",
  "Ben Arous",
  "Kasserine",
  "Médenine",
  "Nabeul",
  "Tataouine",
  "Béja",
  "Jendouba",
  "El Kef",
  "Mahdia",
  "Sidi Bouzid",
  "Tozeur",
  "Siliana",
  "Kébili",
  "Zaghouan",
  "Manouba"
].sort(); // Tri alphabétique des villes

const Register = () => {
 const navigate = useNavigate()

 const [firstname, setFirstname] = useState("")
 const [lastname, setLastname] = useState("")
 const [email, setEmail] = useState("")
 const [password, setPassword] = useState("")
 const [password2, setPassword2] = useState("")
 const [telephone, setTelephone] = useState("")
 const [userVille, setUserVille] = useState("")
 const [sexe, setSexe] = useState("")
 const [error, setError] = useState("")

 // Modifiez la fonction handleSubmit dans Register.jsx
 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (password !== password2) {
    setError("Les mots de passe ne correspondent pas");
    return;
  }

  const userData = {
    firstname,
    lastname,
    email,
    password,
    telephone: telephone ? Number(telephone) : undefined,
    userVille,
    sexe,
  };

  try {
    const response = await signup(userData);
    if (response.data.success) {
      alert(response.data.message); // Affiche le message retourné par le serveur
      navigate("/login");
    } else {
      setError(response.data.message || "Échec de l'inscription. Veuillez réessayer.");
    }
  } catch (err) {
    if (err.response?.status === 409) {
      setError(err.response.data.message);
    } else if (err.response?.data?.errors) {
      setError(err.response.data.errors.join(", "));
    } else {
      setError(err.response?.data?.message || "Une erreur s'est produite lors de l'inscription.");
    }
  }
};

 const handleClose = () => {
   navigate("/")
 }

 return (
   <Modal show={true} onHide={handleClose} centered>
     <div className="wrapper">
       <IoClose className="close-icon" onClick={handleClose} />
       <div className="form-box register">
         <form onSubmit={handleSubmit}>
           <h1>Registration</h1>

           {error && <div className="error-message">{error}</div>}

           <div className="input-box">
             <input
               type="text"
               placeholder="First Name"
               value={firstname}
               onChange={(e) => setFirstname(e.target.value)}
               required
             />
             <FaUser className="icon" />
           </div>

           <div className="input-box">
             <input
               type="text"
               placeholder="Last Name"
               value={lastname}
               onChange={(e) => setLastname(e.target.value)}
               required
             />
             <FaUser className="icon" />
           </div>

           <div className="input-box">
             <input
               type="email"
               placeholder="Email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
             />
             <FaEnvelope className="icon" />
           </div>

           <div className="input-box">
             <input
               type="tel"
               placeholder="Téléphone"
               value={telephone}
               onChange={(e) => setTelephone(e.target.value)}
             />
             <FaPhone className="icon" />
           </div>

           {/* Liste déroulante des villes tunisiennes */}
           <div className="select-box">
             <select
               value={userVille}
               onChange={(e) => setUserVille(e.target.value)}
               className="city-select"
             >
               <option value="">Sélectionnez votre ville</option>
               {tunisianCities.map((city) => (
                 <option key={city} value={city}>
                   {city}
                 </option>
               ))}
             </select>
             <FaMapMarkerAlt className="select-icon" />
           </div>

           <div className="gender-selection">
             <label>Sexe:</label>
             <div className="radio-group">
               <label className="radio-label">
                 <input
                   type="radio"
                   name="sexe"
                   value="homme"
                   checked={sexe === "homme"}
                   onChange={() => setSexe("homme")}
                 />
                 <FaMars className="gender-icon male" /> Homme
               </label>
               <label className="radio-label">
                 <input
                   type="radio"
                   name="sexe"
                   value="femme"
                   checked={sexe === "femme"}
                   onChange={() => setSexe("femme")}
                 />
                 <FaVenus className="gender-icon female" /> Femme
               </label>
             </div>
           </div>

           <div className="input-box">
             <input
               type="password"
               placeholder="Password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
             />
             <FaLock className="icon" />
           </div>

           <div className="input-box">
             <input
               type="password"
               placeholder="Confirm Password"
               value={password2}
               onChange={(e) => setPassword2(e.target.value)}
               required
             />
             <FaLock className="icon" />
           </div>

           <button type="submit">Register</button>

           <div className="register-link">
             <p>
               Vous avez déjà un compte ?<Link to="/login"> Connectez-vous !</Link>
             </p>
           </div>
         </form>
       </div>
     </div>
   </Modal>
 )
}

export default Register