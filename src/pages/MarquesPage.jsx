"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Breadcrumbs,
  Link as MuiLink,
  useTheme,
  CircularProgress,
  Paper,
} from "@mui/material"
import { NavigateNext } from "@mui/icons-material"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import { fetchmarques } from "../service/marqueservice"

const MarquesPage = () => {
  const [marques, setMarques] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const theme = useTheme()
  const navigate = useNavigate()

  // Palette de couleurs pastel
  const pastelColors = ["#d4bfff", "#c8f7a6", "#ffbdd4", "#a6e3ff", "#ffd6b8"]

  useEffect(() => {
    const loadMarques = async () => {
      try {
        setLoading(true)
        const response = await fetchmarques()
        setMarques(response.data)
      } catch (error) {
        console.error("Erreur lors du chargement des marques:", error)
        setError("Impossible de charger les marques. Veuillez réessayer plus tard.")
      } finally {
        setLoading(false)
      }
    }

    loadMarques()
  }, [])

  const handleMarqueClick = (marqueId) => {
    navigate(`/marques/${marqueId}`)
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Fil d'Ariane */}
      <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 4 }}>
        <MuiLink component={RouterLink} to="/" underline="hover" color="inherit">
          Accueil
        </MuiLink>
        <Typography color="text.primary">Marques</Typography>
      </Breadcrumbs>

      <Typography
        variant="h4"
        component="h1"
        align="center"
        gutterBottom
        sx={{ mb: 5, fontWeight: 600, color: "#2c3e50" }}
      >
        DÉCOUVREZ NOS MARQUES
      </Typography>

      {/* Affichage des marques en grille */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {marques.map((marque, index) => (
          <Grid item xs={12} sm={6} md={4} key={marque._id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                },
                borderRadius: 2,
                overflow: "hidden",
                backgroundColor: "white",
              }}
              onClick={() => handleMarqueClick(marque._id)}
            >
              <Box
                sx={{
                  height: 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  
                  p: 2,
                }}
              >
                <CardMedia
                  component="img"
                  image={marque.imagemarque || "/placeholder.svg?height=150&width=150"}
                  alt={marque.nommarque}
                  sx={{
                    maxHeight: 150,
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=150&width=150"
                  }}
                />
              </Box>
              <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                  {marque.nommarque}
                </Typography>
                <Button
                variant="outlined"
                onClick={() => handleMarqueClick(marque._id)}
                sx={{
                  borderColor: "#933AF9FF ",
                  color: "#933AF9FF ",
                  "&:hover": {
                    borderColor: "#933AF9FF ",
                    backgroundColor: "rgba(231, 76, 60, 0.05)",
                  },
                  whiteSpace: "nowrap",
                }}
              >
                  Voir les produits
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      

      
    </Container>
  )
}

export default MarquesPage
