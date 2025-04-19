"use client"

import { useEffect, useState, useCallback } from "react"
import { useLocation } from "react-router-dom"
import {
  fetchProduitsByScategorie,
  fetchProduitsByCategorie,
  fetchproduits,
  searchProduits,
} from "../service/produitservice"
import { fetchscategories } from "../service/scategorieservice"
import Card from "../components/card/Card"
import FilterSidebar from "../components/filter/FilterSidebar"
import FilterSidebarMobile from "../components/filter/FilterSidebarMobile"
import { Box, Container, Grid, Typography, Skeleton, useMediaQuery, useTheme, Paper, Button } from "@mui/material"
import "./ProductCard.css"

const ProductsPage = () => {
  const [allProducts, setAllProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

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

        if (location.state?.filter === "category") {
          // Nouveau cas: filtrage par catégorie
          try {
            const response = await fetchProduitsByCategorie(location.state.id)
            setAllProducts(response.data)
            setFilteredProducts(response.data)
          } catch (err) {
            console.error("Erreur lors du chargement des produits par catégorie:", err)
            setError(`Aucun produit trouvé pour la catégorie "${location.state.value}"`)
          }
        } else if (location.state?.filter === "subcategory") {
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
        } else if (location.state?.filter === "promotions") {
          // Afficher uniquement les produits en promotion
          try {
            const response = await fetchproduits()
            const promoProducts = response.data.filter(
              (product) => product.prixPromo && product.prixPromo > 0 && product.prixPromo < product.prix,
            )
            setAllProducts(promoProducts)
            setFilteredProducts(promoProducts)
          } catch (err) {
            console.error("Erreur lors du chargement des promotions:", err)
            setError("Erreur de chargement des promotions")
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

  // Gérer les changements de filtre - use memoized callback to prevent infinite loops
  const handleFilterChange = useCallback((filteredProductsList) => {
    // Simply set the filtered products that come from the FilterSidebar
    setFilteredProducts(filteredProductsList)
  }, [])

  // Titre de la page en fonction du filtre
  const getPageTitle = () => {
    if (location.state?.filter === "search") {
      return `Résultats pour "${location.state.value}"`
    } else if (location.state?.filter === "promotions") {
      return "Produits en promotion"
    } else if (location.state?.filter === "category" || location.state?.filter === "subcategory") {
      return location.state.value
    } else {
      return "Tous les produits"
    }
  }

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3} lg={2.5} sx={{ display: { xs: "none", md: "block" } }}>
            <Skeleton variant="rectangular" height={600} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={9} lg={9.5}>
            <Skeleton variant="rectangular" height={60} sx={{ mb: 3, borderRadius: 1 }} />
            <Grid container spacing={2}>
              {Array.from(new Array(8)).map((_, index) => (
                <Grid item xs={6} sm={4} md={4} lg={3} key={index}>
                  <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 2 }} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2, bgcolor: "#ffebee" }}>
          <Typography variant="h6" color="error" gutterBottom>
            {error}
          </Typography>
          <Button variant="contained" color="primary" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
            Réessayer
          </Button>
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4,bgcolor: "#F2D7FB33" }}>
      <Grid container spacing={3}>
        {/* Sidebar pour desktop */}
        <Grid item xs={12} md={3} lg={2.5} sx={{ display: { xs: "none", md: "block" } }}>
          <FilterSidebar initialProducts={allProducts} onFilterChange={handleFilterChange} />
        </Grid>

        {/* Contenu principal */}
        <Grid item xs={12} md={9} lg={9.5}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" component="h1" gutterBottom>
              {getPageTitle()}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {filteredProducts.length} produits trouvés
            </Typography>
          </Box>

          {filteredProducts.length > 0 ? (
            <Grid container spacing={2}>
              {filteredProducts.map((pro) => (
                <Grid item xs={6} sm={4} md={4} lg={3} key={pro._id}>
                  <Card
                    _id={pro._id}
                    imagepro={pro.imagepro}
                    title={pro.title}
                    description={pro.description}
                    prix={pro.prix}
                    prixPromo={pro.prixPromo}
                    stock={pro.stock}
                    marqueID={pro.marqueID}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 2,
                backgroundColor: theme.palette.background.default,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Aucun produit ne correspond à vos filtres
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Essayez de modifier vos critères de filtrage pour voir plus de produits.
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setFilteredProducts(allProducts)}
                sx={{ mt: 2 }}
              >
                Réinitialiser les filtres
              </Button>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Sidebar mobile (bouton flottant + drawer) */}
      <FilterSidebarMobile initialProducts={allProducts} onFilterChange={handleFilterChange} />
    </Container>
  )
}

export default ProductsPage
