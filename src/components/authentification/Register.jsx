"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Modal } from "react-bootstrap"
import { Link } from "react-router-dom"
import { FaEnvelope, FaLock, FaUser, FaPhone, FaMapMarkerAlt, FaMars, FaVenus, FaEye, FaEyeSlash } from "react-icons/fa"
import "bootstrap/dist/css/bootstrap.min.css"
import "./Styleauth.css"
import { IoClose } from "react-icons/io5"
import { signup } from "../../service/authservice"

// Import des composants Material UI
import { Alert, Snackbar, CircularProgress } from "@mui/material"

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
  "Manouba",
].sort() // Tri alphabétique des villes

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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  // États pour les alertes
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "error", // 'error', 'warning', 'info', 'success'
  })

  // Fonction pour fermer l'alerte
  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false })
  }

  // Fonction pour afficher une alerte
  const showAlert = (message, severity = "error") => {
    setAlert({
      open: true,
      message,
      severity,
    })
  }

  // Validation du formulaire
  const validateForm = () => {
    // Validation des champs obligatoires
    if (!firstname.trim()) {
      showAlert("Veuillez saisir votre prénom")
      return false
    }

    if (!lastname.trim()) {
      showAlert("Veuillez saisir votre nom")
      return false
    }

    if (!email.trim()) {
      showAlert("Veuillez saisir votre adresse email")
      return false
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      showAlert("Veuillez saisir une adresse email valide")
      return false
    }

    if (!password.trim()) {
      showAlert("Veuillez saisir un mot de passe")
      return false
    }

    if (password.length < 6) {
      showAlert("Le mot de passe doit contenir au moins 6 caractères")
      return false
    }

    if (password !== password2) {
      showAlert("Les mots de passe ne correspondent pas")
      return false
    }

    if (!sexe) {
      showAlert("Veuillez sélectionner votre sexe")
      return false
    }

    return true
  }

  // Modifiez la fonction handleSubmit dans Register.jsx
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Valider le formulaire avant de soumettre
    if (!validateForm()) return

    setIsRegistering(true)

    const userData = {
      firstname,
      lastname,
      email,
      password,
      telephone: telephone ? Number(telephone) : undefined,
      userVille,
      sexe,
    }

    try {
      const response = await signup(userData)
      if (response.data.success) {
        showAlert(response.data.message, "success")

        // Attendre un peu pour que l'utilisateur voie le message de succès
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      } else {
        showAlert(response.data.message || "Échec de l'inscription. Veuillez réessayer.")
      }
    } catch (err) {
      if (err.response?.status === 409) {
        showAlert(err.response.data.message)
      } else if (err.response?.data?.errors) {
        showAlert(err.response.data.errors.join(", "))
      } else if (
        err.response?.data?.message ===
        "Cet email est déjà utilisé. Veuillez utiliser un autre email ou vous connecter."
      ) {
        showAlert("Cet email est déjà utilisé. Veuillez utiliser un autre email ou vous connecter.", "warning")
      } else {
        showAlert(err.response?.data?.message || "Une erreur s'est produite lors de l'inscription.")
      }
    } finally {
      setIsRegistering(false)
    }
  }

  const handleClose = () => {
    navigate("/")
  }

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword)
    } else {
      setShowConfirmPassword(!showConfirmPassword)
    }
  }

  return (
    <Modal show={true} onHide={handleClose} centered className="auth-modal">
      <div className="wrapper">
        <IoClose className="close-icon" onClick={handleClose} />
        <div className="form-box register">
          <form onSubmit={handleSubmit}>
            <h1>Registration</h1>

            {/* Nom et prénom sur la même ligne */}
            <div className="input-row">
              <div className="input-box half-width">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                />
                <FaUser className="icon" />
              </div>

              <div className="input-box half-width">
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                />
                <FaUser className="icon" />
              </div>
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

            {/* Téléphone et ville sur la même ligne */}
            <div className="input-row">
              <div className="input-box half-width">
                <input
                  type="tel"
                  placeholder="Téléphone"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                />
                <FaPhone className="icon" />
              </div>

              <div className="select-box half-width">
                <select value={userVille} onChange={(e) => setUserVille(e.target.value)} className="city-select">
                  <option value="">Ville</option>
                  {tunisianCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <FaMapMarkerAlt className="select-icon" />
              </div>
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

            <div className="input-box password-box">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FaLock className="icon" />
              <button
                type="button"
                className="toggle-password"
                onClick={() => togglePasswordVisibility("password")}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="input-box password-box">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
              />
              <FaLock className="icon" />
              <button
                type="button"
                className="toggle-password"
                onClick={() => togglePasswordVisibility("confirm")}
                aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button type="submit" className="submit-btn" disabled={isRegistering}>
              {isRegistering ? (
                <>
                  <CircularProgress size={20} color="inherit" style={{ marginRight: "10px" }} />
                  Inscription en cours...
                </>
              ) : (
                "S'inscrire"
              )}
            </button>

            <div className="register-link">
              <p>
                Vous avez déjà un compte ?<Link to="/login"> Connectez-vous !</Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Snackbar pour afficher les alertes */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity} variant="filled" sx={{ width: "100%" }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Modal>
  )
}

export default Register
