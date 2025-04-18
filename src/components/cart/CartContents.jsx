import { useShoppingCart} from 'use-shopping-cart';
import { MdDeleteForever } from "react-icons/md";
import {Link } from 'react-router-dom'
import axios from '../../api/axios';



const CartContents = () => {
  const {cartDetails, removeItem, clearCart, totalPrice,cartCount,incrementItem,decrementItem,formattedTotalPrice} =useShoppingCart();
 

  const cartItems = Object.values(cartDetails);
  const computedTotalPrice = cartItems.reduce((total, item) => {
    return total + (item.prix * item.quantity);
  }, 0);
 
  return (
    <>
    <div className="cart-container">
      {cartItems.map((item) => (
        <div key={item.id} className='cart-item'>
          {item.image && (
            <img
              src={item.image}
              alt={item.title}
              className='cart-item-image'
            />
          )}
          <div className="cart-item-details">
            <h3 className="cart-item-title">{item.title}</h3>
            {item.marque && <p className='cart-item-brand'>{item.marque}</p>}
            <div className='quantity-controls'>
              <button
                onClick={() => decrementItem(item.id)}
                className='quantity-btn'
              >
                -
              </button>
              <span className='quantity-value'>{item.quantity}</span>
              <button
                onClick={() => incrementItem(item.id)}
                className='quantity-btn'
              >
                +
              </button>
            </div>
          </div>
          <div className="cart-item-actions">
            <p className="cart-item-price">{Number(item.prix).toFixed(3)}TND</p>
            <div className="cart-product-total-price">
            {(Number(item.prix) * item.quantity).toFixed(3)} TND
              </div>
            <button onClick={() => removeItem(item.id)}>
              <MdDeleteForever className="delete-icon" />
            </button>
          </div>
        </div>
      ))}
      
    </div>

    <div className="cart-total">
        <h3>Total: {computedTotalPrice.toFixed(3)} TND</h3>
      </div>
    
    <button className="clear-btn" onClick={() => clearCart()}>
Clear Cart
</button>
    </>
  )
}

export default CartContents
