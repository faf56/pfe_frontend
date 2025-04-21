import { IoMdClose } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { IconButton, Button, Divider } from '@mui/material';
import { ShoppingCart, Payment } from '@mui/icons-material';
import './cart.css';
import CartContents from "./CartContents";

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const navigate = useNavigate();
  
  const handleCheckout = () => {
    toggleCartDrawer();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    toggleCartDrawer();
    navigate('/panier');
  };

  return (
    <div className={`cart-drawer ${drawerOpen ? "cart-drawer-open" : "cart-drawer-closed"}`}>
      <div className="cart-drawer-header">
        <h2 className="cart-title">Panier</h2>
        <IconButton 
          onClick={toggleCartDrawer} 
          className="cart-close-btn"
          aria-label="close cart"
        >
          <IoMdClose className="cart-close-icon" />
        </IconButton>
      </div>
      
      <div className="cart-content">
        <CartContents />
      </div>

      <div className="cart-checkout">
  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
    <button className="view-cartpage-btn" onClick={handleViewCart}>
      <i className="fa-solid fa-cart-shopping"></i> Voir le panier
    </button>
    <button className="checkout-btn" onClick={handleCheckout}>
      <i className="fa-solid fa-circle-dollar-to-slot"></i> Commander
    </button>
  </div>
</div>
    </div>
  );
};

export default CartDrawer;