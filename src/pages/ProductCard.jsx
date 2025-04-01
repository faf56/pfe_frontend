import React, { useEffect, useState, useCallback } from 'react';
import Card from "../components/card/Card";
import { fetchproduits } from "../service/produitservice";
import FilterSidebar from '../components/filter/FilterSidebar';
import './ProductCard.css';

const ProductCard = () => {
  const [allProduits, setAllProduits] = useState([]);
  const [filteredProduits, setFilteredProduits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetchproduits();
      setAllProduits(res.data);
      setFilteredProduits(res.data);
    } catch (error) {
      console.error("Erreur de chargement des produits:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = useCallback((filteredProducts) => {
    setFilteredProduits(filteredProducts || allProduits);
  }, [allProduits]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="product-page-container">
      <div className="filter-sidebar-container">
        <FilterSidebar 
          initialProducts={allProduits} 
          onFilterChange={handleFilterChange} 
        />
      </div>

      <div className="product-list-container">
        {filteredProduits.length > 0 ? (
          <div className="card-container">
            {filteredProduits.map((pro) => (
              <Card 
                key={pro._id}
                imagepro={pro.imagepro}
                title={pro.title}
                marqueID={pro.marqueID}
                prix={pro.prix}
              />
            ))}
          </div>
        ) : (
          <div className="no-products">
            <p>Aucun produit ne correspond à vos filtres</p>
            <button 
              onClick={() => setFilteredProduits(allProduits)}
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

export default ProductCard;