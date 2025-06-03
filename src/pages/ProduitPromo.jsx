"use client"

import { useEffect, useState, useCallback } from "react"
import Card from "../components/card/Card"
import { fetchpromoproduit } from "../service/produitservice"
import FilterSidebar from "../components/filter/FilterSidebar"
import FilterSidebarMobile from "../components/filter/FilterSidebarMobile"
import SortSelector from "../components/filter/SortSelector"
import Pagination from "../components/pagination/Pagination"
import {
  Box,
  Container,
  Grid,
  Typography,
  Skeleton,
  useMediaQuery,
  useTheme,
  Paper,
  Button,
  Breadcrumbs,
  Link,
  Divider,
} from "@mui/material"
import { NavigateNext, LocalOffer } from "@mui/icons-material"
import "./ProductCard.css"

const ProduitPromo = () => {
  const [allProduits, setAllProduits] = useState([])
  const [filteredProduits, setFilteredProduits] = useState([])
  const [displayedProducts, setDisplayedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [sortOption, setSortOption] = useState("default")
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"))

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
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

  // Appliquer le tri et la pagination aux produits filtrés
  useEffect(() => {
    // Tri des produits
    const sortedProducts = [...filteredProduits]

    switch (sortOption) {
      case "price_asc":
        sortedProducts.sort((a, b) => {
          const priceA = a.prixPromo || a.prix
          const priceB = b.prixPromo || b.prix
          return priceA - priceB
        })
        break
      case "price_desc":
        sortedProducts.sort((a, b) => {
          const priceA = a.prixPromo || a.prix
          const priceB = b.prixPromo || b.prix
          return priceB - priceA
        })
        break
      case "name_asc":
        sortedProducts.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "name_desc":
        sortedProducts.sort((a, b) => b.title.localeCompare(a.title))
        break
      case "newest":
        sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      default:
        // Par défaut, on garde l'ordre initial
        break
    }

    // Pagination
    const startIndex = (page - 1) * pageSize
    const paginatedProducts = sortedProducts.slice(startIndex, startIndex + pageSize)

    setDisplayedProducts(paginatedProducts)
  }, [filteredProduits, page, pageSize, sortOption])

  const handleFilterChange = useCallback(
    (filteredProducts) => {
      setFilteredProduits(filteredProducts || allProduits)
      setPage(1) // Réinitialiser à la première page lors du changement de filtre
    },
    [allProduits],
  )

  const handlePageChange = (event, value) => {
    setPage(value)
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value)
    setPage(1) // Réinitialiser à la première page lors du changement de taille
  }

  const handleSortChange = (option) => {
    setSortOption(option)
  }

  // Calcul du nombre total de pages
  const pageCount = Math.ceil(filteredProduits.length / pageSize)

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

  return (
    <Container maxWidth="xl" sx={{ py: 4, bgcolor: "#F1FBFA72" }}>
      {/* Fil d'Ariane */}
      <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link color="inherit" href="/" underline="hover">
          Accueil
        </Link>
        <Typography color="text.primary">Promotions</Typography>
      </Breadcrumbs>

      <Grid container spacing={3}>
        {/* Sidebar pour desktop */}
        <Grid item xs={12} md={3} lg={2.5} sx={{ display: { xs: "none", md: "block" } }}>
          <FilterSidebar initialProducts={allProduits} onFilterChange={handleFilterChange} />
        </Grid>

        {/* Contenu principal */}
        <Grid item xs={12} md={9} lg={9.5}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <LocalOffer sx={{ color: "error.main", mr: 1 }} />
              <Typography variant="h5" component="h1">
                Produits En Promotion
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                mt: 2,
              }}
            >
              <Typography variant="body1" color="text.secondary">
                {filteredProduits.length} produits trouvés
              </Typography>

              <SortSelector onSortChange={handleSortChange} initialSort={sortOption} />
            </Box>

            <Divider sx={{ mt: 2 }} />
          </Box>

          {filteredProduits.length > 0 ? (
            <>
              <Grid container spacing={2}>
                {displayedProducts.map((pro) => (
                  <Grid
                    item
                    xs={6}
                    sm={4}
                    md={4}
                    lg={3}
                    key={pro._id}
                    sx={{
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-5px)",
                      },
                    }}
                  >
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

              {/* Pagination */}
              {pageCount > 1 && (
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={handlePageChange}
                  pageSize={pageSize}
                  onPageSizeChange={handlePageSizeChange}
                  pageSizeOptions={[12, 24, 36, 48]}
                  showPageSize={!isSmall}
                />
              )}
            </>
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
