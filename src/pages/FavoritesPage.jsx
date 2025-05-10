"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getFavorites, clearFavorites, fetchFavoritesFromServer } from "../service/favoriteService"
import { fetchproduitById } from "../service/produitservice"
import Card from "../components/card/Card"
import { Container, Typography, Button, Box, CircularProgress, Grid, Breadcrumbs, Link } from "@mui/material"
import { NavigateNext, Favorite } from "@mui/icons-material"

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("CC_Token") !== null && localStorage.getItem("user") !== null,
  )

  // Fonction pour charger les favoris
  const loadFavorites = async () => {
    try {
      setLoading(true)

      if (isAuthenticated) {
        // Pour les utilisateurs connectés, récupérer directement les produits favoris complets
        const favoriteProducts = await fetchFavoritesFromServer()
        setProducts(favoriteProducts)
        setFavorites(favoriteProducts.map((product) => product._id))
      } else {
        // Pour les utilisateurs non connectés, récupérer les IDs puis les produits
        const favoriteIds = await getFavorites()
        setFavorites(favoriteIds)

        if (favoriteIds.length > 0) {
          const productsData = await Promise.all(
            favoriteIds.map(async (id) => {
              try {
                const response = await fetchproduitById(id)
                return response.data
              } catch (error) {
                console.error(`Erreur lors du chargement du produit ${id}:`, error)
                return null
              }
            }),
          )

          // Filtrer les produits null (en cas d'erreur)
          const validProducts = productsData.filter((product) => product !== null)
          setProducts(validProducts)
        } else {
          setProducts([])
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement des favoris:", error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFavorites()

    // Vérifier l'état d'authentification
    const checkAuth = () => {
      setIsAuthenticated(localStorage.getItem("CC_Token") !== null && localStorage.getItem("user") !== null)
    }

    // Ajouter un écouteur d'événements pour mettre à jour la liste des favoris
    const handleFavoritesChanged = () => {
      console.log("Événement favoritesChanged détecté, rechargement des favoris...")
      loadFavorites()
    }

    const handleAuthChanged = () => {
      checkAuth()
      loadFavorites()
    }

    window.addEventListener("favoritesChanged", handleFavoritesChanged)
    window.addEventListener("userLogin", handleAuthChanged)
    window.addEventListener("userLogout", handleAuthChanged)

    return () => {
      window.removeEventListener("favoritesChanged", handleFavoritesChanged)
      window.removeEventListener("userLogin", handleAuthChanged)
      window.removeEventListener("userLogout", handleAuthChanged)
    }
  }, [isAuthenticated])

  const handleClearFavorites = async () => {
    await clearFavorites()
    setFavorites([])
    setProducts([])
  }

  const handleShopNow = () => {
    navigate("/product")
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Fil d'Ariane */}
      <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 4 }}>
        <Link color="inherit" href="/" underline="hover">
          Accueil
        </Link>
        <Typography color="text.primary">Mes Favoris</Typography>
      </Breadcrumbs>

      <Box className="favorites-header">
        <Typography variant="h4" component="h1" className="favorites-title">
          <Favorite sx={{ mr: 1, verticalAlign: "middle", color: "#e74c3c" }} />
          Mes Produits Favoris
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress />
        </Box>
      ) : favorites.length === 0 ? (
        <Box className="no-favorites" sx={{ textAlign: "center", py: 5 }}>
          <Typography variant="h5" gutterBottom>
            Vous n'avez pas encore de produits favoris
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Explorez notre catalogue et ajoutez des produits à vos favoris en cliquant sur l'icône de cœur
          </Typography>
          <Button variant="contained" onClick={handleShopNow} sx={{ mt: 2 }}>
            Découvrir nos produits
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3} className="favorites-grid">
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <Card
                _id={product._id}
                imagepro={product.imagepro}
                title={product.title}
                description={product.description}
                prix={product.prix}
                prixPromo={product.prixPromo}
                stock={product.stock}
                marqueID={product.marqueID}
              />
            </Grid>
          ))}
        </Grid>
      )}
      {favorites.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button variant="outlined" color="error" onClick={handleClearFavorites} className="clear-favorites">
            Vider mes favoris
          </Button>
        </Box>
      )}
    </Container>
  )
}

export default FavoritesPage
