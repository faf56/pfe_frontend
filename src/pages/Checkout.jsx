"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useShoppingCart } from "use-shopping-cart"
import { fetchLivraisons } from "../service/livraisonservice"
import { addOrder } from "../service/orderservice"

// Material UI imports
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material"

// Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

// Étapes du processus de commande
const steps = ["Informations de livraison", "Méthode de livraison", "Paiement", "Confirmation"]

const Checkout = () => {
  const navigate = useNavigate()
  const { cartDetails, clearCart } = useShoppingCart()

  // Add this new state and effect to check for authentication
  const [user, setUser] = useState(null)

  const [activeStep, setActiveStep] = useState(0)
  const [shippingInfo, setShippingInfo] = useState({
    nom: "",
    prenom: "",
    adresse: "",
    ville: "",
    codePostal: "",
    telephone: "",
    email: "",
  })
  const [shippingMethods, setShippingMethods] = useState([])
  const [selectedShippingMethod, setSelectedShippingMethod] = useState("")
  const [shippingFrais, setShippingFrais] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")

  // Check if user is logged in
  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (!userStr) {
      // Redirect to login if user is not authenticated
      navigate("/login")
    } else {
      setUser(JSON.parse(userStr))
    }
  }, [navigate])

  // Fonction pour formater le prix avec vérification
  const formatPrice = (price) => {
    // Vérifier si price est défini et est un nombre
    if (price !== undefined && price !== null && !isNaN(Number(price))) {
      return Number(price).toFixed(3)
    }
    return "0.000" // Valeur par défaut
  }

  // Calculer le sous-total manuellement à partir des articles du panier
  const calculateSubtotal = () => {
    if (!cartDetails) return 0

    return Object.values(cartDetails).reduce((total, item) => {
      // Vérifier si item.prix existe, sinon utiliser item.price ou 0
      const itemPrice = item.prix || item.price || 0
      return total + itemPrice * item.quantity
    }, 0)
  }

  // Stocker le sous-total dans une variable
  const subtotal = calculateSubtotal()

  // Calculer le total (sous-total + frais de livraison)
  const calculateTotal = () => {
    return subtotal + (shippingFrais || 0)
  }

  // Récupérer les méthodes de livraison depuis l'API
  useEffect(() => {
    const getShippingMethods = async () => {
      try {
        setLoading(true)
        const response = await fetchLivraisons()
        setShippingMethods(response.data)
        if (response.data.length > 0) {
          setSelectedShippingMethod(response.data[0]._id)
          setShippingFrais(response.data[0].frais || 0)
        }
      } catch (err) {
        console.error("Erreur lors du chargement des méthodes de livraison:", err)
        setError("Impossible de charger les méthodes de livraison")
      } finally {
        setLoading(false)
      }
    }

    getShippingMethods()
  }, [])

  // Vérifier si le panier est vide
  useEffect(() => {
    const cartItems = Object.values(cartDetails || {})
    if (cartItems.length === 0 && !success) {
      navigate("/panier")
    }
  }, [cartDetails, navigate, success])

  // Gérer les changements dans le formulaire d'informations de livraison
  const handleShippingInfoChange = (e) => {
    const { name, value } = e.target
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Gérer le changement de méthode de livraison
  const handleShippingMethodChange = (e) => {
    const methodId = e.target.value
    setSelectedShippingMethod(methodId)

    // Mettre à jour les frais de livraison
    const selectedMethod = shippingMethods.find((method) => method._id === methodId)
    if (selectedMethod) {
      setShippingFrais(selectedMethod.frais || 0)
    }
  }

  // Gérer le changement de méthode de paiement
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value)
  }

  // Valider les informations de livraison
  const validateShippingInfo = () => {
    const { nom, prenom, adresse, ville, codePostal, telephone, email } = shippingInfo

    if (!nom || !prenom || !adresse || !ville || !codePostal || !telephone || !email) {
      setError("Veuillez remplir tous les champs obligatoires")
      return false
    }

    // Validation simple de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Veuillez entrer une adresse email valide")
      return false
    }

    // Validation simple du téléphone (8 chiffres pour la Tunisie)
    const phoneRegex = /^\d{8}$/
    if (!phoneRegex.test(telephone)) {
      setError("Veuillez entrer un numéro de téléphone valide (8 chiffres)")
      return false
    }

    // Validation du code postal (4 chiffres pour la Tunisie)
    const postalCodeRegex = /^\d{4}$/
    if (!postalCodeRegex.test(codePostal)) {
      setError("Veuillez entrer un code postal valide (4 chiffres)")
      return false
    }

    setError("")
    return true
  }

  // Passer à l'étape suivante
  const handleNext = () => {
    if (activeStep === 0 && !validateShippingInfo()) {
      return
    }

    if (activeStep === 1 && !selectedShippingMethod) {
      setError("Veuillez sélectionner une méthode de livraison")
      return
    }

    if (activeStep === 2 && !paymentMethod) {
      setError("Veuillez sélectionner une méthode de paiement")
      return
    }

    if (activeStep === steps.length - 2) {
      // Soumettre la commande
      handleSubmitOrder()
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
      setError("")
    }
  }

  // Revenir à l'étape précédente
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
    setError("")
  }

  // Soumettre la commande
  const handleSubmitOrder = async () => {
    try {
      setLoading(true)

      // Check if user is logged in
      const userStr = localStorage.getItem("user")
      if (!userStr) {
        setError("Vous devez être connecté pour passer une commande")
        navigate("/login")
        return
      }

      const userData = JSON.parse(userStr)

      // Préparer les articles de la commande
      const cartItems = Object.values(cartDetails)

      // Format products according to the backend schema
      const produits = cartItems.map((item) => ({
        produitID: item.id,
        quantite: item.quantity,
        // Prix will be calculated on the server
      }))

      // Trouver la méthode de livraison sélectionnée
      const shippingMethod = shippingMethods.find((method) => method._id === selectedShippingMethod)

      // Créer l'objet de commande en suivant exactement la structure attendue par le backend
      const orderData = {
        userID: userData._id, // Add user ID from localStorage
        produits: produits, // Use the correct field name expected by the backend
        sousTotal: subtotal, // Match the backend field name
        methodePaiement: paymentMethod === "cash" ? "comptant_livraison" : "en_ligne", // Match the enum values
        livraisonID: selectedShippingMethod,
        adresseLivraison: {
          ville: shippingInfo.ville,
          rue: shippingInfo.adresse,
          codePostal: shippingInfo.codePostal,
          telephone: shippingInfo.telephone,
        },
      }

      // Ajouter un log pour déboguer
      console.log("Envoi de la commande:", orderData)

      // Envoyer la commande à l'API
      const response = await addOrder(orderData)
      console.log("Réponse du serveur:", response.data)

      // Générer un numéro de commande (normalement fourni par le backend)
      setOrderNumber(response.data._id || `CMD-${Date.now()}`)

      // Vider le panier après une commande réussie
      clearCart()

      // Passer à l'étape de confirmation
      setActiveStep(steps.length - 1)
      setSuccess(true)
    } catch (err) {
      console.error("Erreur lors de la soumission de la commande:", err)
      // Afficher un message d'erreur plus détaillé si disponible
      const errorMessage =
        err.response?.data?.message ||
        "Une erreur est survenue lors de la soumission de votre commande. Veuillez réessayer."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Fermer l'alerte d'erreur
  const handleCloseError = () => {
    setError("")
  }

  // Retourner à la page d'accueil
  const handleReturnHome = () => {
    navigate("/")
  }

  // Rendu du contenu en fonction de l'étape active
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="prenom"
                name="prenom"
                label="Prénom"
                fullWidth
                variant="outlined"
                value={shippingInfo.prenom}
                onChange={handleShippingInfoChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="nom"
                name="nom"
                label="Nom"
                fullWidth
                variant="outlined"
                value={shippingInfo.nom}
                onChange={handleShippingInfoChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="adresse"
                name="adresse"
                label="Adresse"
                fullWidth
                variant="outlined"
                value={shippingInfo.adresse}
                onChange={handleShippingInfoChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="ville"
                name="ville"
                label="Ville"
                fullWidth
                variant="outlined"
                value={shippingInfo.ville}
                onChange={handleShippingInfoChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="codePostal"
                name="codePostal"
                label="Code postal"
                fullWidth
                variant="outlined"
                value={shippingInfo.codePostal}
                onChange={handleShippingInfoChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="telephone"
                name="telephone"
                label="Téléphone"
                fullWidth
                variant="outlined"
                value={shippingInfo.telephone}
                onChange={handleShippingInfoChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="email"
                name="email"
                label="Email"
                fullWidth
                variant="outlined"
                value={shippingInfo.email}
                onChange={handleShippingInfoChange}
              />
            </Grid>
          </Grid>
        )
      case 1:
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">Méthode de livraison</FormLabel>
            <RadioGroup
              aria-label="shipping-method"
              name="shipping-method"
              value={selectedShippingMethod}
              onChange={handleShippingMethodChange}
            >
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
                  <CircularProgress />
                </Box>
              ) : shippingMethods.length === 0 ? (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Aucune méthode de livraison disponible
                </Alert>
              ) : (
                shippingMethods.map((method) => (
                  <Paper
                    key={method._id}
                    sx={{
                      p: 2,
                      mb: 2,
                      border: selectedShippingMethod === method._id ? "2px solid #1976d2" : "1px solid #e0e0e0",
                      borderRadius: 1,
                    }}
                  >
                    <FormControlLabel
                      value={method._id}
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="subtitle1">{method.titre}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {method.description}
                          </Typography>
                          <Typography variant="subtitle2" color="primary" sx={{ mt: 1 }}>
                            {formatPrice(method.frais)} TND
                          </Typography>
                        </Box>
                      }
                    />
                  </Paper>
                ))
              )}
            </RadioGroup>
          </FormControl>
        )
      case 2:
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">Méthode de paiement</FormLabel>
            <RadioGroup
              aria-label="payment-method"
              name="payment-method"
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
            >
              <Paper
                sx={{
                  p: 2,
                  mb: 2,
                  border: paymentMethod === "cash" ? "2px solid #1976d2" : "1px solid #e0e0e0",
                  borderRadius: 1,
                }}
              >
                <FormControlLabel
                  value="cash"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="subtitle1">Paiement à la livraison</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Payez en espèces à la réception de votre commande
                      </Typography>
                    </Box>
                  }
                />
              </Paper>

              <Paper
                sx={{
                  p: 2,
                  mb: 2,
                  border: paymentMethod === "card" ? "2px solid #1976d2" : "1px solid #e0e0e0",
                  borderRadius: 1,
                }}
              >
                <FormControlLabel
                  value="card"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="subtitle1">Carte bancaire</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Paiement sécurisé par carte bancaire
                      </Typography>
                    </Box>
                  }
                />
              </Paper>
            </RadioGroup>
          </FormControl>
        )
      case 3:
        return (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Merci pour votre commande!
            </Typography>
            <Typography variant="subtitle1">Votre commande a été enregistrée avec succès.</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Numéro de commande: <strong>{orderNumber}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Un email de confirmation a été envoyé à {shippingInfo.email}
            </Typography>
            <Button variant="contained" color="primary" onClick={handleReturnHome} sx={{ mt: 4 }}>
              Retour à l'accueil
            </Button>
          </Box>
        )
      default:
        return "Étape inconnue"
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Bouton de retour */}
      {activeStep < steps.length - 1 && (
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
          Retour
        </Button>
      )}

      {/* Titre de la page */}
      <Typography variant="h4" component="h1" gutterBottom>
        Finaliser votre commande
      </Typography>

      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Contenu principal */}
      <Grid container spacing={4}>
        {/* Formulaire de l'étape active */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: { xs: 3, md: 0 } }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={handleCloseError}>
                {error}
              </Alert>
            )}

            {getStepContent(activeStep)}

            {/* Boutons de navigation (sauf pour l'étape de confirmation) */}
            {activeStep < steps.length - 1 && (
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Retour
                </Button>
                <Button variant="contained" color="primary" onClick={handleNext} disabled={loading}>
                  {activeStep === steps.length - 2 ? "Confirmer la commande" : "Suivant"}
                  {loading && <CircularProgress size={24} sx={{ ml: 1 }} />}
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Récapitulatif de la commande */}
        {activeStep < steps.length - 1 && (
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Récapitulatif de la commande
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Liste des articles */}
              {Object.values(cartDetails || {}).map((item) => (
                <Box key={item.id} sx={{ display: "flex", mb: 2 }}>
                  <Box sx={{ width: 60, height: 60, mr: 2, overflow: "hidden" }}>
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title || item.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1">{item.title || item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantité: {item.quantity}
                    </Typography>
                    <Typography variant="body2">
                      {formatPrice((item.prix || item.price) * item.quantity)} TND
                    </Typography>
                  </Box>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              {/* Sous-total */}
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography>Sous-total:</Typography>
                <Typography>{formatPrice(subtotal)} TND</Typography>
              </Box>

              {/* Frais de livraison */}
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography>Frais de livraison:</Typography>
                <Typography>
                  {activeStep >= 1 && selectedShippingMethod ? `${formatPrice(shippingFrais)} TND` : "À calculer"}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Total */}
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">
                  {activeStep >= 1 && selectedShippingMethod
                    ? `${formatPrice(calculateTotal())} TND`
                    : `${formatPrice(subtotal)} TND`}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Snackbar pour les messages de succès/erreur */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default Checkout
