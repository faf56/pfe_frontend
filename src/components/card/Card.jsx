import { useShoppingCart } from 'use-shopping-cart';
import "./card.css";

const Card = ({ imagepro, title, description, prix, stock, id, marqueID }) => {
  const { addItem } = useShoppingCart();

  const addToCart = () => {
    const pro = {
      image: imagepro,
      title: title,
      description: description,
      prix: prix,
      quantity: 1,
      qtestock: stock,
      id: id,
      marque: marqueID?.nommarque,
    };

    addItem(pro);
    
    // Affichage du message de succès avec les détails du produit
    alert(`Produit ajouté au panier avec succès!\nNom : ${title}\nPrix : ${prix} TND\nMarque : ${marqueID?.nommarque}`);
  };

  return (
    <div className='card'>
      {imagepro && <img src={imagepro} alt={title} />}
      <div className='card-content'>
        <h1 className='card-title'>{title}</h1>
        {marqueID && marqueID.nommarque && (
          <p className='card-marque'>{marqueID.nommarque}</p>
        )}

        <h1 className='card-title'>Prix : {prix}TND</h1>

        <button className="card-button" onClick={() => addToCart()}>
          <i className="fa-solid fa-basket-shopping"></i> Ajouter au panier
        </button>
      </div>
    </div>
  );
};

export default Card;
