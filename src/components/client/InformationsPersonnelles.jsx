"use client"

import { useState } from "react"
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  CircularProgress,
  Avatar,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material"
import { PhotoCamera } from "@mui/icons-material"
import { updateUser } from "../../service/userservice"

const InformationsPersonnelles = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
    telephone: user?.telephone || "",
    userVille: user?.userVille || "",
    sexe: user?.sexe || "",
    password: "",
    confirmPassword: "",
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [avatar, setAvatar] = useState(user?.avatar || "")
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      setError("Format d'image non supporté. Utilisez JPG, PNG ou GIF.")
      return
    }

    try {
      setUploadingAvatar(true)

      // Simuler un upload vers Cloudinary (à remplacer par votre code réel)
      // Dans un cas réel, vous utiliseriez FormData et fetch pour envoyer l'image à Cloudinary
      const reader = new FileReader()
      reader.onloadend = async () => {
        // Ici, vous feriez normalement un appel API pour uploader l'image
        // Pour l'exemple, on simule juste un délai et on utilise l'URL de l'image locale
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Dans un cas réel, vous récupéreriez l'URL de Cloudinary ici
        const avatarUrl = reader.result
        setAvatar(avatarUrl)

        // Mettre à jour l'utilisateur avec la nouvelle URL d'avatar
        try {
          const updatedUser = { ...user, avatar: avatarUrl }
          await updateUser(updatedUser)
          setUser(updatedUser)
          localStorage.setItem("user", JSON.stringify(updatedUser))
          setSuccess("Photo de profil mise à jour avec succès")
        } catch (error) {
          console.error("Erreur lors de la mise à jour de l'avatar:", error)
          setError("Erreur lors de la mise à jour de la photo de profil")
        }

        setUploadingAvatar(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Erreur lors du téléchargement de l'image:", error)
      setError("Erreur lors du téléchargement de l'image")
      setUploadingAvatar(false)
    }
  }

  const validateForm = () => {
    // Vérifier si les mots de passe correspondent
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return false
    }

    // Vérifier le format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Format d'email invalide")
      return false
    }

    // Vérifier le numéro de téléphone (8 chiffres pour la Tunisie)
    if (formData.telephone && !/^\d{8}$/.test(formData.telephone)) {
      setError("Le numéro de téléphone doit contenir 8 chiffres")
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      // Préparer les données à envoyer
      const userData = {
        _id: user._id,
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        telephone: formData.telephone,
        userVille: formData.userVille,
        sexe: formData.sexe,
      }

      // Ajouter le mot de passe seulement s'il est fourni
      if (formData.password) {
        userData.password = formData.password
      }

      // Mettre à jour l'utilisateur
      const response = await updateUser(userData)

      // Mettre à jour les données utilisateur dans le localStorage
      const updatedUser = response.data.user
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)

      setSuccess("Informations mises à jour avec succès")

      // Réinitialiser les champs de mot de passe
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }))
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error)
      setError(error.response?.data?.message || "Erreur lors de la mise à jour du profil")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
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

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
        <Avatar
          src={avatar}
          alt={`${formData.firstname} ${formData.lastname}`}
          sx={{ width: 100, height: 100, mb: 2 }}
        />

        <Box sx={{ position: "relative" }}>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="avatar-upload"
            type="file"
            onChange={handleAvatarChange}
            disabled={uploadingAvatar}
          />
          <label htmlFor="avatar-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={uploadingAvatar ? <CircularProgress size={20} /> : <PhotoCamera />}
              disabled={uploadingAvatar}
            >
              {uploadingAvatar ? "Téléchargement..." : "Changer la photo"}
            </Button>
          </label>
        </Box>
      </Box>

      <Typography variant="h6" gutterBottom>
        Informations personnelles
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Prénom"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField required fullWidth label="Nom" name="lastname" value={formData.lastname} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Téléphone"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            placeholder="8 chiffres"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            label="Ville"
            name="userVille"
            value={formData.userVille || ""}
            onChange={handleChange}
            SelectProps={{
              native: true,
            }}
          >
            <option value=""></option>
            <option value="Tunis">Tunis</option>
            <option value="Sfax">Sfax</option>
            <option value="Sousse">Sousse</option>
            <option value="Kairouan">Kairouan</option>
            <option value="Bizerte">Bizerte</option>
            <option value="Gabès">Gabès</option>
            <option value="Ariana">Ariana</option>
            <option value="Gafsa">Gafsa</option>
            <option value="Monastir">Monastir</option>
            <option value="Ben Arous">Ben Arous</option>
            <option value="Kasserine">Kasserine</option>
            <option value="Médenine">Médenine</option>
            <option value="Nabeul">Nabeul</option>
            <option value="Tataouine">Tataouine</option>
            <option value="Béja">Béja</option>
            <option value="Jendouba">Jendouba</option>
            <option value="El Kef">El Kef</option>
            <option value="Mahdia">Mahdia</option>
            <option value="Sidi Bouzid">Sidi Bouzid</option>
            <option value="Tozeur">Tozeur</option>
            <option value="Siliana">Siliana</option>
            <option value="Kébili">Kébili</option>
            <option value="Zaghouan">Zaghouan</option>
            <option value="Manouba">Manouba</option>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Sexe</FormLabel>
            <RadioGroup row name="sexe" value={formData.sexe || ""} onChange={handleChange}>
              <FormControlLabel value="homme" control={<Radio />} label="Homme" />
              <FormControlLabel value="femme" control={<Radio />} label="Femme" />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>
        Changer le mot de passe
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Nouveau mot de passe"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Confirmer le mot de passe"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </Box>
    </Box>
  )
}

export default InformationsPersonnelles
