"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material"
import { updateUser } from "../../service/userservice"

const AdressesClient = ({ user, setUser }) => {
  const [addresses, setAddresses] = useState(user?.addresses || [])
  const [openDialog, setOpenDialog] = useState(false)
  const [currentAddress, setCurrentAddress] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    adresse: "",
    ville: "",
    codepostal: "",
    pays: "Tunisie",
  })

  useEffect(() => {
    if (user?.addresses) {
      setAddresses(user.addresses)
    }
  }, [user])

  const handleOpenDialog = (address = null) => {
    if (address) {
      setCurrentAddress(address)
      setFormData({
        adresse: address.adresse || "",
        ville: address.ville || "",
        codepostal: address.codepostal || "",
        pays: address.pays || "Tunisie",
      })
    } else {
      setCurrentAddress(null)
      setFormData({
        adresse: "",
        ville: "",
        codepostal: "",
        pays: "Tunisie",
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setError("")
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    if (!formData.adresse.trim()) {
      setError("L'adresse est requise")
      return false
    }
    if (!formData.ville.trim()) {
      setError("La ville est requise")
      return false
    }
    if (!formData.codepostal.trim()) {
      setError("Le code postal est requis")
      return false
    }
    // Vérifier le format du code postal (4 chiffres pour la Tunisie)
    if (!/^\d{4}$/.test(formData.codepostal)) {
      setError("Le code postal doit contenir 4 chiffres")
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    setError("")

    try {
      let updatedAddresses

      if (currentAddress) {
        // Mise à jour d'une adresse existante
        updatedAddresses = addresses.map((addr) => (addr === currentAddress ? formData : addr))
      } else {
        // Ajout d'une nouvelle adresse
        updatedAddresses = [...addresses, formData]
      }

      // Mettre à jour l'utilisateur avec les nouvelles adresses
      const updatedUser = { ...user, addresses: updatedAddresses }
      const response = await updateUser(updatedUser)

      // Mettre à jour les données utilisateur dans le localStorage
      localStorage.setItem("user", JSON.stringify(response.data.user))
      setUser(response.data.user)
      setAddresses(updatedAddresses)

      setSuccess(currentAddress ? "Adresse mise à jour avec succès" : "Adresse ajoutée avec succès")
      handleCloseDialog()

      // Réinitialiser le message de succès après 3 secondes
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    } catch (error) {
      console.error("Erreur lors de la mise à jour des adresses:", error)
      setError(error.response?.data?.message || "Erreur lors de la mise à jour des adresses")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAddress = async (addressToDelete) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette adresse ?")) {
      return
    }

    setLoading(true)
    setError("")

    try {
      // Filtrer l'adresse à supprimer
      const updatedAddresses = addresses.filter((addr) => addr !== addressToDelete)

      // Mettre à jour l'utilisateur avec les nouvelles adresses
      const updatedUser = { ...user, addresses: updatedAddresses }
      const response = await updateUser(updatedUser)

      // Mettre à jour les données utilisateur dans le localStorage
      localStorage.setItem("user", JSON.stringify(response.data.user))
      setUser(response.data.user)
      setAddresses(updatedAddresses)

      setSuccess("Adresse supprimée avec succès")

      // Réinitialiser le message de succès après 3 secondes
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    } catch (error) {
      console.error("Erreur lors de la suppression de l'adresse:", error)
      setError(error.response?.data?.message || "Erreur lors de la suppression de l'adresse")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6">Mes adresses de livraison</Typography>

        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Ajouter une adresse
        </Button>
      </Box>

      {addresses.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center", bgcolor: "#f9f9f9" }}>
          <LocationIcon sx={{ fontSize: 60, color: "#bdbdbd", mb: 2 }} />
          <Typography variant="body1" gutterBottom>
            Vous n'avez pas encore ajouté d'adresse de livraison.
          </Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} sx={{ mt: 2 }}>
            Ajouter votre première adresse
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {addresses.map((address, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                sx={{
                  p: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  "&:hover .address-actions": {
                    opacity: 1,
                  },
                }}
              >
                <Box
                  className="address-actions"
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    opacity: 0,
                    transition: "opacity 0.2s",
                    display: "flex",
                    gap: 1,
                  }}
                >
                  <IconButton size="small" color="primary" onClick={() => handleOpenDialog(address)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDeleteAddress(address)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <HomeIcon sx={{ mr: 1, color: "#1976d2" }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Adresse {index + 1}
                  </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Typography variant="body1" gutterBottom>
                  {address.adresse}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {address.codepostal} {address.ville}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {address.pays}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog pour ajouter/modifier une adresse */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        aria-labelledby="address-dialog-title"
        disableRestoreFocus
      >
        <DialogTitle
          id="address-dialog-title"
          sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          {currentAddress ? "Modifier l'adresse" : "Ajouter une adresse"}
          <IconButton aria-label="close" onClick={handleCloseDialog} sx={{ color: "grey.500" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adresse"
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Ville" name="ville" value={formData.ville} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Code postal"
                name="codepostal"
                value={formData.codepostal}
                onChange={handleChange}
                required
                placeholder="4 chiffres"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Pays" name="pays" value={formData.pays} onChange={handleChange} disabled />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdressesClient
