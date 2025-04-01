import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchProduitsByScategorie, fetchproduits } from '../service/produitservice';
import { fetchscategories } from '../service/scategorieservice';
import Card from '../components/card/Card';
import FilterSidebar from '../components/filter/FilterSidebar';
import './ProductCard.css';

const ProductsPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Fonction pour trouver une sous-catégorie par son nom
  const findScategorieByName = async (name) => {
    try {
      const response = await fetchscategories();
      return response.data.find(scat => 
        scat.nomscategorie.toLowerCase() === name.toLowerCase()
      );
    } catch (err) {
      console.error("Erreur recherche sous-catégorie:", err);
      setError("Erreur de chargement des catégories");
      return null;
    }
  };

  // Charger les produits initiaux
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (location.state?.filter === 'subcategory') {
          const scategorie = await findScategorieByName(location.state.value);
          if (scategorie) {
            const response = await fetchProduitsByScategorie(scategorie._id);
            setAllProducts(response.data);
            setFilteredProducts(response.data); // Initialise filteredProducts avec les données chargées
          } else {
            setError(`Sous-catégorie "${location.state.value}" non trouvée`);
          }
        } else {
          const response = await fetchproduits();
          setAllProducts(response.data);
          setFilteredProducts(response.data); // Initialise filteredProducts avec les données chargées
        }
      } catch (err) {
        console.error("Erreur chargement produits:", err);
        setError("Erreur de chargement des produits");
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [location.state]);

  // Gérer les changements de filtre avec useCallback pour éviter les rendus infinis
  const handleFilterChange = useCallback((filteredProducts) => {
    // Si filteredProducts est null ou identique à allProducts, on réinitialise
    if (!filteredProducts || filteredProducts.length === allProducts.length) {
      setFilteredProducts(allProducts);
    } else {
      setFilteredProducts(filteredProducts);
    }
  }, [allProducts]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement en cours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="retry-button"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="product-page-container">
      <div className="filter-sidebar-container">
        <FilterSidebar 
          initialProducts={allProducts}
          onFilterChange={handleFilterChange}
          currentSubcategory={location.state?.value}
        />
      </div>

      <div className="product-list-container">
        <h2 className="page-title">
          {location.state?.value || 'Tous les produits'}
          <span className="product-count">({filteredProducts.length} produits)</span>
        </h2>
        
        {filteredProducts.length > 0 ? (
          <div className="card-container">
            {filteredProducts.map(product => (
              <Card
                key={product._id}
                imagepro={product.imagepro}
                title={product.title}
                marqueID={product.marqueID}
                prix={product.prix}
                scategorieID={product.scategorieID}
              />
            ))}
          </div>
        ) : (
          <div className="no-products">
            <p>Aucun produit ne correspond à vos filtres</p>
            <button 
              onClick={() => setFilteredProduits(allProducts)}
              className="reset-filters-btn"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;