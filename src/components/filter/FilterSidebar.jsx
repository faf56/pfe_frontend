import React, { useState, useEffect, useMemo } from 'react';
import { fetchmarques } from '../../service/marqueservice';
import { fetchscategories } from '../../service/scategorieservice';
import './FilterSidebar.css';

const FilterSidebar = ({ initialProducts, onFilterChange }) => {
  const [marques, setMarques] = useState([]);
  const [scategories, setScategories] = useState([]);
  const [selectedMarques, setSelectedMarques] = useState([]);
  const [selectedScategories, setSelectedScategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Chargement des marques et scategories
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [marquesRes, scategoriesRes] = await Promise.all([
          fetchmarques(),
          fetchscategories()
        ]);
        setMarques(marquesRes.data);
        setScategories(scategoriesRes.data);
      } catch (error) {
        console.error("Erreur de chargement des filtres:", error);
      } finally {
        setLoading(false);
      }
    };
    loadFilters();
  }, []);
  useEffect(() => {
    if (!loading) {
      const filtered = initialProducts.filter(product => {
        const marqueMatch = selectedMarques.length === 0 || 
          (product.marqueID && selectedMarques.includes(product.marqueID._id));
        const scategorieMatch = selectedScategories.length === 0 || 
          (product.scategorieID && selectedScategories.includes(product.scategorieID._id));
        return marqueMatch && scategorieMatch;
      });
      onFilterChange(filtered);
    }
  }, [selectedMarques, selectedScategories, initialProducts, loading, onFilterChange]);

  const toggleFilter = (type, id) => {
    if (type === 'marque') {
      setSelectedMarques(prev => {
        const newMarques = prev.includes(id) 
          ? prev.filter(i => i !== id) 
          : [...prev, id];
        // Si on a tout décoché, on réinitialise complètement
        return newMarques.length === 0 ? [] : newMarques;
      });
    } else {
      setSelectedScategories(prev => {
        const newScategories = prev.includes(id) 
          ? prev.filter(i => i !== id) 
          : [...prev, id];
        return newScategories.length === 0 ? [] : newScategories;
      });
    }
  };
  // Calcul des compteurs
  const counts = useMemo(() => {
    const marqueCounts = {};
    const scategorieCounts = {};

    initialProducts.forEach(product => {
      if (product.marqueID) {
        marqueCounts[product.marqueID._id] = (marqueCounts[product.marqueID._id] || 0) + 1;
      }
      if (product.scategorieID) {
        scategorieCounts[product.scategorieID._id] = (scategorieCounts[product.scategorieID._id] || 0) + 1;
      }
    });

    return { marques: marqueCounts, scategories: scategorieCounts };
  }, [initialProducts]);

  // Application des filtres
  useEffect(() => {
    if (!loading) {
      const filtered = initialProducts.filter(product => {
        const marqueMatch = selectedMarques.length === 0 || 
          (product.marqueID && selectedMarques.includes(product.marqueID._id));
        const scategorieMatch = selectedScategories.length === 0 || 
          (product.scategorieID && selectedScategories.includes(product.scategorieID._id));
        return marqueMatch && scategorieMatch;
      });
      // Vérifier si les produits filtrés sont différents avant d'appeler onFilterChange
      if (JSON.stringify(filtered) !== JSON.stringify(initialProducts)) {
        onFilterChange(filtered);
      }
    }
  }, [selectedMarques, selectedScategories, initialProducts, loading, onFilterChange]);

 

  const resetFilters = () => {
    setSelectedMarques([]);
    setSelectedScategories([]);
  };

  if (loading) return <div className="filter-sidebar loading">Chargement...</div>;

  return (
    <div className="filter-sidebar">
      <div className="filter-header">
        <h3>Filtrer par</h3>
        {(selectedMarques.length > 0 || selectedScategories.length > 0) && (
          <button onClick={resetFilters} className="reset-btn">
            Réinitialiser
          </button>
        )}
      </div>

      {/* Filtres par marque */}
      <div className="filter-group">
        <h4>Marques</h4>
        {marques.map(marque => (
          <div key={marque._id} className={`filter-option ${counts.marques[marque._id] === 0 ? 'disabled' : ''}`}>
            <input
              type="checkbox"
              id={`marque-${marque._id}`}
              checked={selectedMarques.includes(marque._id)}
              onChange={() => toggleFilter('marque', marque._id)}
              disabled={counts.marques[marque._id] === 0}
            />
            <label htmlFor={`marque-${marque._id}`}>
              {marque.nommarque} ({counts.marques[marque._id] || 0})
            </label>
          </div>
        ))}
      </div>

      {/* Filtres par sous-catégorie */}
      <div className="filter-group">
        <h4>Sous-catégories</h4>
        {scategories.map(scategorie => (
          <div key={scategorie._id} className={`filter-option ${counts.scategories[scategorie._id] === 0 ? 'disabled' : ''}`}>
            <input
              type="checkbox"
              id={`scategorie-${scategorie._id}`}
              checked={selectedScategories.includes(scategorie._id)}
              onChange={() => toggleFilter('scategorie', scategorie._id)}
              disabled={counts.scategories[scategorie._id] === 0}
            />
            <label htmlFor={`scategorie-${scategorie._id}`}>
              {scategorie.nomscategorie} ({counts.scategories[scategorie._id] || 0})
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterSidebar;