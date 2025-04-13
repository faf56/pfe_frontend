"use client"

import { useEffect, useState } from "react"
import Affichecategorie from "./Affichecategorie"
import { CircularProgress, Box, Typography, Paper, Button, styled } from "@mui/material"
import { Category, RefreshOutlined, Add, PrintOutlined } from "@mui/icons-material"
import { fetchcategories, deletecategorie } from "../../service/categorieservice"
import Insertcategorie from "./Insertcategorie"
import CategorieFilter from "./CategorieFilter"

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

const Listcategorie = () => {
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(true)
  const [show, setShow] = useState(false)
  const [filteredCategories, setFilteredCategories] = useState([])

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const getcategories = async () => {
    try {
      setIsPending(true)
      const res = await fetchcategories()
      setCategories(res.data)
      setFilteredCategories(res.data)
    } catch (error) {
      console.log(error)
      setError(error)
    } finally {
      setIsPending(false)
    }
  }

  useEffect(() => {
    getcategories()
  }, [])

  const handleAddcategorie = (newcategorie) => {
    setCategories([newcategorie, ...categories])
    setFilteredCategories([newcategorie, ...filteredCategories])
  }

  const handleDeleteCategorie = async (categorieId) => {
    try {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
        await deletecategorie(categorieId)
        setCategories(categories.filter((categorie) => categorie._id !== categorieId))
        setFilteredCategories(filteredCategories.filter((categorie) => categorie._id !== categorieId))
      }
    } catch (error) {
      console.log(error)
      alert("Erreur lors de la suppression de la catégorie")
    }
  }

  const handleUpdateCategorie = (categ) => {
    setCategories(categories.map((categorie) => (categorie._id === categ._id ? categ : categorie)))
    setFilteredCategories(filteredCategories.map((categorie) => (categorie._id === categ._id ? categ : categorie)))
  }

  const handleFilterChange = (filters) => {
    let result = [...categories]

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter((categorie) => categorie.nomcategorie?.toLowerCase().includes(searchLower))
    }

    setFilteredCategories(result)
  }

  return (
    <Box sx={{ padding: "24px" }}>
      <PageHeader>
        <HeaderTitle>
          <Category sx={{ fontSize: 32, color: "#1976d2" }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, color: "#333" }}>
              Gestion des catégories
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gérez les catégories de votre catalogue
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
            Ajouter une catégorie
          </ActionButton>

          <ActionButton startIcon={<RefreshOutlined />} onClick={getcategories}>
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
        <CategorieFilter onFilterChange={handleFilterChange} />
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
          <Typography variant="h6">Erreur lors du chargement des catégories</Typography>
          <Typography variant="body2">
            {error.message || "Une erreur s'est produite. Veuillez réessayer plus tard."}
          </Typography>
        </Paper>
      ) : (
        <Affichecategorie
          categories={filteredCategories}
          handleDeleteCategorie={handleDeleteCategorie}
          handleUpdateCategorie={handleUpdateCategorie}
        />
      )}

      <Insertcategorie show={show} handleClose={handleClose} handleAddcategorie={handleAddcategorie} />
    </Box>
  )
}

export default Listcategorie
