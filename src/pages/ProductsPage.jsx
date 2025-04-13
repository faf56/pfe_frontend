"use client"

import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { fetchProduitsByScategorie, fetchproduits, searchProduits } from "../service/produitservice"
import { fetchscategories } from "../service/scategorieservice"
import Card from "../components/card/Card"
import FilterSidebar from "../components/filter/FilterSidebar"
import "./ProductCard.css"

const ProductsPage = () => {
  const [allProducts, setAllProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const location = useLocation()

  // Fonction pour trouver une sous-catégorie par son nom
  const findScategorieByName = async (name) => {
    try {
      const response = await fetchscategories()
      return response.data.find((scat) => scat.nomscategorie.toLowerCase() === name.toLowerCase())
    } catch (err) {
      console.error("Erreur recherche sous-catégorie:", err)
      setError("Erreur de chargement des catégories")
      return null
    }
  }

  // Charger les produits initiaux
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        if (location.state?.filter === "subcategory") {
          const scategorie = await findScategorieByName(location.state.value)
          if (scategorie) {
            const response = await fetchProduitsByScategorie(scategorie._id)
            setAllProducts(response.data)
            setFilteredProducts(response.data)
          } else {
            setError(`Sous-catégorie "${location.state.value}" non trouvée`)
          }
        } else if (location.state?.filter === "search") {
          // Gestion de la recherche
          try {
            const response = await searchProduits(location.state.value)
            if (response.data.success) {
              setAllProducts(response.data.results)
              setFilteredProducts(response.data.results)
            } else {
              setError(response.data.message || "Erreur lors de la recherche")
            }
          } catch (err) {
            console.error("Erreur lors de la recherche:", err)
            setError(`Aucun résultat pour "${location.state.value}"`)
          }
        } else {
          const response = await fetchproduits()
          setAllProducts(response.data)
          setFilteredProducts(response.data)
        }
      } catch (err) {
        console.error("Erreur chargement produits:", err)
        setError("Erreur de chargement des produits")
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [location.state])

  // Gérer les changements de filtre
  const handleFilterChange = (filteredProducts) => {
    if (!filteredProducts || filteredProducts.length === allProducts.length) {
      setFilteredProducts(allProducts)
    } else {
      setFilteredProducts(filteredProducts)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement en cours...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Réessayer
        </button>
      </div>
    )
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
          {location.state?.filter === "search"
            ? `Résultats pour "${location.state.value}"`
            : location.state?.value || "Tous les produits"}
          <span className="product-count">({filteredProducts.length} produits)</span>
        </h2>

        {filteredProducts.length > 0 ? (
          <div className="card-container">
            {filteredProducts.map((product) => (
              <Card
                key={product._id}
                _id={product._id}
                imagepro={product.imagepro}
                title={product.title}
                description={product.description}
                prix={product.prix}
                stock={product.stock}
                marqueID={product.marqueID}
              />
            ))}
          </div>
        ) : (
          <div className="no-products">
            <p>Aucun produit ne correspond à vos filtres</p>
            <button onClick={() => setFilteredProducts(allProducts)} className="reset-filters-btn">
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage

