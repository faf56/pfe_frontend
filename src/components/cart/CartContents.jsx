"use client"

import { useShoppingCart } from "use-shopping-cart"
import { MdDeleteForever } from "react-icons/md"
import { Button, Divider } from '@mui/material';
import { Delete } from '@mui/icons-material';

const CartContents = () => {
  const {
    cartDetails,
    removeItem,
    clearCart,
    totalPrice,
    cartCount,
    incrementItem,
    decrementItem,
    formattedTotalPrice,
  } = useShoppingCart()

  const cartItems = Object.values(cartDetails)
  const computedTotalPrice = cartItems.reduce((total, item) => {
    return total + item.prix * item.quantity
  }, 0)

  return (
    <>
      <div className="cart-container">
        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#757575' }}>
            Votre panier est vide
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              {item.image && <img src={item.image || "/placeholder.svg"} alt={item.title} className="cart-item-image" />}
              <div className="cart-item-details">
                <h3 className="cart-item-title">{item.title}</h3>
                {item.marque && <p className="cart-item-brand">{item.marque}</p>}
                <div className="quantity-controls">
                  <button onClick={() => decrementItem(item.id)} className="quantity-btn">
                    -
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button onClick={() => incrementItem(item.id)} className="quantity-btn">
                    +
                  </button>
                </div>
              </div>
              <div className="cart-item-actions">
                {item.hasPromo ? (
                  <div className="price-info">
                    <p className="cart-item-price promo-price">{Number(item.prix).toFixed(3)} TND</p>
                    <p className="cart-item-original-price">{Number(item.prixOriginal).toFixed(3)} TND</p>
                  </div>
                ) : (
                  <p className="cart-item-price">{Number(item.prix).toFixed(3)} TND</p>
                )}
                <p style={{ fontSize: '0.9rem', color: '#616161' }}>
                  Total: {(Number(item.prix) * item.quantity).toFixed(3)} TND
                </p>
                <button onClick={() => removeItem(item.id)} className="delete-btn">
                  <Delete fontSize="small" color="error" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <>
          <div className="cart-total">
            Total: {computedTotalPrice.toFixed(3)} TND
          </div>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={() => clearCart()}
            
          >
            Vider le panier
          </Button>
          
        </>
      )}
    </>
  )
}

export default CartContents