"use client"

import { useCart } from "react-use-cart"
import { Button } from "@mui/material"
import { Delete } from "@mui/icons-material"

const CartContents = () => {
  const { isEmpty, items, updateItemQuantity, removeItem, emptyCart, cartTotal } = useCart()

  return (
    <>
      <div className="cart-container">
        {isEmpty ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "#757575" }}>Votre panier est vide</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="cart-item">
              {item.image && <img src={item.image || "/placeholder.svg"} alt={item.name} className="cart-item-image" />}
              <div className="cart-item-details">
                <h3 className="cart-item-title">{item.name}</h3>
                {item.marque && <p className="cart-item-brand">{item.marque}</p>}
                <div className="quantity-controls">
                  <button onClick={() => updateItemQuantity(item.id, item.quantity - 1)} className="quantity-btn">
                    -
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button onClick={() => updateItemQuantity(item.id, item.quantity + 1)} className="quantity-btn">
                    +
                  </button>
                </div>
              </div>
              <div className="cart-item-actions">
                {item.hasPromo ? (
                  <div className="price-info">
                    <p className="cart-item-price promo-price">{Number(item.price).toFixed(3)} TND</p>
                    <p className="cart-item-original-price">{Number(item.prixOriginal).toFixed(3)} TND</p>
                  </div>
                ) : (
                  <p className="cart-item-price">{Number(item.price).toFixed(3)} TND</p>
                )}
                <p style={{ fontSize: "0.9rem", color: "#616161" }}>
                  Total: {(Number(item.price) * item.quantity).toFixed(3)} TND
                </p>
                <button onClick={() => removeItem(item.id)} className="delete-btn">
                  <Delete fontSize="small" color="error" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {!isEmpty && (
        <>
          <div className="cart-total">Total: {cartTotal.toFixed(3)} TND</div>
          <Button fullWidth variant="outlined" color="error" startIcon={<Delete />} onClick={() => emptyCart()}>
            Vider le panier
          </Button>
        </>
      )}
    </>
  )
}

export default CartContents
