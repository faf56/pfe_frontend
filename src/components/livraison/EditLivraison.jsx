"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  styled,
  Alert,
  InputAdornment,
} from "@mui/material"
import { Close, Edit as EditIcon } from "@mui/icons-material"
import { editLivraison } from "../../service/livraisonservice"

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "12px",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
    overflow: "hidden",
  },
}))

const DialogHeader = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 24px",
  backgroundColor: "#f8f9fa",
  borderBottom: "1px solid #e0e0e0",
}))

const FormField = styled(TextField)(({ theme }) => ({
  marginBottom: "16px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
  },
}))

const SubmitButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  padding: "10px 24px",
  textTransform: "none",
  fontWeight: 600,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
}))

const EditLivraison = ({ show, handleClose, livraison, handleUpdateLivraison }) => {
  const [formData, setFormData] = useState({
    _id: "",
    titre: "",
    telephone: "",
    frais: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    if (livraison) {
      setFormData({
        _id: livraison._id || "",
        titre: livraison.titre || "",
        telephone: livraison.telephone || "",
        frais: livraison.frais || 0,
      })
    }
  }, [livraison])

  const validateForm = () => {
    const errors = {}

    if (!formData.titre.trim()) errors.titre = "Le titre est requis"
    if (formData.frais < 0) errors.frais = "Les frais ne peuvent pas être négatifs"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null })
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setError(null)

    try {
      const response = await editLivraison(formData)
      handleUpdateLivraison(response.data)
      handleClose()
    } catch (err) {
      console.error("Erreur lors de la modification de la méthode de livraison:", err)
      setError(
        err.response?.data?.message || "Une erreur est survenue lors de la modification de la méthode de livraison",
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCloseWithFocus = () => {
    // Créer un élément temporaire pour capturer le focus
    const tempButton = document.createElement("button")
    tempButton.style.position = "fixed"
    tempButton.style.opacity = "0"
    tempButton.style.pointerEvents = "none"
    document.body.appendChild(tempButton)

    // Focus sur cet élément temporaire
    tempButton.focus()

    // Fermer le dialogue
    handleClose()

    // Supprimer l'élément temporaire après un court délai
    setTimeout(() => {
      document.body.removeChild(tempButton)
    }, 100)
  }

  return (
    <StyledDialog
      open={show}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          // Ne fermez pas si c'est un clic sur l'arrière-plan ou la touche Escape
          if (!loading) handleClose()
        }
      }}
      fullWidth
      maxWidth="sm"
      container={() => document.body}
      disablePortal={false}
      keepMounted={false}
      disableEnforceFocus={false}
      disableAutoFocus={false}
      disableRestoreFocus={true}
      hideBackdrop={false}
    >
      <DialogHeader>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EditIcon sx={{ color: "#1976d2" }} />
          <Typography variant="h6">Modifier la méthode de livraison</Typography>
        </Box>
        <IconButton edge="end" color="inherit" onClick={handleCloseWithFocus} disabled={loading} aria-label="close">
          <Close />
        </IconButton>
      </DialogHeader>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 3, overflowY: "auto", maxHeight: "calc(100vh - 170px)" }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: "8px" }}>
              {error}
            </Alert>
          )}

          <FormField
            fullWidth
            label="Titre"
            name="titre"
            value={formData.titre}
            onChange={handleChange}
            error={!!formErrors.titre}
            helperText={formErrors.titre}
            disabled={loading}
            required
            placeholder="Entrez le titre de la méthode de livraison"
            sx={{ mb: 3 }}
          />

          <FormField
            fullWidth
            label="Téléphone"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            error={!!formErrors.telephone}
            helperText={formErrors.telephone}
            disabled={loading}
            placeholder="Entrez le numéro de téléphone (optionnel)"
            sx={{ mb: 3 }}
          />

          <FormField
            fullWidth
            label="Frais de livraison"
            name="frais"
            type="number"
            value={formData.frais}
            onChange={handleChange}
            error={!!formErrors.frais}
            helperText={formErrors.frais}
            disabled={loading}
            required
            InputProps={{
              endAdornment: <InputAdornment position="end">TND</InputAdornment>,
            }}
            sx={{ mb: 3 }}
          />
        </DialogContent>

        <DialogActions
          sx={{ p: 2, backgroundColor: "#f8f9fa", borderTop: "1px solid #e0e0e0", position: "sticky", bottom: 0 }}
        >
          <Button
            onClick={handleCloseWithFocus}
            disabled={loading}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
            }}
          >
            Annuler
          </Button>
          <SubmitButton
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Enregistrement..." : "Enregistrer les modifications"}
          </SubmitButton>
        </DialogActions>
      </form>
    </StyledDialog>
  )
}

export default EditLivraison
