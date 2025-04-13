"use client"

import { useEffect, useState } from "react"
import AfficheLivraison from "./AfficheLivraison"
import LivraisonFilter from "./LivraisonFilter"
import { CircularProgress, Box, Typography, Paper, Button, styled } from "@mui/material"
import { LocalShipping, RefreshOutlined, Add, PrintOutlined, AttachMoney } from "@mui/icons-material"
import { fetchLivraisons, deleteLivraison } from "../../service/livraisonservice"
import InsertLivraison from "./InsertLivraison"

// Styled components
const PageHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
}))

const HeaderTitle = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "16px",
}))

const StatsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: "16px",
  marginBottom: "24px",
}))

const StatCard = styled(Paper)(({ theme }) => ({
  flex: 1,
  padding: "20px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  gap: "16px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
}))

const StatIcon = styled(Box)(({ theme, color }) => ({
  width: "48px",
  height: "48px",
  borderRadius: "12px",
  backgroundColor: color,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
}))

const ActionButton = styled(Button)(({ theme, color = "#1976d2", bgcolor = "rgba(25, 118, 210, 0.1)" }) => ({
  borderRadius: "8px",
  textTransform: "none",
  backgroundColor: bgcolor,
  color: color,
  fontWeight: 500,
  padding: "8px 16px",
  "&:hover": {
    backgroundColor: bgcolor === "rgba(25, 118, 210, 0.1)" ? "rgba(25, 118, 210, 0.2)" : bgcolor,
  },
}))

const ListLivraison = () => {
  const [livraisons, setLivraisons] = useState([])
  const [filteredLivraisons, setFilteredLivraisons] = useState([])
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(true)
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const getLivraisons = async () => {
    try {
      setIsPending(true)
      const res = await fetchLivraisons()
      setLivraisons(res.data)
      setFilteredLivraisons(res.data)
    } catch (error) {
      console.log(error)
      setError(error)
    } finally {
      setIsPending(false)
    }
  }

  useEffect(() => {
    getLivraisons()
  }, [])

  const handleAddLivraison = (newLivraison) => {
    setLivraisons([newLivraison, ...livraisons])
    setFilteredLivraisons([newLivraison, ...filteredLivraisons])
  }

  const handleDeleteLivraison = async (livraisonId) => {
    try {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer cette méthode de livraison ?")) {
        await deleteLivraison(livraisonId)
        setLivraisons(livraisons.filter((livraison) => livraison._id !== livraisonId))
        setFilteredLivraisons(filteredLivraisons.filter((livraison) => livraison._id !== livraisonId))
      }
    } catch (error) {
      console.log(error)
      alert("Erreur lors de la suppression de la méthode de livraison")
    }
  }

  const handleUpdateLivraison = (updatedLivraison) => {
    setLivraisons(
      livraisons.map((livraison) => (livraison._id === updatedLivraison._id ? updatedLivraison : livraison)),
    )
    setFilteredLivraisons(
      filteredLivraisons.map((livraison) => (livraison._id === updatedLivraison._id ? updatedLivraison : livraison)),
    )
  }

  const handleFilterChange = (filters) => {
    let result = [...livraisons]

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (livraison) =>
          livraison.titre?.toLowerCase().includes(searchLower) ||
          (livraison.telephone && livraison.telephone.toString().includes(searchLower)),
      )
    }

    // Filter by price range
    if (filters.price) {
      result = result.filter((livraison) => livraison.frais >= filters.price[0] && livraison.frais <= filters.price[1])
    }

    setFilteredLivraisons(result)
  }

  // Fonction pour formater le prix
  const formatPrice = (price) => {
    return Number(price).toFixed(3)
  }

  // Calculer le total des frais de livraison
  const totalFrais = livraisons.reduce((acc, livraison) => acc + (livraison.frais || 0), 0)
  // Calculer la moyenne des frais de livraison
  const avgFrais = livraisons.length > 0 ? totalFrais / livraisons.length : 0

  return (
    <Box sx={{ padding: "24px" }}>
      <PageHeader>
        <HeaderTitle>
          <LocalShipping sx={{ fontSize: 32, color: "#1976d2" }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, color: "#333" }}>
              Gestion des méthodes de livraison
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gérez les méthodes de livraison et leurs frais
            </Typography>
          </Box>
        </HeaderTitle>

        <Box sx={{ display: "flex", gap: 2 }}>
          <ActionButton
            startIcon={<Add />}
            onClick={handleShow}
            variant="contained"
            color="white"
            bgcolor="#1976d2"
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
          >
            Ajouter une méthode
          </ActionButton>

          <ActionButton startIcon={<RefreshOutlined />} onClick={getLivraisons}>
            Actualiser
          </ActionButton>

          <ActionButton
            startIcon={<PrintOutlined />}
            onClick={() => window.print()}
            color="#00796b"
            bgcolor="rgba(0, 121, 107, 0.1)"
          >
            Imprimer
          </ActionButton>
        </Box>
      </PageHeader>

      <StatsContainer>
        <StatCard>
          <StatIcon color="#1976d2">
            <LocalShipping />
          </StatIcon>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total Méthodes
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {livraisons.length}
            </Typography>
          </Box>
        </StatCard>

        <StatCard>
          <StatIcon color="#4caf50">
            <AttachMoney />
          </StatIcon>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Frais Moyen
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {formatPrice(avgFrais)} TND
            </Typography>
          </Box>
        </StatCard>

        <StatCard>
          <StatIcon color="#ff9800">
            <AttachMoney />
          </StatIcon>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total Frais
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {formatPrice(totalFrais)} TND
            </Typography>
          </Box>
        </StatCard>
      </StatsContainer>

      <Box sx={{ my: 3 }}>
        <LivraisonFilter onFilterChange={handleFilterChange} livraisons={livraisons} />
      </Box>

      {isPending ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
          <CircularProgress color="primary" size={60} />
        </Box>
      ) : error ? (
        <Paper
          sx={{
            p: 3,
            borderRadius: "12px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            border: "1px solid #ffcdd2",
          }}
        >
          <Typography variant="h6">Erreur lors du chargement des méthodes de livraison</Typography>
          <Typography variant="body2">
            {error.message || "Une erreur s'est produite. Veuillez réessayer plus tard."}
          </Typography>
        </Paper>
      ) : (
        <AfficheLivraison
          livraisons={filteredLivraisons}
          handleDeleteLivraison={handleDeleteLivraison}
          handleUpdateLivraison={handleUpdateLivraison}
        />
      )}

      <InsertLivraison show={show} handleClose={handleClose} handleAddLivraison={handleAddLivraison} />
    </Box>
  )
}

export default ListLivraison
