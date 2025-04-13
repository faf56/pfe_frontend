"use client"

import { useEffect, useState } from "react"
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import { Close, Edit as EditIcon } from "@mui/icons-material"
import { fetchcategories } from "../../service/categorieservice"
import { editscategorie } from "../../service/scategorieservice"

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

const FormSelect = styled(FormControl)(({ theme }) => ({
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

const Editscategorie = ({ show, handleClose, sca, handleUpdateScategorie }) => {
  const [scategorie, setScategorie] = useState(sca)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formErrors, setFormErrors] = useState({})

  const loadcategories = async () => {
    try {
      setLoading(true)
      const res = await fetchcategories()
      setCategories(res.data)
    } catch (error) {
      console.log("Erreur lors du chargement des catégories : ", error)
      setError("Erreur lors du chargement des catégories")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadcategories()
  }, [])

  const validateForm = () => {
    const errors = {}

    if (!scategorie.nomscategorie?.trim()) errors.nomscategorie = "Le nom de la sous-catégorie est requis"
    if (!scategorie.categorieID) errors.categorieID = "La catégorie est requise"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setScategorie({ ...scategorie, [name]: value })

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null })
    }
  }

  const handleUpdate = async (event) => {
    event.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setError(null)

    try {
      const response = await editscategorie(scategorie)
      handleUpdateScategorie(response.data)
      handleClose()
    } catch (err) {
      console.error("Erreur lors de la modification de la sous-catégorie :", err)
      setError(err.response?.data?.message || "Une erreur est survenue lors de la modification de la sous-catégorie")
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
          <Typography variant="h6">Modifier la sous-catégorie</Typography>
        </Box>
        <IconButton edge="end" color="inherit" onClick={handleCloseWithFocus} disabled={loading} aria-label="close">
          <Close />
        </IconButton>
      </DialogHeader>

      <form onSubmit={handleUpdate}>
        <DialogContent sx={{ p: 3, overflowY: "auto", maxHeight: "calc(100vh - 170px)" }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: "8px" }}>
              {error}
            </Alert>
          )}

          <FormField
            fullWidth
            label="Nom de la sous-catégorie"
            name="nomscategorie"
            value={scategorie.nomscategorie || ""}
            onChange={handleChange}
            error={!!formErrors.nomscategorie}
            helperText={formErrors.nomscategorie}
            disabled={loading}
            required
            placeholder="Entrez le nom de la sous-catégorie"
            sx={{ mb: 3 }}
          />

          <FormSelect fullWidth error={!!formErrors.categorieID}>
            <InputLabel id="categorie-label">Catégorie</InputLabel>
            <Select
              labelId="categorie-label"
              id="categorieID"
              name="categorieID"
              value={scategorie.categorieID || ""}
              onChange={handleChange}
              label="Catégorie"
              disabled={loading}
              required
            >
              <MenuItem value="">
                <em>Sélectionner une catégorie</em>
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.nomcategorie}
                </MenuItem>
              ))}
            </Select>
            {formErrors.categorieID && (
              <Typography variant="caption" color="error">
                {formErrors.categorieID}
              </Typography>
            )}
          </FormSelect>
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

export default Editscategorie

