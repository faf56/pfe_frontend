"use client"

import { useEffect, useState } from "react"
import Afficheproduit from "./Afficheproduit"
import ProduitFilter from "./ProduitFilter"
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
  PrintOutlined,
  Inventory2Outlined,
  RefreshOutlined,
  Add,
  Close as CloseIcon,
  DeleteOutline,
  Warning as WarningIcon,
} from "@mui/icons-material"
import { fetchproduits, deleteproduit } from "../../service/produitservice"
import Insertproduit from "./Insertproduit"

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

const Listproduit = () => {
  const [produits, setProduits] = useState([])
  const [filteredProduits, setFilteredProduits] = useState([])
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(true)
  const [show, setShow] = useState(false)

  // États pour la confirmation de suppression
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const getproduits = async () => {
    try {
      setIsPending(true)
      const res = await fetchproduits()
      setProduits(res.data)
      setFilteredProduits(res.data)
    } catch (error) {
      console.log(error)
      setError(error)
    } finally {
      setIsPending(false)
    }
  }

  useEffect(() => {
    getproduits()
  }, [])

  const handleAddproduct = (newproduit) => {
    setProduits([newproduit, ...produits])
    setFilteredProduits([newproduit, ...filteredProduits])

    // Afficher un message de succès
    setSnackbar({
      open: true,
      message: "Produit ajouté avec succès",
      severity: "success",
    })
  }

  // Ouvrir la boîte de dialogue de confirmation
  const handleDeleteConfirmation = (productId) => {
    const product = produits.find((p) => p._id === productId)
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setProductToDelete(null)
  }

  const handleDeleteProduct = async () => {
    if (!productToDelete) return

    try {
      setIsDeleting(true)
      await deleteproduit(productToDelete._id)

      setProduits(produits.filter((product) => product._id !== productToDelete._id))
      setFilteredProduits(filteredProduits.filter((product) => product._id !== productToDelete._id))

      setSnackbar({
        open: true,
        message: `Le produit "${productToDelete.title}" a été supprimé avec succès`,
        severity: "success",
      })

      handleCloseDeleteDialog()
    } catch (error) {
      console.error("Erreur lors de la suppression du produit:", error)
      setSnackbar({
        open: true,
        message: "Erreur lors de la suppression du produit",
        severity: "error",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdateProduct = (prmod) => {
    setProduits(produits.map((product) => (product._id === prmod._id ? prmod : product)))
    setFilteredProduits(filteredProduits.map((product) => (product._id === prmod._id ? prmod : product)))

    // Afficher un message de succès
    setSnackbar({
      open: true,
      message: `Le produit "${prmod.title}" a été mis à jour avec succès`,
      severity: "success",
    })
  }

  const handleFilterChange = (filters) => {
    let result = [...produits]

    // Filter by stock status
    if (filters.stock !== "all") {
      if (filters.stock === "inStock") {
        result = result.filter((product) => product.stock > 10)
      } else if (filters.stock === "lowStock") {
        result = result.filter((product) => product.stock <= 10 && product.stock > 0)
      }
    }

    // Filter by category
    if (filters.category !== "all") {
      result = result.filter((product) => product.scategorieID?._id === filters.category)
    }

    // Filter by marque
    if (filters.marque !== "all") {
      result = result.filter((product) => product.marqueID?._id === filters.marque)
    }

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (product) =>
          product.title?.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower),
      )
    }

    // Filter by price range
    if (filters.price) {
      result = result.filter((product) => product.prix >= filters.price[0] && product.prix <= filters.price[1])
    }

    // Filter by stock range
    if (filters.stockRange) {
      result = result.filter(
        (product) => product.stock >= filters.stockRange[0] && product.stock <= filters.stockRange[1],
      )
    }

    // Filter by promotion
    if (filters.promoOnly) {
      result = result.filter(
        (product) => product.prixPromo && product.prixPromo > 0 && product.prixPromo < product.prix,
      )
    }

    setFilteredProduits(result)
  }

  // Fermer le snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setSnackbar({ ...snackbar, open: false })
  }

  // Calculate statistics
  const totalProducts = produits.length

  return (
    <Box sx={{ padding: "24px" }}>
      <PageHeader>
        <HeaderTitle>
          <Inventory2Outlined sx={{ fontSize: 32, color: "#1976d2" }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, color: "#333" }}>
              Gestion des produits
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gérez votre catalogue de produits, stocks et prix
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
            Ajouter un produit
          </ActionButton>

          <ActionButton startIcon={<RefreshOutlined />} onClick={getproduits}>
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
            <Inventory2Outlined />
          </StatIcon>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total Produits
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {totalProducts}
            </Typography>
          </Box>
        </StatCard>
      </StatsContainer>

      <Box sx={{ my: 3 }}>
        <ProduitFilter onFilterChange={handleFilterChange} produits={produits} showPromoFilter={true} />
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
          <Typography variant="h6">Erreur lors du chargement des produits</Typography>
          <Typography variant="body2">
            {error.message || "Une erreur s'est produite. Veuillez réessayer plus tard."}
          </Typography>
        </Paper>
      ) : (
        <Afficheproduit
          produits={filteredProduits}
          handleDeleteProduct={handleDeleteConfirmation}
          handleUpdateProduct={handleUpdateProduct}
        />
      )}

      {/* Boîte de dialogue de confirmation de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
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
          <IconButton onClick={handleCloseDeleteDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {productToDelete && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Avatar
                src={productToDelete.imagepro}
                alt={productToDelete.title}
                variant="rounded"
                sx={{ width: 60, height: 60, borderRadius: "8px" }}
              />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {productToDelete.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {productToDelete.description}
                </Typography>
                <Typography variant="body2" color="primary" fontWeight="medium" sx={{ mt: 0.5 }}>
                  Prix: {productToDelete.prix?.toFixed(3)} DT
                </Typography>
              </Box>
            </Box>
          )}

          <Typography variant="body1" sx={{ color: "text.secondary", mt: 2 }}>
            Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleCloseDeleteDialog} disabled={isDeleting} sx={{ borderRadius: "8px" }}>
            Annuler
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteProduct}
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : <DeleteOutline />}
            sx={{ borderRadius: "8px" }}
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

      <Insertproduit show={show} handleClose={handleClose} handleAddproduct={handleAddproduct} />
    </Box>
  )
}

export default Listproduit
