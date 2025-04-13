"use client"

import { Navigate, Outlet } from "react-router-dom"
import { useState, useEffect } from "react"

const ProtectedRoute = ({ allowedRoles = ["user", "admin"] }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem("CC_Token")
    const userStr = localStorage.getItem("user")

    if (!token || !userStr) {
      setIsAuthenticated(false)
      setLoading(false)
      return
    }

    try {
      const userData = JSON.parse(userStr)
      setUserRole(userData.role)
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Erreur lors de la récupération des données utilisateur:", error)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }, [])

  if (loading) {
    // Afficher un indicateur de chargement pendant la vérification
    return <div>Chargement...</div>
  }

  if (!isAuthenticated) {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(userRole)) {
    // Rediriger vers la page d'accueil si l'utilisateur n'a pas le rôle requis
    return <Navigate to="/login" replace />
  }

  // Si l'utilisateur est authentifié et a le rôle requis, afficher les routes enfants
  return <Outlet />
}

export default ProtectedRoute
