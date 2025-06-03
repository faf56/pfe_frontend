"use client"

import { useEffect, useState } from "react"
import Affichemarque from "./Affichemarque"
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
  Avatar,
} from "@mui/material"
import {
  Sell,
  RefreshOutlined,
  Add,
  PrintOutlined,
  Close as CloseIcon,
  DeleteOutline,
  Warning as WarningIcon,
} from "@mui/icons-material"
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

const BrandImage = styled("img")(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: "8px",
  objectFit: "cover",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
}))

const Listmarque = () => {
  const [marques, setMarques] = useState([])
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(true)
  const [show, setShow] = useState(false)
  const [filteredMarques, setFilteredMarques] = useState([])

  // États pour la confirmation de suppression
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [marqueToDelete, setMarqueToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

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

    setSnackbar({
      open: true,
      message: "Marque ajoutée avec succès",
      severity: "success",
    })
  }

  // Ouvrir la boîte de dialogue de confirmation
  const handleDeleteMarque = (marque) => {
    setMarqueToDelete(marque)
    setDeleteDialogOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    if (!isDeleting) {
      setDeleteDialogOpen(false)
      setMarqueToDelete(null)
    }
  }

  const handleDeleteMarqueConfirm = async () => {
    if (!marqueToDelete) return

    try {
      setIsDeleting(true)
      await deletemarque(marqueToDelete._id)

      setMarques(marques.filter((marque) => marque._id !== marqueToDelete._id))
      setFilteredMarques(filteredMarques.filter((marque) => marque._id !== marqueToDelete._id))

      setSnackbar({
        open: true,
        message: `La marque "${marqueToDelete.nommarque}" a été supprimée avec succès`,
        severity: "success",
      })

      handleCloseDeleteDialog()
    } catch (error) {
      console.error("Erreur lors de la suppression de la marque:", error)
      setSnackbar({
        open: true,
        message: "Erreur lors de la suppression de la marque",
        severity: "error",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdateMarque = (marq) => {
    setMarques(marques.map((marque) => (marque._id === marq._id ? marq : marque)))
    setFilteredMarques(filteredMarques.map((marque) => (marque._id === marq._id ? marq : marque)))

    setSnackbar({
      open: true,
      message: `La marque "${marq.nommarque}" a été mise à jour avec succès`,
      severity: "success",
    })
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
          {marqueToDelete && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              {marqueToDelete.imagemarque ? (
                <BrandImage
                  src={marqueToDelete.imagemarque}
                  alt={marqueToDelete.nommarque}
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=60&width=60"
                  }}
                />
              ) : (
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: "rgba(25, 118, 210, 0.08)",
                    color: "#1976d2",
                  }}
                >
                  <Sell />
                </Avatar>
              )}
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {marqueToDelete.nommarque}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Marque
                </Typography>
              </Box>
            </Box>
          )}

          <Typography variant="body1" sx={{ color: "text.secondary", mt: 2 }}>
            Êtes-vous sûr de vouloir supprimer cette marque ? Cette action est irréversible.
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
            onClick={handleDeleteMarqueConfirm}
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

      <Insertmarque show={show} handleClose={handleClose} handleAddmarque={handleAddmarque} />
    </Box>
  )
}

export default Listmarque
