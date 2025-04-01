import { useShoppingCart} from 'use-shopping-cart';
import { MdDeleteForever } from "react-icons/md";
import {Link } from 'react-router-dom'
import axios from '../../api/axios';

const CartContents = () => {
  const {cartDetails, removeItem, clearCart, totalPrice,cartCount,incrementItem,decrementItem} =useShoppingCart();
  const cartItems = Object.values(cartDetails);
  return (
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
            <p className="cart-item-price">{item.prix}TND</p>
            <button onClick={() => removeItem(item.id)}>
              <MdDeleteForever className="delete-icon" />
            </button>
          </div>
        </div>
      ))}
    </div>
    
  )
}

export default CartContents
