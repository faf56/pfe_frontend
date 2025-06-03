"use client"

import { useEffect, useState } from "react"
import Affichescategorie from "./Affichescategorie"
import {
  CircularProgress,
  Box,
  Typography,
  Paper,
  Button,
  styled,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
} from "@mui/material"
import {
  Category,
  RefreshOutlined,
  Add,
  PrintOutlined,
  Close as CloseIcon,
  DeleteOutline,
  Warning as WarningIcon,
} from "@mui/icons-material"
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

  // États pour la confirmation de suppression
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [scategorieToDelete, setScategorieToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

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

    setSnackbar({
      open: true,
      message: "Sous-catégorie ajoutée avec succès",
      severity: "success",
    })
  }

  // Ouvrir la boîte de dialogue de confirmation
  const handleDeleteScategorie = (scategorie) => {
    setScategorieToDelete(scategorie)
    setDeleteDialogOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    if (!isDeleting) {
      setDeleteDialogOpen(false)
      setScategorieToDelete(null)
    }
  }

  const handleDeleteScategorieConfirm = async () => {
    if (!scategorieToDelete) return

    try {
      setIsDeleting(true)
      await deletescategorie(scategorieToDelete._id)

      setScategories(scategories.filter((scategorie) => scategorie._id !== scategorieToDelete._id))
      setFilteredScategories(filteredScategories.filter((scategorie) => scategorie._id !== scategorieToDelete._id))

      setSnackbar({
        open: true,
        message: `La sous-catégorie "${scategorieToDelete.nomscategorie}" a été supprimée avec succès`,
        severity: "success",
      })

      handleCloseDeleteDialog()
    } catch (error) {
      console.error("Erreur lors de la suppression de la sous-catégorie:", error)
      setSnackbar({
        open: true,
        message: "Erreur lors de la suppression de la sous-catégorie",
        severity: "error",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdateScategorie = (scateg) => {
    setScategories(scategories.map((scategorie) => (scategorie._id === scateg._id ? scateg : scategorie)))
    setFilteredScategories(
      filteredScategories.map((scategorie) => (scategorie._id === scateg._id ? scateg : scategorie)),
    )

    setSnackbar({
      open: true,
      message: `La sous-catégorie "${scateg.nomscategorie}" a été mise à jour avec succès`,
      severity: "success",
    })
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

  // Fermer le snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setSnackbar({ ...snackbar, open: false })
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

      {/* Boîte de dialogue de confirmation de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
        disablePortal={true}
        disableEnforceFocus={true}
        disableAutoFocus={true}
        disableRestoreFocus={true}
        hideBackdrop={false}
        keepMounted={false}
        container={null}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            padding: "8px",
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "#ffebee",
            borderRadius: "8px",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <WarningIcon color="error" />
            <Typography variant="h6">Confirmer la suppression</Typography>
          </Box>
          <IconButton
            onClick={handleCloseDeleteDialog}
            size="small"
            aria-label="Fermer"
            disabled={isDeleting}
            tabIndex={isDeleting ? -1 : 0}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {scategorieToDelete && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "8px",
                  backgroundColor: "rgba(25, 118, 210, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Category sx={{ color: "#1976d2", fontSize: 30 }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {scategorieToDelete.nomscategorie}
                </Typography>
                {scategorieToDelete.categorieID?.nomcategorie && (
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={`Catégorie: ${scategorieToDelete.categorieID.nomcategorie}`}
                      size="small"
                      sx={{ borderRadius: "6px" }}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          )}

          <Typography variant="body1" sx={{ color: "text.secondary", mt: 2 }}>
            Êtes-vous sûr de vouloir supprimer cette sous-catégorie ? Cette action est irréversible.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            disabled={isDeleting}
            sx={{ borderRadius: "8px" }}
            tabIndex={isDeleting ? -1 : 0}
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteScategorieConfirm}
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : <DeleteOutline />}
            sx={{ borderRadius: "8px" }}
            tabIndex={isDeleting ? -1 : 0}
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Insertscategorie show={show} handleClose={handleClose} handleAddscategorie={handleAddscategorie} />
    </Box>
  )
}

export default Listscategorie
