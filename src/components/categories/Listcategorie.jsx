"use client"

import { useEffect, useState } from "react"
import Affichecategorie from "./Affichecategorie"
import { CircularProgress, Box, Typography, Paper, Button, styled } from "@mui/material"
import { Category, RefreshOutlined, Add, PrintOutlined } from "@mui/icons-material"
import { fetchcategories, deletecategorie } from "../../service/categorieservice"
import Insertcategorie from "./Insertcategorie"
import CategorieFilter from "./CategorieFilter"
import { Snackbar, Alert } from "@mui/material"
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from "@mui/material"
import { Close as CloseIcon, DeleteOutline, Warning as WarningIcon } from "@mui/icons-material"
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

  // États pour la confirmation de suppression
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categorieToDelete, setCategorieToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })

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

  // Ouvrir la boîte de dialogue de confirmation
  const handleDeleteCategorie = (categorie) => {
    setCategorieToDelete(categorie)
    setDeleteDialogOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    if (!isDeleting) {
      setDeleteDialogOpen(false)
      setCategorieToDelete(null)
    }
  }

  const handleDeleteCategorieConfirm = async () => {
    if (!categorieToDelete) return

    try {
      setIsDeleting(true)
      await deletecategorie(categorieToDelete._id)

      setCategories(categories.filter((categorie) => categorie._id !== categorieToDelete._id))
      setFilteredCategories(filteredCategories.filter((categorie) => categorie._id !== categorieToDelete._id))

      setSnackbar({
        open: true,
        message: `La catégorie "${categorieToDelete.nomcategorie}" a été supprimée avec succès`,
        severity: "success",
      })

      handleCloseDeleteDialog()
    } catch (error) {
      console.error("Erreur lors de la suppression de la catégorie:", error)
      setSnackbar({
        open: true,
        message: "Erreur lors de la suppression de la catégorie",
        severity: "error",
      })
    } finally {
      setIsDeleting(false)
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

      {/* Boîte de dialogue de confirmation de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
        disablePortal={false}
        keepMounted={false}
        disableEnforceFocus={false}
        disableAutoFocus={false}
        disableRestoreFocus={false}
        hideBackdrop={false}
        container={() => document.body}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            padding: "8px",
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
            disabled={isDeleting}
            aria-label="Fermer la boîte de dialogue"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {categorieToDelete && (
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
                  {categorieToDelete.nomcategorie}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Catégorie principale
                </Typography>
              </Box>
            </Box>
          )}

          <Typography variant="body1" sx={{ color: "text.secondary", mt: 2 }}>
            Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            disabled={isDeleting}
            sx={{ borderRadius: "8px" }}
            autoFocus={false}
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteCategorieConfirm}
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : <DeleteOutline />}
            sx={{ borderRadius: "8px" }}
            autoFocus={true}
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ borderRadius: "8px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Listcategorie
