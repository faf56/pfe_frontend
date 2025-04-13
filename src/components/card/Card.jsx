import { useShoppingCart } from 'use-shopping-cart';
import { useNavigate } from 'react-router-dom';

import "./card.css";

const Card = ({ imagepro, title, description, prix, stock, _id, marqueID }) => {
  const { addItem } = useShoppingCart();
  const navigate = useNavigate();


  const addToCart = (e) => {
    e.stopPropagation();
    
    const pro = {
      image: imagepro,
      title: title,
      description,
      prix: prix,
      quantity: 1,
      qtestock: stock,
      id: _id, // Utilisez bien _id ici
      marque: marqueID?.nommarque,
    };

    addItem(pro);
    alert(`Produit ajouté au panier avec succès!\nNom: ${title}\nID: ${_id}\nPrix: ${prix} TND\nMarque: ${marqueID?.nommarque || 'Non spécifiée'}`);
  };
  //console.log("ID du produit cliqué:", _id);
  return (
    <div className='card'  onClick={() => {
      console.log("Produit cliqué, ID:", _id); // Debug ici
      if (_id) {
        navigate(`/produit/${_id}`);
      } else {
        console.error("Erreur: ID du produit est undefined !");
      }
    }}                  style={{ cursor: "pointer" }}>

      {imagepro && <img src={imagepro} alt={title} />}
      <div className='card-content'>
        <h1 className='card-title'>{title}</h1>
        {marqueID && marqueID.nommarque && (
          <p className='card-marque'>{marqueID.nommarque}</p>
        )}
        <h1 className='card-title'>Prix : {prix} TND</h1>

        <button className="card-button" onClick={addToCart}>
          <i className="fa-solid fa-basket-shopping"></i> Ajouter au panier
        </button>
      </div>
    </div>
  );
};

export default Card;
