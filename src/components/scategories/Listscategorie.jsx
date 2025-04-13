"use client"

import { useEffect, useState } from "react"
import Affichescategorie from "./Affichescategorie"
import { CircularProgress, Box, Typography, Paper, Button, styled } from "@mui/material"
import { Category, RefreshOutlined, Add, PrintOutlined } from "@mui/icons-material"
import { fetchscategories, deletescategorie } from "../../service/scategorieservice"
import Insertscategorie from "./Insertscategorie"
import ScategorieFilter from "./ScategorieFilter"

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

const Listscategorie = () => {
  const [scategories, setScategories] = useState([])
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(true)
  const [show, setShow] = useState(false)
  const [filteredScategories, setFilteredScategories] = useState([])

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const getscategories = async () => {
    try {
      setIsPending(true)
      const res = await fetchscategories()
      setScategories(res.data)
      setFilteredScategories(res.data)
    } catch (error) {
      console.log(error)
      setError(error)
    } finally {
      setIsPending(false)
    }
  }

  useEffect(() => {
    getscategories()
  }, [])

  const handleAddscategorie = (newscategorie) => {
    setScategories([newscategorie, ...scategories])
    setFilteredScategories([newscategorie, ...filteredScategories])
  }

  const handleDeleteScategorie = async (scategorieId) => {
    try {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer cette sous-catégorie ?")) {
        await deletescategorie(scategorieId)
        setScategories(scategories.filter((scategorie) => scategorie._id !== scategorieId))
        setFilteredScategories(filteredScategories.filter((scategorie) => scategorie._id !== scategorieId))
      }
    } catch (error) {
      console.log(error)
      alert("Erreur lors de la suppression de la sous-catégorie")
    }
  }

  const handleUpdateScategorie = (scateg) => {
    setScategories(scategories.map((scategorie) => (scategorie._id === scateg._id ? scateg : scategorie)))
    setFilteredScategories(
      filteredScategories.map((scategorie) => (scategorie._id === scateg._id ? scateg : scategorie)),
    )
  }

  const handleFilterChange = (filters) => {
    let result = [...scategories]

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter((scategorie) => scategorie.nomscategorie?.toLowerCase().includes(searchLower))
    }

    // Filter by category
    if (filters.category !== "all") {
      result = result.filter((scategorie) => scategorie.categorieID?._id === filters.category)
    }

    setFilteredScategories(result)
  }

  return (
    <Box sx={{ padding: "24px" }}>
      <PageHeader>
        <HeaderTitle>
          <Category sx={{ fontSize: 32, color: "#1976d2" }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, color: "#333" }}>
              Gestion des sous-catégories
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gérez les sous-catégories de votre catalogue
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
            Ajouter une sous-catégorie
          </ActionButton>

          <ActionButton startIcon={<RefreshOutlined />} onClick={getscategories}>
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

      <Box sx={{ my: 3 }}>
        <ScategorieFilter onFilterChange={handleFilterChange} />
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
          <Typography variant="h6">Erreur lors du chargement des sous-catégories</Typography>
          <Typography variant="body2">
            {error.message || "Une erreur s'est produite. Veuillez réessayer plus tard."}
          </Typography>
        </Paper>
      ) : (
        <Affichescategorie
          scategories={filteredScategories}
          handleDeleteScategorie={handleDeleteScategorie}
          handleUpdateScategorie={handleUpdateScategorie}
        />
      )}

      <Insertscategorie show={show} handleClose={handleClose} handleAddscategorie={handleAddscategorie} />
    </Box>
  )
}

export default Listscategorie
