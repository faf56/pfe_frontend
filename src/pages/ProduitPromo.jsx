"use client"

import { useEffect, useState, useCallback } from "react"
import Card from "../components/card/Card"
import { fetchpromoproduit } from "../service/produitservice"
import FilterSidebar from "../components/filter/FilterSidebar"
import FilterSidebarMobile from "../components/filter/FilterSidebarMobile"
import { Box, Container, Grid, Typography, Skeleton, useMediaQuery, useTheme, Paper, Button } from "@mui/material"
import "./ProductCard.css"

const ProduitPromo = () => {
  const [allProduits, setAllProduits] = useState([])
  const [filteredProduits, setFilteredProduits] = useState([])
  const [loading, setLoading] = useState(true)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetchpromoproduit()
      setAllProduits(res.data)
      setFilteredProduits(res.data)
    } catch (error) {
      console.error("Erreur de chargement des produits:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleFilterChange = useCallback(
    (filteredProducts) => {
      setFilteredProduits(filteredProducts || allProduits)
    },
    [allProduits],
  )

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3} lg={2.5} sx={{ display: { xs: "none", md: "block" } }}>
            <Skeleton variant="rectangular" height={600} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={9} lg={9.5}>
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

  return (
    <Container maxWidth="xl"  sx={{ py: 4,bgcolor: "#F1FBFA72" }}>
      <Grid container spacing={3}>
        {/* Sidebar pour desktop */}
        <Grid item xs={12} md={3} lg={2.5} sx={{ display: { xs: "none", md: "block" } }}>
          <FilterSidebar initialProducts={allProduits} onFilterChange={handleFilterChange} />
        </Grid>

        {/* Contenu principal */}
        <Grid item xs={12} md={9} lg={9.5}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" component="h1" gutterBottom>
              Produit En Promo
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {filteredProduits.length} produits trouvés
            </Typography>
          </Box>

          {filteredProduits.length > 0 ? (
            <Grid container spacing={2}>
              {filteredProduits.map((pro) => (
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
                onClick={() => setFilteredProduits(allProduits)}
                sx={{ mt: 2 }}
              >
                Réinitialiser les filtres
              </Button>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Sidebar mobile (bouton flottant + drawer) */}
      <FilterSidebarMobile initialProducts={allProduits} onFilterChange={handleFilterChange} />
    </Container>
  )
}

export default ProduitPromo
