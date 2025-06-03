"use client"

import { useCart } from "react-use-cart"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import {
  addToFavorites,
  removeFromFavorites,
  checkIsFavorite,
  checkIsFavoriteSync,
} from "../../service/favoriteService"
import "./card.css"
import { Favorite, FavoriteBorder } from "@mui/icons-material"
import CartNotification from "../notifications/CartNotification"

const Card = ({ imagepro, title, description, prix, prixPromo, stock, _id, marqueID }) => {
  const { addItem, items, cartTotal } = useCart()
  const navigate = useNavigate()
  const [isFavorite, setIsFavorite] = useState(checkIsFavoriteSync(_id))
  const [isProcessing, setIsProcessing] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [addedProduct, setAddedProduct] = useState(null)

  useEffect(() => {
    // Vérifier de manière asynchrone si le produit est dans les favoris
    const checkFavoriteStatus = async () => {
      const status = await checkIsFavorite(_id)
      setIsFavorite(status)
    }

    checkFavoriteStatus()

    // Écouter les changements de favoris
    const handleFavoritesChanged = async () => {
      const status = await checkIsFavorite(_id)
      setIsFavorite(status)
    }

    window.addEventListener("favoritesChanged", handleFavoritesChanged)
    window.addEventListener("userLogin", handleFavoritesChanged)
    window.addEventListener("userLogout", handleFavoritesChanged)

    return () => {
      window.removeEventListener("favoritesChanged", handleFavoritesChanged)
      window.removeEventListener("userLogin", handleFavoritesChanged)
      window.removeEventListener("userLogout", handleFavoritesChanged)
    }
  }, [_id])

  // Modifier la fonction toggleFavorite pour vérifier l'authentification
  const toggleFavorite = async (e) => {
    e.stopPropagation()

    if (isProcessing) return // Éviter les clics multiples

    // Vérifier si l'utilisateur est connecté
    const isAuthenticated = localStorage.getItem("CC_Token") !== null && localStorage.getItem("user") !== null
    if (!isAuthenticated) {
      // Stocker l'URL actuelle pour rediriger l'utilisateur après la connexion
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname)
      // Rediriger vers la page de connexion
      navigate("/login")
      return
    }

    setIsProcessing(true)

    try {
      if (isFavorite) {
        await removeFromFavorites(_id)
      } else {
        await addToFavorites(_id)
      }

      // Mettre à jour l'état local
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error("Erreur lors de la modification des favoris:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Determine which price to use
  const hasPromo = prixPromo !== null && prixPromo !== undefined && prixPromo > 0 && prixPromo < prix
  // Calculer le pourcentage de réduction
  const discountPercent = hasPromo ? Math.round(((prix - prixPromo) / prix) * 100) : 0

  const finalPrice = hasPromo ? prixPromo : prix

  const addToCart = (e) => {
    e.stopPropagation()

    const product = {
      id: _id, // react-use-cart utilise id comme identifiant unique
      image: imagepro,
      name: title, // react-use-cart utilise name au lieu de title
      description,
      price: finalPrice, // react-use-cart utilise price au lieu de prix
      prixOriginal: prix, // Garder pour référence
      prixPromo: prixPromo, // Garder pour référence
      hasPromo: hasPromo, // Garder pour référence
      qtestock: stock,
      marque: marqueID?.nommarque,
    }

    addItem(product)

    // Préparer les données pour la notification
    setAddedProduct(product)

    // Calculer les totaux du panier
    const cartTotalInfo = {
      items: items.length + 1, // +1 car l'item qu'on vient d'ajouter n'est pas encore compté
      subtotal: cartTotal + finalPrice,
      shipping: 7.0, // Frais de livraison fixes
      total: cartTotal + finalPrice + 7.0,
    }

    // Afficher la notification
    setShowNotification(true)
  }

  const closeNotification = () => {
    setShowNotification(false)
  }

  return (
    <>
      <div
        className="card"
        onClick={() => {
          if (_id) {
            navigate(`/produit/${_id}`)
          } else {
            console.error("Erreur: ID du produit est undefined !")
          }
        }}
        style={{ cursor: "pointer" }}
      >
        <button
          className="favorite-button"
          onClick={toggleFavorite}
          disabled={isProcessing}
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "rgba(255, 255, 255, 0.8)",
            border: "none",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: isProcessing ? "wait" : "pointer",
            zIndex: 2,
          }}
        >
          {isFavorite ? <Favorite style={{ color: "#FC6A80FF" }} /> : <FavoriteBorder style={{ color: "#666" }} />}
        </button>
        {hasPromo && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              backgroundColor: "#FF0000",
              color: "white",
              padding: "4px 8px",
              borderRadius: "20px",
              fontWeight: "bold",
              fontSize: "0.8rem",
              zIndex: 2,
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            }}
          >
            -{discountPercent}%
          </div>
        )}
        {imagepro && <img src={imagepro || "/placeholder.svg"} alt={title} />}
        <div className="card-content">
          <h1 className="card-title">{title.length > 25 ? `${title.substring(0, 25)}...` : title}</h1>
          {marqueID && marqueID.nommarque && <p className="card-marque">{marqueID.nommarque}</p>}

          {/* Display both prices if there's a promotional price */}
          {hasPromo ? (
            <div className="price-container">
              <h1 className="card-title promo-price">Prix : {prixPromo.toFixed(3)} TND</h1>
              <span className="original-price">{prix.toFixed(3)} TND</span>
            </div>
          ) : (
            <h1 className="card-prix">Prix : {prix.toFixed(3)} TND</h1>
          )}

          <button className="card-button" onClick={addToCart}>
            <i className="fa-solid fa-basket-shopping"></i> Ajouter au panier
          </button>
        </div>
      </div>

      {/* Notification stylisée pour l'ajout au panier */}
      <CartNotification
        open={showNotification}
        onClose={closeNotification}
        product={addedProduct}
        quantity={1}
        cartTotal={{
          items: items.length + 1,
          subtotal: cartTotal + (addedProduct?.price || 0),
          shipping: 7.0,
          total: cartTotal + (addedProduct?.price || 0) + 7.0,
        }}
      />
    </>
  )
}

export default Card
