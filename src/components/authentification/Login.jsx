"use client"

import { useState } from "react"
import { signin } from "../../service/authservice"
import { syncFavoritesOnLogin } from "../../service/favoriteService"
import "./Styleauth.css"

import { Modal } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"
import { IoClose } from "react-icons/io5"
import "bootstrap/dist/css/bootstrap.min.css"

// Import des composants Material UI
import { Alert, Snackbar, CircularProgress } from "@mui/material"

const Login = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

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
    if (!email.trim()) {
      showAlert("Veuillez saisir votre adresse email")
      return false
    }

    if (!password.trim()) {
      showAlert("Veuillez saisir votre mot de passe")
      return false
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      showAlert("Veuillez saisir une adresse email valide")
      return false
    }

    return true
  }

  // Modifier la fonction handleSubmit pour rediriger vers la page précédente après connexion
  const handleSubmit = async (event) => {
    event.preventDefault()

    // Valider le formulaire avant de soumettre
    if (!validateForm()) return

    setIsLoggingIn(true)

    const objetuser = {
      email: email,
      password: password,
    }

    try {
      const result = await signin(objetuser)

      if (result.data.success) {
        if (result.data.user.isActive) {
          localStorage.setItem("CC_Token", result.data.token)
          localStorage.setItem("user", JSON.stringify(result.data.user))

          if (rememberMe) {
            localStorage.setItem("rememberMe", email)
          } else {
            localStorage.removeItem("rememberMe")
          }

          // Synchroniser les favoris locaux avec le compte utilisateur
          await syncFavoritesOnLogin()

          // Déclencher un événement personnalisé pour informer les autres composants
          const loginEvent = new CustomEvent("userLogin", {
            detail: { user: result.data.user },
          })
          window.dispatchEvent(loginEvent)

          // Afficher une alerte de succès
          showAlert("Connexion réussie ! Redirection en cours...", "success")

          // Attendre un peu pour que l'utilisateur voie le message de succès
          setTimeout(() => {
            // Vérifier s'il y a une redirection après connexion
            const redirectPath = sessionStorage.getItem("redirectAfterLogin")
            if (redirectPath) {
              sessionStorage.removeItem("redirectAfterLogin")
              navigate(redirectPath)
            } else {
              // Redirection par défaut selon le rôle
              if (result.data.user.role === "admin") {
                navigate("/admin")
              } else {
                navigate("/mon-compte")
              }
            }
          }, 1500)
        } else {
          showAlert(
            "Votre compte n'est pas encore activé. Un email d'activation a été envoyé lors de votre inscription. Veuillez vérifier votre boîte mail ou contacter l'administrateur.",
            "warning",
          )
        }
      } else {
        showAlert("Identifiants incorrects. Veuillez réessayer.")
      }
    } catch (error) {
      if (error.response?.data?.message === "Account doesn't exists") {
        showAlert("Aucun compte trouvé avec cet email. Veuillez vous inscrire.")
      } else if (error.response?.data?.message === "Please verify your credentials") {
        showAlert("Email ou mot de passe incorrect. Veuillez réessayer.")
      } else {
        showAlert("Une erreur s'est produite lors de la connexion.")
        console.error(error)
      }
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleClose = () => {
    navigate("/")
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Modal show={true} onHide={handleClose} centered className="auth-modal">
      <div className="wrapper">
        <IoClose className="close-icon" onClick={handleClose} />
        <div className="form-box login">
          <form onSubmit={handleSubmit}>
            <h1>Login</h1>
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
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="remember-forgot">
              <label>
                <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                Se souvenir de moi
              </label>
              
            </div>

            <button type="submit" disabled={isLoggingIn} className="submit-btn">
              {isLoggingIn ? (
                <>
                  <CircularProgress size={20} color="inherit" style={{ marginRight: "10px" }} />
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </button>

            <div className="register-link">
              <p>
                Pas de compte ? <Link to="/register">Créez-en un</Link>
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

export default Login
