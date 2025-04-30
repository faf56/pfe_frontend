"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Breadcrumbs,
  Link as MuiLink,
  FormHelperText,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material"
import { LocationOn, Phone, Email, AccessTime, NavigateNext } from "@mui/icons-material"
import { sendContactMessage } from "../../service/contactservice"
import { fetchOrders } from "../../service/orderservice" // Importez votre service de commandes

const subjects = ["Service client", "Question sur un produit", "Réclamation", "Partenariat", "Autre"]

export default function ContactForm() {
  const [formData, setFormData] = useState({
    subject: "Service client",
    email: "",
    orderRef: "",
    message: "",
  })
  const [file, setFile] = useState(null)
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success", // "success" ou "error"
  })
  const [userOrders, setUserOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)

  // Récupérer les commandes de l'utilisateur connecté
  useEffect(() => {
    const fetchUserOrders = async () => {
      // Vérifier si l'utilisateur est connecté
      const userInfo = localStorage.getItem("userInfo")
      if (!userInfo) return

      try {
        setLoadingOrders(true)
        const user = JSON.parse(userInfo)

        // Si vous avez un endpoint pour récupérer les commandes d'un utilisateur spécifique
        const response = await fetchOrders(user._id)
        if (response.data && response.data.length > 0) {
          setUserOrders(response.data)
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes:", error)
      } finally {
        setLoadingOrders(false)
      }
    }

    fetchUserOrders()
  }, [])

  // Pré-remplir l'email si l'utilisateur est connecté
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo")
    if (userInfo) {
      const user = JSON.parse(userInfo)
      if (user.email) {
        setFormData((prev) => ({ ...prev, email: user.email }))
      }
    }
  }, [])

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSelectChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Vérification de la taille du fichier (5MB max)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setNotification({
          open: true,
          message: "Le fichier est trop volumineux (max 5MB)",
          severity: "error",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = "L'adresse e-mail est requise"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'adresse e-mail n'est pas valide"
    }

    if (!formData.message) {
      newErrors.message = "Le message est requis"
    }

    

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
  
    if (!validateForm()) {
      return
    }
  
    setLoading(true)
  
    try {
      // Créer un FormData pour envoyer le fichier
      const formDataToSend = new FormData()
      formDataToSend.append("subject", formData.subject)
      formDataToSend.append("email", formData.email)
      formDataToSend.append("orderRef", formData.orderRef)
      formDataToSend.append("message", formData.message)
  
      if (file) {
        formDataToSend.append("attachment", file);
      }
  
      // Utiliser le service pour envoyer le message
      const response = await sendContactMessage(formDataToSend)
  
      if (response.data.success) {
        setNotification({
          open: true,
          message: "Votre message a été envoyé avec succès! Nous vous répondrons dans les plus brefs délais.",
          severity: "success",
        })
  
        // Réinitialiser le formulaire
        setFormData({
          subject: "Service client",
          email: "",
          orderRef: "",
          message: "",
        })
        setFile(null)
      } else {
        throw new Error(response.data.message || "Une erreur est survenue")
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error)
      setNotification({
        open: true,
        message: error.response?.data?.message || "Erreur lors de l'envoi du message. Veuillez réessayer.",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false })
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Fil d'Ariane */}
      <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 4 }}>
        <MuiLink underline="hover" color="inherit" href="/">
          Accueil
        </MuiLink>
        <Typography color="text.primary">Contactez-nous</Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ mb: 5, fontWeight: 600 }}>
        Contacter Nous ?
      </Typography>

      <Grid container spacing={4}>
        {/* Informations de contact */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
              INFORMATIONS
            </Typography>

            <Box sx={{ display: "flex", mb: 3, alignItems: "flex-start" }}>
              <LocationOn sx={{ mr: 2, color: "primary.main" }} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 500,color: "#ee004e" }}>
                PERLA COIF
                </Typography>
                <Typography variant="body2">
                  Kassas Nº5 entre Rte Ain et Afrane
                  <br />
                  Sfax
                  <br />
                  Tunisie
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", mb: 3, alignItems: "center" }}>
              <Phone sx={{ mr: 2, color: "primary.main" }} />
              <Box>
                <Typography variant="subtitle2">Appelez-nous :</Typography>
                <Typography variant="body1"  sx={{ fontWeight: 500, color: "#ee004e" }}>
                21 298 233
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", mb: 3, alignItems: "center" }}>
              <Email sx={{ mr: 2, color: "primary.main" }} />
              <Box>
                <Typography variant="subtitle2">Envoyez-nous un e-mail :</Typography>
                <MuiLink href="mailto:info@beautystore.tn"  sx={{ fontWeight: 500, color: "#ee004e" }}>
                steperlacoiff@gmail.com
                </MuiLink>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "flex-start" }}>
              <AccessTime sx={{ mr: 2, color: "primary.main" }} />
              <Box>
                <Typography variant="subtitle2">Horaire</Typography>
                <Typography variant="body2"  sx={{ fontWeight: 500, color: "#ee004e" }}>
                  Lundi - Vendredi :
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                9:00h -19:30h
                </Typography>
                <Typography variant="body2"  sx={{ fontWeight: 500, color: "#ee004e" }}>
                  Samedi :
                </Typography>
                <Typography variant="body2">9:00h -16:00h</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Formulaire de contact */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="subject-label">Sujet</InputLabel>
                    <Select
                      labelId="subject-label"
                      name="subject"
                      value={formData.subject}
                      onChange={handleSelectChange}
                      label="Sujet"
                    >
                      {subjects.map((subject) => (
                        <MenuItem key={subject} value={subject}>
                          {subject}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Adresse e-mail"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
  <FormControl fullWidth>
    <TextField
      label="Référence de commande"
      name="orderRef"
      value={formData.orderRef}
      onChange={handleInputChange}
      disabled={loadingOrders}
      helperText="Optionnel"
    />
  </FormControl>
</Grid>


                <Grid item xs={12}>
  <Box sx={{ display: "flex", alignItems: "center" }}>
    <TextField
      fullWidth
      disabled
      value={file ? file.name : "Aucun fichier sélectionné"}
      sx={{ flexGrow: 1, mr: 1 }}
    />
    <Button
      variant="contained"
      component="label"
      sx={{
        height:"50px",
        with:"100px",
        bgcolor: "#ee004e",
        color: "white",
        "&:hover": {
          bgcolor: "#EE004F85",
          
        },
      }}
    >
      CHOISIR UN FICHIER
      <input 
        type="file" 
        hidden 
        onChange={handleFileChange}
        accept=".pdf,.jpg,.png,.doc,.docx" 
      />
    </Button>
  </Box>
  <FormHelperText>Optionnel - Max 5MB (.pdf, .jpg, .png, .doc)</FormHelperText>
</Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                    error={!!errors.message}
                    helperText={errors.message}
                    required
                  />
                </Grid>

                

                <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      minWidth: 150,
                      bgcolor: "#7CDF73FF",
                      "&:hover": {
                        bgcolor: "#2BC037FF",
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : "ENVOYER"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} variant="filled">
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}
