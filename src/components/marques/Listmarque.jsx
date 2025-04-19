import { useEffect, useState } from "react"
import Affichemarque from "./Affichemarque"
import { CircularProgress, Box, Typography, Paper, Button, styled } from "@mui/material"
import { Sell, RefreshOutlined, Add, PrintOutlined } from "@mui/icons-material"
import { fetchmarques, deletemarque } from "../../service/marqueservice"
import Insertmarque from "./Insertmarque"
import MarqueFilter from "./MarqueFilter"

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

const Listmarque = () => {
  const [marques, setMarques] = useState([])
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(true)
  const [show, setShow] = useState(false)
  const [filteredMarques, setFilteredMarques] = useState([])

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const getmarques = async () => {
    try {
      setIsPending(true)
      const res = await fetchmarques()
      setMarques(res.data)
      setFilteredMarques(res.data)
    } catch (error) {
      console.log(error)
      setError(error)
    } finally {
      setIsPending(false)
    }
  }

  useEffect(() => {
    getmarques()
  }, [])

  const handleAddmarque = (newmarque) => {
    setMarques([newmarque, ...marques])
    setFilteredMarques([newmarque, ...filteredMarques])
  }

  const handleDeleteMarque = async (marqueId) => {
    try {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer cette marque ?")) {
        await deletemarque(marqueId)
        setMarques(marques.filter((marque) => marque._id !== marqueId))
        setFilteredMarques(filteredMarques.filter((marque) => marque._id !== marqueId))
      }
    } catch (error) {
      console.log(error)
      alert("Erreur lors de la suppression de la marque")
    }
  }

  const handleUpdateMarque = (marq) => {
    setMarques(marques.map((marque) => (marque._id === marq._id ? marq : marque)))
    setFilteredMarques(filteredMarques.map((marque) => (marque._id === marq._id ? marq : marque)))
  }

  const handleFilterChange = (filters) => {
    let result = [...marques]

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter((marque) => marque.nommarque?.toLowerCase().includes(searchLower))
    }

    setFilteredMarques(result)
  }

  return (
    <Box sx={{ padding: "24px" }}>
      <PageHeader>
        <HeaderTitle>
          <Sell sx={{ fontSize: 32, color: "#1976d2" }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, color: "#333" }}>
              Gestion des marques
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gérez les marques de votre catalogue
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
            Ajouter une marque
          </ActionButton>

          <ActionButton startIcon={<RefreshOutlined />} onClick={getmarques}>
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
          <Typography variant="h6">Erreur lors du chargement des marques</Typography>
          <Typography variant="body2">
            {error.message || "Une erreur s'est produite. Veuillez réessayer plus tard."}
          </Typography>
        </Paper>
      ) : (
        <>
          <Box sx={{ my: 3 }}>
            <MarqueFilter onFilterChange={handleFilterChange} />
          </Box>
          <Affichemarque
            marques={filteredMarques}
            handleDeleteMarque={handleDeleteMarque}
            handleUpdateMarque={handleUpdateMarque}
          />
        </>
      )}

      <Insertmarque show={show} handleClose={handleClose} handleAddmarque={handleAddmarque} />
    </Box>
  )
}

export default Listmarque