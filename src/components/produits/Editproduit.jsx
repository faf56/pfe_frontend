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
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material"
import { Close, Edit as EditIcon } from "@mui/icons-material"
import { fetchscategories } from "../../service/scategorieservice"
import { fetchmarques } from "../../service/marqueservice"
import { editproduit } from "../../service/produitservice"
import { FilePond, registerPlugin } from "react-filepond"
import "filepond/dist/filepond.min.css"
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css"

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

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

const ImageUploadSection = styled(Box)(({ theme }) => ({
  marginTop: "16px",
  padding: "16px",
  borderRadius: "8px",
  border: "1px dashed #e0e0e0",
  backgroundColor: "#f8f9fa",
}))

const Editproduit = ({ show, handleClose, pro, handleUpdateProduct }) => {
  const [produit, setProduit] = useState({
    _id: "",
    title: "",
    description: "",
    marqueID: "",
    scategorieID: "",
    stock: 0,
    prix: 0,
    imagepro: "",
  })

  const [scategories, setScategories] = useState([])
  const [marques, setMarques] = useState([])
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [loadingData, setLoadingData] = useState(true)

  const loadscategories = async () => {
    try {
      setLoadingData(true)
      const res = await fetchscategories()
      setScategories(res.data)
    } catch (error) {
      console.log("Erreur lors du chargement des catégories : ", error)
      setError("Erreur lors du chargement des catégories")
    } finally {
      setLoadingData(false)
    }
  }

  const loadmarques = async () => {
    try {
      setLoadingData(true)
      const res = await fetchmarques()
      setMarques(res.data)
    } catch (error) {
      console.log("Erreur lors du chargement des marques : ", error)
      setError("Erreur lors du chargement des marques")
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    loadscategories()
    loadmarques()
  }, [])

  useEffect(() => {
    if (pro && scategories.length > 0 && marques.length > 0) {
      // Vérifiez si la marqueID existe dans les marques disponibles
      const marqueExists = marques.some((marque) => marque._id === pro.marqueID?._id)
      // Vérifiez si la scategorieID existe dans les catégories disponibles
      const scategorieExists = scategories.some((scat) => scat._id === pro.scategorieID?._id)

      setProduit({
        _id: pro._id || "",
        title: pro.title || "",
        description: pro.description || "",
        marqueID: marqueExists ? pro.marqueID?._id : "",
        scategorieID: scategorieExists ? pro.scategorieID?._id : "",
        stock: pro.stock || 0,
        prix: pro.prix || 0,
        imagepro: pro.imagepro || "",
      })

      setFiles(pro.imagepro ? [{ source: pro.imagepro, options: { type: "local" } }] : [])
    }
  }, [pro, scategories, marques])

  const validateForm = () => {
    const errors = {}

    if (!produit.title.trim()) errors.title = "Le nom du produit est requis"
    if (!produit.description.trim()) errors.description = "La désignation est requise"
    if (!produit.marqueID) errors.marqueID = "La marque est requise"
    if (!produit.scategorieID) errors.scategorieID = "La catégorie est requise"

    if (produit.stock <= 0) {
      errors.stock = "Le stock doit être supérieur à 0"
    }

    if (produit.prix <= 0) {
      errors.prix = "Le prix doit être supérieur à 0"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setProduit({ ...produit, [name]: value })

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
      const response = await editproduit(produit)
      handleUpdateProduct(response.data)
      handleClose()
    } catch (err) {
      console.error("Erreur lors de la modification du produit :", err)
      setError(err.response?.data?.message || "Une erreur est survenue lors de la modification du produit")
    } finally {
      setLoading(false)
    }
  }

  const uploadImageToCloudinary = async (file) => {
    const data = new FormData()
    data.append("file", file)
    data.append("upload_preset", "perlaimg")

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dr09h69he/image/upload", {
        method: "POST",
        body: data,
      })

      const result = await response.json()
      if (result.secure_url) {
        return result.secure_url
      } else {
        throw new Error("Échec de l'upload de l'image.")
      }
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image :", error)
      throw error
    }
  }

  const serverOptions = {
    process: (fieldName, file, metadata, load, error, progress, abort) => {
      uploadImageToCloudinary(file)
        .then((imageUrl) => {
          if (imageUrl) {
            setProduit((prevProduit) => ({ ...prevProduit, imagepro: imageUrl }))
            load(imageUrl)
          } else {
            error("Échec de l'upload de l'image.")
            abort()
          }
        })
        .catch((err) => {
          console.error("Erreur upload image :", err)
          error("Échec de l'upload de l'image.")
          abort()
        })
    },
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
      maxWidth="md"
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
          <Typography variant="h6">Modifier le produit</Typography>
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
          {loadingData && (
            <Alert severity="info" sx={{ mb: 2, borderRadius: "8px" }}>
              Chargement des données en cours...
            </Alert>
          )}

          {loadingData ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                  Informations du produit
                </Typography>

                <FormField
                  fullWidth
                  label="Nom du produit"
                  name="title"
                  value={produit.title}
                  onChange={handleChange}
                  error={!!formErrors.title}
                  helperText={formErrors.title}
                  disabled={loading}
                  required
                  placeholder="Entrez le nom du produit"
                />

                <FormField
                  fullWidth
                  label="Désignation"
                  name="description"
                  value={produit.description}
                  onChange={handleChange}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                  disabled={loading}
                  required
                  placeholder="Entrez la désignation du produit"
                  multiline
                  rows={2}
                />

                <Box sx={{ display: "flex", gap: 2 }}>
                  <FormField
                    fullWidth
                    label="Prix"
                    name="prix"
                    type="number"
                    value={produit.prix}
                    onChange={handleChange}
                    error={!!formErrors.prix}
                    helperText={formErrors.prix}
                    disabled={loading}
                    required
                    InputProps={{
                      endAdornment: <InputAdornment position="end">DT</InputAdornment>,
                    }}
                  />

                  <FormField
                    fullWidth
                    label="Quantité en stock"
                    name="stock"
                    type="number"
                    value={produit.stock}
                    onChange={handleChange}
                    error={!!formErrors.stock}
                    helperText={formErrors.stock}
                    disabled={loading}
                    required
                  />
                </Box>

                <FormSelect fullWidth error={!!formErrors.marqueID}>
                  <InputLabel id="marque-label">Marque</InputLabel>
                  <Select
                    labelId="marque-label"
                    id="marque"
                    name="marqueID"
                    value={produit.marqueID}
                    onChange={handleChange}
                    label="Marque"
                    disabled={loading || loadingData}
                    required
                  >
                    <MenuItem value="">
                      <em>Sélectionner une marque</em>
                    </MenuItem>
                    {marques.map((marq) => (
                      <MenuItem key={marq._id} value={marq._id}>
                        {marq.nommarque}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.marqueID && (
                    <Typography variant="caption" color="error">
                      {formErrors.marqueID}
                    </Typography>
                  )}
                </FormSelect>

                <FormSelect fullWidth error={!!formErrors.scategorieID}>
                  <InputLabel id="category-label">Catégorie</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    name="scategorieID"
                    value={produit.scategorieID}
                    onChange={handleChange}
                    label="Catégorie"
                    disabled={loading || loadingData}
                    required
                  >
                    <MenuItem value="">
                      <em>Sélectionner une catégorie</em>
                    </MenuItem>
                    {scategories.map((scat) => (
                      <MenuItem key={scat._id} value={scat._id}>
                        {scat.nomscategorie}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.scategorieID && (
                    <Typography variant="caption" color="error">
                      {formErrors.scategorieID}
                    </Typography>
                  )}
                </FormSelect>
              </Box>

              <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" } }} />

              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                  Image du produit
                </Typography>

                <ImageUploadSection>
                  <FilePond
                    files={files}
                    onupdatefiles={setFiles}
                    allowMultiple={false}
                    server={serverOptions}
                    name="file"
                    labelIdle='Glissez et déposez votre image ou <span class="filepond--label-action">Parcourir</span>'
                    labelFileProcessing="Téléchargement"
                    labelFileProcessingComplete="Téléchargement terminé"
                    labelTapToCancel="Cliquez pour annuler"
                    labelTapToRetry="Cliquez pour réessayer"
                    labelFileProcessingError="Erreur lors du téléchargement"
                  />

                  {produit.imagepro && (
                    <Box sx={{ mt: 2, textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Aperçu de l'image
                      </Typography>
                      <Box
                        component="img"
                        src={produit.imagepro}
                        alt="Aperçu du produit"
                        sx={{
                          maxWidth: "100%",
                          maxHeight: "200px",
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                    </Box>
                  )}
                </ImageUploadSection>
              </Box>
            </Box>
          )}
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
            disabled={loading || loadingData}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Enregistrement..." : "Enregistrer les modifications"}
          </SubmitButton>
        </DialogActions>
      </form>
    </StyledDialog>
  )
}

export default Editproduit

