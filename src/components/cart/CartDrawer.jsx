import { IoMdClose } from "react-icons/io";
import './cart.css';
import CartContents from "./CartContents"
const CartDrawer = ({drawerOpen, toggleCartDrawer}) => {
  

  return (
    <div className={`cart-drawer ${drawerOpen ? "cart-drawer-open" : "cart-drawer-closed"}`}>
      {/* Bouton de fermeture */}
      <div className="cart-drawer-header">
        <button onClick={toggleCartDrawer} className="cart-close-btn">
          <IoMdClose className="cart-close-icon" />
        </button>
      </div>
      
      {/* cart content with scrolable area */}
      <div className="cart-content">
        <h2 className="cart-title">Panier</h2>
        {/* component for cart content*/}
        <CartContents />
      </div>
      {/* chekout button fixed at the boottom */}
      <div className="cart-checkout">
        <button className="checkout-btn">Finaliser La Commande</button>
      </div>
    </div>
  );
};

export default CartDrawer;