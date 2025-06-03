"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "react-use-cart"
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
  Chip,
} from "@mui/material"

// Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"

// Étapes du processus de commande
const steps = ["Méthode de livraison", "Informations de livraison", "Paiement", "Confirmation"]

// Seuil pour la livraison gratuite
const FREE_SHIPPING_THRESHOLD = 99

const Checkout = () => {
  const navigate = useNavigate()
  const { isEmpty, items, cartTotal, emptyCart } = useCart()

  // Add this new state and effect to check for authentication
  const [user, setUser] = useState(null)

  const [activeStep, setActiveStep] = useState(0)
  const [shippingInfo, setShippingInfo] = useState({
    
    adresse: "",
    ville: "",
    codePostal: "",
    telephone: "",
    
  })
  const [shippingMethods, setShippingMethods] = useState([])
  const [selectedShippingMethod, setSelectedShippingMethod] = useState("")
  const [shippingFrais, setShippingFrais] = useState(0)
  const [originalShippingFrais, setOriginalShippingFrais] = useState(0) // Pour stocker le prix original
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

  // Vérifier si la livraison est gratuite
  const isShippingFree = cartTotal >= FREE_SHIPPING_THRESHOLD

  // Calculer le total (sous-total + frais de livraison)
  const calculateTotal = () => {
    // Si le sous-total est supérieur ou égal à 99 dinars, la livraison est gratuite
    if (isShippingFree) {
      return cartTotal
    }
    return cartTotal + (shippingFrais || 0)
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
          const initialFrais = response.data[0].frais || 0
          setOriginalShippingFrais(initialFrais)
          // Appliquer la livraison gratuite si le sous-total est >= 99 dinars
          setShippingFrais(cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : initialFrais)
        }
      } catch (err) {
        console.error("Erreur lors du chargement des méthodes de livraison:", err)
        setError("Impossible de charger les méthodes de livraison")
      } finally {
        setLoading(false)
      }
    }

    getShippingMethods()
  }, [cartTotal])

  // Vérifier si le panier est vide
  useEffect(() => {
    if (isEmpty && !success) {
      navigate("/panier")
    }
  }, [isEmpty, navigate, success])

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
      const methodFrais = selectedMethod.frais || 0
      setOriginalShippingFrais(methodFrais)
      // Appliquer la livraison gratuite si le sous-total est >= 99 dinars
      setShippingFrais(cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : methodFrais)
    }
  }

  // Gérer le changement de méthode de paiement
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value)
  }

  // Valider les informations de livraison
  const validateShippingInfo = () => {
    const {  adresse, ville, codePostal, telephone } = shippingInfo

    if (!adresse || !ville || !codePostal || !telephone ) {
      setError("Veuillez remplir tous les champs obligatoires")
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
    if (activeStep === 0 && !selectedShippingMethod) {
      setError("Veuillez sélectionner une méthode de livraison")
      return
    }

    if (activeStep === 1 && !validateShippingInfo()) {
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

      // Format products according to the backend schema
      const produits = items.map((item) => ({
        produitID: item.id,
        quantite: item.quantity,
        // Prix will be calculated on the server based on whether there's a promo price
      }))

      // Trouver la méthode de livraison sélectionnée
      const shippingMethod = shippingMethods.find((method) => method._id === selectedShippingMethod)

      // Créer l'objet de commande en suivant exactement la structure attendue par le backend
      const orderData = {
        userID: userData._id, // Add user ID from localStorage
        produits: produits, // Use the correct field name expected by the backend
        sousTotal: cartTotal, // Match the backend field name
        methodePaiement: paymentMethod === "cash" ? "comptant_livraison" : "en_ligne", // Match the enum values
        livraisonID: selectedShippingMethod,
        adresseLivraison: {
          ville: shippingInfo.ville,
          rue: shippingInfo.adresse,
          codePostal: shippingInfo.codePostal,
          telephone: shippingInfo.telephone,
        },
        // Ajouter un champ pour indiquer si la livraison est gratuite
        livraisonGratuite: isShippingFree,
      }

      // Ajouter un log pour déboguer
      console.log("Envoi de la commande:", orderData)

      // Envoyer la commande à l'API
      const response = await addOrder(orderData)
      console.log("Réponse du serveur:", response.data)

      // Générer un numéro de commande (normalement fourni par le backend)
      setOrderNumber(response.data._id || `CMD-${Date.now()}`)

      // Vider le panier après une commande réussie
      emptyCart()

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
          <>
            {/* Alerte de livraison gratuite */}
            {isShippingFree && (
              <Alert
                icon={<LocalShippingIcon />}
                severity="success"
                sx={{ mb: 3, backgroundColor: "rgba(76, 175, 80, 0.1)", color: "#2e7d32" }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  Félicitations ! Vous bénéficiez de la livraison gratuite
                </Typography>
                <Typography variant="body2">
                  Votre commande dépasse {FREE_SHIPPING_THRESHOLD} dinars, la livraison est offerte !
                </Typography>
              </Alert>
            )}

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
                            <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
                              {isShippingFree ? (
                                <>
                                  <Typography
                                    variant="subtitle2"
                                    color="success.main"
                                    sx={{ fontWeight: "bold", mr: 1 }}
                                  >
                                    GRATUIT
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{ textDecoration: "line-through", color: "text.secondary" }}
                                  >
                                    {formatPrice(method.frais)} TND
                                  </Typography>
                                </>
                              ) : (
                                <Typography variant="subtitle2" color="primary">
                                  {formatPrice(method.frais)} TND
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        }
                      />
                    </Paper>
                  ))
                )}
              </RadioGroup>
            </FormControl>
          </>
        )
        
      case 1:
        return (
          <Grid container spacing={3}>
            
            
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
            
          </Grid>
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
              Un email de confirmation a été envoyé à {user?.email || "votre adresse email"}
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
              {items.map((item) => (
                <Box key={item.id} sx={{ display: "flex", mb: 2 }}>
                  <Box sx={{ width: 60, height: 60, mr: 2, overflow: "hidden" }}>
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantité: {item.quantity}
                    </Typography>
                    {item.hasPromo ? (
                      <Box>
                        <Typography variant="body2" color="error">
                          {formatPrice(item.price)} TND
                        </Typography>
                        <Typography variant="caption" sx={{ textDecoration: "line-through", color: "text.secondary" }}>
                          {formatPrice(item.prixOriginal)} TND
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2">{formatPrice(item.price)} TND</Typography>
                    )}
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {formatPrice(item.price * item.quantity)} TND
                    </Typography>
                  </Box>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              {/* Sous-total */}
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography>Sous-total:</Typography>
                <Typography>{formatPrice(cartTotal)} TND</Typography>
              </Box>

              {/* Frais de livraison */}
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, alignItems: "center" }}>
                <Typography>Frais de livraison:</Typography>
                {activeStep >= 1 && selectedShippingMethod ? (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {isShippingFree ? (
                      <>
                        <Chip label="GRATUIT" size="small" color="success" sx={{ mr: 1, fontWeight: "bold" }} />
                        <Typography variant="body2" sx={{ textDecoration: "line-through", color: "text.secondary" }}>
                          {formatPrice(originalShippingFrais)} TND
                        </Typography>
                      </>
                    ) : (
                      <Typography>{formatPrice(shippingFrais)} TND</Typography>
                    )}
                  </Box>
                ) : (
                  <Typography>À calculer</Typography>
                )}
              </Box>

              {isShippingFree && (
                <Box sx={{ backgroundColor: "rgba(76, 175, 80, 0.1)", p: 1, borderRadius: 1, mb: 2 }}>
                  <Typography variant="body2" color="success.main" align="center">
                    Livraison gratuite à partir de {FREE_SHIPPING_THRESHOLD} TND d'achat !
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Total */}
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">
                  {activeStep >= 1 && selectedShippingMethod
                    ? `${formatPrice(calculateTotal())} TND`
                    : `${formatPrice(cartTotal)} TND`}
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
