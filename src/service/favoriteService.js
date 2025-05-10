import axios from "../api/axios"

// Vérifier si l'utilisateur est connecté
const isAuthenticated = () => {
  return localStorage.getItem("CC_Token") !== null && localStorage.getItem("user") !== null
}

// Récupérer l'ID de l'utilisateur connecté
const getUserId = () => {
  const userStr = localStorage.getItem("user")
  if (userStr) {
    try {
      const user = JSON.parse(userStr)
      return user._id
    } catch (error) {
      console.error("Erreur lors de la récupération de l'ID utilisateur:", error)
    }
  }
  return null
}

// Récupérer les favoris depuis le localStorage (pour utilisateur non connecté)
export const getFavoritesFromLocalStorage = () => {
  const favorites = localStorage.getItem("perlacoif_favorites")
  return favorites ? JSON.parse(favorites) : []
}

// Récupérer les favoris depuis le serveur (pour utilisateur connecté)
export const fetchFavoritesFromServer = async () => {
  try {
    const userId = getUserId()
    if (!userId) return []

    const response = await axios.get(`/users/${userId}/favorites`)
    return response.data.success ? response.data.favorites : []
  } catch (error) {
    console.error("Erreur lors de la récupération des favoris depuis le serveur:", error)
    return []
  }
}

// Récupérer tous les favoris (serveur ou localStorage selon connexion)
export const getFavorites = async () => {
  if (isAuthenticated()) {
    try {
      const favorites = await fetchFavoritesFromServer()
      return favorites.map((product) => product._id)
    } catch (error) {
      console.error("Erreur lors de la récupération des favoris:", error)
      return []
    }
  } else {
    return getFavoritesFromLocalStorage()
  }
}

// Vérifier si un produit est dans les favoris (version synchrone pour l'affichage initial)
export const checkIsFavoriteSync = (productId) => {
  if (!productId) return false

  if (isAuthenticated()) {
    // Pour les utilisateurs connectés, on ne peut pas savoir immédiatement
    // On retourne false par défaut, et on mettra à jour avec useEffect
    return false
  } else {
    const favorites = getFavoritesFromLocalStorage()
    return favorites.includes(productId)
  }
}

// Vérifier si un produit est dans les favoris (version asynchrone pour les mises à jour)
export const checkIsFavorite = async (productId) => {
  if (!productId) return false

  if (isAuthenticated()) {
    try {
      const favorites = await fetchFavoritesFromServer()
      return favorites.some((product) => product._id === productId)
    } catch (error) {
      console.error("Erreur lors de la vérification des favoris:", error)
      return false
    }
  } else {
    const favorites = getFavoritesFromLocalStorage()
    return favorites.includes(productId)
  }
}

// Ajouter un produit aux favoris
export const addToFavorites = async (productId) => {
  if (!productId) return false

  if (isAuthenticated()) {
    try {
      const userId = getUserId()
      await axios.post(`/users/${userId}/favorites`, { produitId: productId })

      // Déclencher un événement pour informer les autres composants
      window.dispatchEvent(new CustomEvent("favoritesChanged"))
      return true
    } catch (error) {
      console.error("Erreur lors de l'ajout aux favoris:", error)
      return false
    }
  } else {
    // Pour les utilisateurs non connectés, stocker dans localStorage
    const favorites = getFavoritesFromLocalStorage()
    if (!favorites.includes(productId)) {
      favorites.push(productId)
      localStorage.setItem("perlacoif_favorites", JSON.stringify(favorites))

      // Déclencher un événement pour informer les autres composants
      window.dispatchEvent(new CustomEvent("favoritesChanged"))
    }
    return true
  }
}

// Supprimer un produit des favoris
export const removeFromFavorites = async (productId) => {
  if (!productId) return false

  if (isAuthenticated()) {
    try {
      const userId = getUserId()
      await axios.delete(`/users/${userId}/favorites/${productId}`)

      // Déclencher un événement pour informer les autres composants
      window.dispatchEvent(new CustomEvent("favoritesChanged"))
      return true
    } catch (error) {
      console.error("Erreur lors de la suppression des favoris:", error)
      return false
    }
  } else {
    // Pour les utilisateurs non connectés, supprimer du localStorage
    const favorites = getFavoritesFromLocalStorage()
    const updatedFavorites = favorites.filter((id) => id !== productId)
    localStorage.setItem("perlacoif_favorites", JSON.stringify(updatedFavorites))

    // Déclencher un événement pour informer les autres composants
    window.dispatchEvent(new CustomEvent("favoritesChanged"))
    return true
  }
}

// Vider tous les favoris
export const clearFavorites = async () => {
  if (isAuthenticated()) {
    try {
      const userId = getUserId()
      const favorites = await fetchFavoritesFromServer()

      // Supprimer chaque favori individuellement
      for (const product of favorites) {
        await axios.delete(`/users/${userId}/favorites/${product._id}`)
      }

      // Déclencher un événement pour informer les autres composants
      window.dispatchEvent(new CustomEvent("favoritesChanged"))
      return true
    } catch (error) {
      console.error("Erreur lors de la suppression de tous les favoris:", error)
      return false
    }
  } else {
    localStorage.removeItem("perlacoif_favorites")

    // Déclencher un événement pour informer les autres composants
    window.dispatchEvent(new CustomEvent("favoritesChanged"))
    return true
  }
}

// Synchroniser les favoris locaux avec le compte utilisateur lors de la connexion
export const syncFavoritesOnLogin = async () => {
  try {
    // Récupérer les favoris locaux
    const localFavorites = getFavoritesFromLocalStorage()
    const userId = getUserId()

    if (localFavorites.length > 0 && userId) {
      // Ajouter chaque favori local au compte utilisateur
      for (const productId of localFavorites) {
        await axios.post(`/users/${userId}/favorites`, { produitId: productId })
      }

      // Vider les favoris locaux après synchronisation
      localStorage.removeItem("perlacoif_favorites")
    }

    // Déclencher un événement pour informer les autres composants
    window.dispatchEvent(new CustomEvent("favoritesChanged"))
    return true
  } catch (error) {
    console.error("Erreur lors de la synchronisation des favoris:", error)
    return false
  }
}

// Ajouter cette fonction pour vérifier l'authentification et rediriger si nécessaire
export const requireAuth = (navigate) => {
  if (!isAuthenticated()) {
    if (navigate) {
      // Stocker l'URL actuelle pour rediriger l'utilisateur après la connexion
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname)
      navigate("/login")
    }
    return false
  }
  return true
}
