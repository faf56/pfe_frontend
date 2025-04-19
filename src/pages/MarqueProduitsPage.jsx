"use client"

import { useState, useEffect } from "react"
import { useParams, Link as RouterLink } from "react-router-dom"
import { Box, Container, Typography, Grid, Breadcrumbs, Link as MuiLink, Chip, CircularProgress } from "@mui/material"
import { NavigateNext } from "@mui/icons-material"
import { fetchmarqueById } from "../service/marqueservice"
import { fetchProduitsByMarque } from "../service/produitservice"
import Card from "../components/card/Card" // Importation du composant Card personnalisé

const MarqueProduitsPage = () => {
  const { id } = useParams()
  const [marque, setMarque] = useState(null)
  const [produits, setProduits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const loadMarqueEtProduits = async () => {
      try {
        setLoading(true)
        const [marqueResponse, produitsResponse] = await Promise.all([fetchmarqueById(id), fetchProduitsByMarque(id)])
        setMarque(marqueResponse.data)
        setProduits(produitsResponse.data)
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
        setError("Impossible de charger les données. Veuillez réessayer plus tard.")
      } finally {
        setLoading(false)
      }
    }

    // Charger les favoris depuis le localStorage
    const storedFavorites = localStorage.getItem("favorites")
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }

    loadMarqueEtProduits()
  }, [id])

  const toggleFavorite = (productId) => {
    const newFavorites = favorites.includes(productId)
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId]

    setFavorites(newFavorites)
    localStorage.setItem("favorites", JSON.stringify(newFavorites))
  }

  const formatPrice = (price) => {
    return Number.parseFloat(price).toFixed(3) + " DT"
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress size={60} sx={{ color: "#e74c3c" }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" color="error" align="center">
          {error}
        </Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4,bgcolor: "#FDF1F378" }}>
      {/* Fil d'Ariane */}
      <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 4 }}>
        <MuiLink component={RouterLink} to="/" underline="hover" color="inherit">
          Accueil
        </MuiLink>
        <MuiLink component={RouterLink} to="/marques" underline="hover" color="inherit">
          Marques
        </MuiLink>
        <Typography color="text.primary">{marque?.nommarque}</Typography>
      </Breadcrumbs>

      {/* En-tête de la marque */}
      

      {/* Liste des produits */}
      

      {produits.length === 0 ? (
        <Typography variant="body1" align="center" sx={{ py: 5 }}>
          Aucun produit disponible pour cette marque.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {produits.map((produit) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={produit._id}>
              <Card
                _id={produit._id}
                imagepro={produit.imagepro}
                title={produit.title}
                description={produit.description}
                prix={produit.prix}
                prixPromo={produit.prixPromo}
                stock={produit.stock}
                marqueID={produit.marqueID}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}

export default MarqueProduitsPage
