"use client"

import { useShoppingCart } from "use-shopping-cart"
import { useNavigate } from "react-router-dom"

import "./card.css"

const Card = ({ imagepro, title, description, prix, prixPromo, stock, _id, marqueID }) => {
  const { addItem } = useShoppingCart()
  const navigate = useNavigate()

  // Determine which price to use
  const hasPromo = prixPromo !== null && prixPromo !== undefined && prixPromo > 0 && prixPromo < prix
  // Calculer le pourcentage de réduction
  const discountPercent = hasPromo ? Math.round(((prix - prixPromo) / prix) * 100) : 0

  const finalPrice = hasPromo ? prixPromo : prix

  const addToCart = (e) => {
    e.stopPropagation()

    const pro = {
      image: imagepro,
      title: title,
      description,
      prix: finalPrice, // Use the promotional price if available
      prixOriginal: prix, // Keep the original price for reference
      prixPromo: prixPromo, // Store the promo price
      hasPromo: hasPromo, // Flag to indicate if this is a promotional item
      quantity: 1,
      qtestock: stock,
      id: _id, // Utilisez bien _id ici
      marque: marqueID?.nommarque,
    }

    addItem(pro)
    alert(
      `Produit ajouté au panier avec succès!\nNom: ${title}\nID: ${_id}\nPrix: ${finalPrice} TND\nMarque: ${marqueID?.nommarque || "Non spécifiée"}`,
    )
  }

  return (
    <div
      className="card"
      onClick={() => {
        console.log("Produit cliqué, ID:", _id) // Debug ici
        if (_id) {
          navigate(`/produit/${_id}`)
        } else {
          console.error("Erreur: ID du produit est undefined !")
        }
      }}
      style={{ cursor: "pointer" }}
    >
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
  )
}

export default Card
