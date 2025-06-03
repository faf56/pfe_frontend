"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link as RouterLink } from "react-router-dom"
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  styled, 
  Button, 
  Breadcrumbs,
  Link
} from "@mui/material"
import {
  Person as PersonIcon,
  History as HistoryIcon,
  ExitToApp as LogoutIcon,
  ArrowBack as ArrowBackIcon
} from "@mui/icons-material"

// Composants des différentes sections
import InformationsPersonnelles from "../components/client/InformationsPersonnelles"
import HistoriqueCommandes from "../components/client/HistoriqueCommandes"

const MenuCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "isActive",
})(({ theme, isActive, color }) => ({
  padding: "20px",
  border: "2px solid #ddd",
  borderRadius: "16px",
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: isActive ? color : "#FFFFFFFF",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
    backgroundColor: isActive ? color : color + "22",
  },
}))

const IconWrapper = styled(Box)(({ theme }) => ({
  fontSize: "2rem",
  marginBottom: "10px",
  display: "flex",
  justifyContent: "center",
}))

const MonCompte = () => {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (!userStr) {
      navigate("/login")
      return
    }

    try {
      const userData = JSON.parse(userStr)
      setUser(userData)
    } catch (error) {
      console.error("Erreur lors de la récupération des données utilisateur:", error)
      navigate("/login")
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("CC_Token")
    localStorage.removeItem("user")
    localStorage.removeItem("refresh_token")
    navigate("/login")
  }

  const menuItems = [
    { id: "informations", title: "INFORMATIONS", icon: <PersonIcon fontSize="large" />, color: "#ffdbdb" },
    {
      id: "commandes",
      title: "HISTORIQUE ET DÉTAILS DE MES COMMANDES",
      icon: <HistoryIcon fontSize="large" />,
      color: "#E7F4FAFF",
    },
  ]

  const renderContent = () => {
    if (!activeSection) {
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6">Sélectionnez une section à afficher</Typography>
        </Box>
      )
    }

    switch (activeSection) {
      case "informations":
        return <InformationsPersonnelles user={user} setUser={setUser} />
      case "commandes":
        return <HistoriqueCommandes userId={user?._id} />
      default:
        return null
    }
  }

  if (!user) {
    return <Box sx={{ p: 4, textAlign: "center" }}>Chargement...</Box>
  }

  return (
    <Container maxWidth="lg" sx={{ 
      py: 4,
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh"
    }}>
      <main id="main-content" tabIndex="-1" style={{ outline: "none", flex: 1 }}>
        {/* Bouton Retour */}
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)} 
          sx={{ mb: 3 }}
        >
          Retour
        </Button>

        {/* Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link component={RouterLink} to="/" underline="hover" color="inherit">
            Accueil
          </Link>
          <Typography color="text.primary">Mon compte</Typography>
        </Breadcrumbs>

        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          mb: 4, 
          fontWeight: "bold", 
          textAlign: "center" 
        }}>
          MON COMPTE
        </Typography>

        {/* Conteneur principal centré */}
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          flex: 1
        }}>
          <Grid container spacing={3} sx={{ 
            maxWidth: "800px", // Limite la largeur pour un meilleur rendu
            justifyContent: "center"
          }}>
            {menuItems.map((item) => (
              <Grid item xs={12} sm={6} md={6} key={item.id}>
                <MenuCard
                  isActive={activeSection === item.id}
                  color={item.color}
                  onClick={() => setActiveSection(item.id)}
                >
                  <IconWrapper>{item.icon}</IconWrapper>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {item.title}
                  </Typography>
                </MenuCard>
              </Grid>
            ))}
          </Grid>

          <Paper sx={{ 
            mt: 4, 
            p: 3, 
            borderRadius: "12px",
            width: "100%",
            maxWidth: "800px" 
          }}>
            {activeSection ? (
              <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: "bold" }}>
                {menuItems.find((item) => item.id === activeSection)?.title}
              </Typography>
            ) : null}
            {renderContent()}
          </Paper>
          
          <Grid item xs={12} sx={{ width: "100%", maxWidth: "800px" }}>
            <MenuCard color="#ffdbdb" onClick={handleLogout} sx={{ mt: 2 }}>
              <IconWrapper>
                <LogoutIcon fontSize="large" />
              </IconWrapper>
              <Typography variant="subtitle1" fontWeight="bold">
                DÉCONNEXION
              </Typography>
            </MenuCard>
          </Grid>
        </Box>
      </main>
    </Container>
  )
}

export default MonCompte