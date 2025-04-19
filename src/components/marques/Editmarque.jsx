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
  Divider,
} from "@mui/material"
import { Close, Edit as EditIcon } from "@mui/icons-material"
import { editmarque } from "../../service/marqueservice"
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

const Editmarque = ({ show, handleClose, mar, handleUpdateMarque }) => {
  const [marque, setMarque] = useState(mar)
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  
  useEffect(() => {
    if (mar) {
      setMarque(mar)
      setFiles(
        mar.imagemarque
          ? [
              {
                source: mar.imagemarque,
                options: { type: 'local' },
              },
            ]
          : []
      )
    } else {
      setMarque({
        nommarque: '',
        imagemarque: '',
      })
      setFiles([])
    }
  }, [mar])

  const validateForm = () => {
    const errors = {}

    if (!marque.nommarque?.trim()) errors.nommarque = "Le nom de la marque est requis"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setMarque({ ...marque, [name]: value })

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null })
    }
  }

  const uploadImageToCloudinary = async (file) => {
    const data = new FormData()
    data.append("file", file)
    data.append("upload_preset", "test2025")
    data.append("cloud_name", "dr09h69he")

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dr09h69he/image/upload", {
        method: "POST",
        body: data,
      })

      if (!response.ok) {
        throw new Error("Échec de l'upload de l'image")
      }

      const result = await response.json()
      return result.secure_url
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image:", error)
      throw error
    }
  }

  const serverOptions = {
    load: (source, load, error, progress, abort, headers) => {
      fetch(source)
        .then((response) => response.blob())
        .then((myBlob) => {
          load(myBlob)
        })
        .catch((err) => {
          error("Erreur lors du chargement de l'image")
          abort()
        })
    },
    process: (fieldName, file, metadata, load, error, progress, abort) => {
      uploadImageToCloudinary(file)
        .then((imageUrl) => {
          setMarque((prevMarque) => ({ ...prevMarque, imagemarque: imageUrl }))
          load(imageUrl)
        })
        .catch((err) => {
          error("Échec du téléchargement de l'image")
          abort()
        })
    },
  }

  const handleUpdate = async (event) => {
    event.preventDefault()
  
    if (!validateForm()) return
  
    setLoading(true)
    setError(null)
  
    try {
      // Si aucune nouvelle image n'a été téléchargée, conservez l'image existante
      const marqueToUpdate = {
        ...marque,
        imagemarque: files.length > 0 ? marque.imagemarque : mar.imagemarque
      }
  
      const response = await editmarque(marqueToUpdate)
  
      if (response && response.data) {
        handleUpdateMarque(response.data)
      } else {
        handleUpdateMarque(marqueToUpdate)
      }
  
      handleClose()
    } catch (err) {
      console.error("Erreur lors de la modification de la marque :", err)
      setError(err.response?.data?.message || "Une erreur est survenue lors de la modification de la marque")
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
          <Typography variant="h6">Modifier la marque</Typography>
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
            label="Nom de la marque"
            name="nommarque"
            value={marque.nommarque || ""}
            onChange={handleChange}
            error={!!formErrors.nommarque}
            helperText={formErrors.nommarque}
            disabled={loading}
            required
            placeholder="Entrez le nom de la marque"
            sx={{ mb: 3 }}
          />

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Image de la marque
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

            {marque.imagemarque && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Aperçu de l'image
                </Typography>
                <Box
                  component="img"
                  src={marque.imagemarque}
                  alt="Aperçu de la marque"
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

export default Editmarque
