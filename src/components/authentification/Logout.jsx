"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Logout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Déclencher un événement personnalisé pour informer les autres composants
    window.dispatchEvent(new Event("userLogout"))

    localStorage.removeItem("CC_Token")
    localStorage.removeItem("user")
    navigate("/login")
  }, [navigate])

  return (
    <div>
      <p>Déconnexion en cours...</p>
    </div>
  )
}

export default Logout
