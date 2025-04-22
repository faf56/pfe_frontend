"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "react-use-cart"
import { fetchLivraisons } from "../service/livraisonservice"

// Material UI imports
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
  TextField,
  Chip,
} from "@mui/material"

// Icons
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import DeleteIcon from "@mui/icons-material/Delete"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import LocalOfferIcon from "@mui/icons-material/LocalOffer"

const CartPage = () => {
  const navigate = useNavigate()
  const { isEmpty, items, updateItemQuantity, removeItem, emptyCart, cartTotal } = useCart()
  const [shippingMethods, setShippingMethods] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Récupérer les méthodes de livraison depuis l'API
  useEffect(() => {
    const getShippingMethods = async () => {
      try {
        setLoading(true)
        const response = await fetchLivraisons()
        setShippingMethods(response.data)
      } catch (err) {
        console.error("Erreur lors du chargement des méthodes de livraison:", err)
        setError("Impossible de charger les méthodes de livraison")
      } finally {
        setLoading(false)
      }
    }

    getShippingMethods()
  }, [])

  // Gérer le changement de quantité directement
  const handleQuantityChange = (id, value) => {
    const quantity = Number.parseInt(value)
    if (isNaN(quantity) || quantity < 1) return
    updateItemQuantity(id, quantity)
  }

  // Rediriger vers la page de checkout
  const handleCheckout = () => {
    navigate("/checkout")
  }

  // Fonction pour formater le prix avec vérification
  const formatPrice = (price) => {
    // Vérifier si price est défini et est un nombre
    if (price !== undefined && price !== null && !isNaN(Number(price))) {
      return Number(price).toFixed(3)
    }
    return "0.000" // Valeur par défaut
  }

  // Calculer le pourcentage de réduction
  const calculateDiscount = (original, promo) => {
    if (!promo || promo >= original) return 0
    return Math.round(((original - promo) / original) * 100)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        Retour
      </Button>

      <Typography variant="h4" component="h1" gutterBottom>
        <ShoppingCartIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        Mon Panier
      </Typography>

      {isEmpty ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Votre panier est vide
          </Alert>
          <Button variant="contained" color="primary" onClick={() => navigate("/")}>
            Continuer vos achats
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Produit</TableCell>
                    <TableCell align="center">Prix</TableCell>
                    <TableCell align="center">Quantité</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box sx={{ width: 80, height: 80, mr: 2, overflow: "hidden", position: "relative" }}>
                            {item.hasPromo && (
                              <Chip
                                label={`-${calculateDiscount(item.prixOriginal, item.price)}%`}
                                color="error"
                                size="small"
                                sx={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  zIndex: 1,
                                  fontSize: "0.625rem",
                                  height: "20px",
                                }}
                              />
                            )}
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          </Box>
                          <Box>
                            <Typography variant="subtitle1">{item.name}</Typography>
                            {item.marque && (
                              <Typography variant="body2" color="text.secondary">
                                {item.marque}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {item.hasPromo ? (
                          <Box>
                            <Typography variant="body1" color="error.main" fontWeight="bold">
                              {formatPrice(item.price)} TND
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ textDecoration: "line-through", display: "block" }}
                            >
                              {formatPrice(item.prixOriginal)} TND
                            </Typography>
                          </Box>
                        ) : (
                          <Typography>{formatPrice(item.price)} TND</Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <IconButton
                            size="small"
                            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>

                          <TextField
                            size="small"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                            inputProps={{
                              min: 1,
                              style: { textAlign: "center", width: "40px" },
                            }}
                            variant="outlined"
                            sx={{ mx: 1 }}
                          />

                          <IconButton size="small" onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle2">{formatPrice(item.price * item.quantity)} TND</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton color="error" onClick={() => removeItem(item.id)} aria-label="Supprimer">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
              <Button variant="outlined" color="error" onClick={() => emptyCart()} startIcon={<DeleteIcon />}>
                Vider le panier
              </Button>

              <Button variant="outlined" onClick={() => navigate("/")}>
                Continuer vos achats
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Récapitulatif de la commande
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography>
                  Sous-total ({items.length} article{items.length > 1 ? "s" : ""}):
                </Typography>
                <Typography fontWeight="bold">{formatPrice(cartTotal)} TND</Typography>
              </Box>

              {/* Économies réalisées grâce aux promotions */}
              {items.some((item) => item.hasPromo) && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                    bgcolor: "rgba(76, 175, 80, 0.1)",
                    p: 1,
                    borderRadius: 1,
                    mt: 2,
                  }}
                >
                  <Typography color="success.main" sx={{ display: "flex", alignItems: "center" }}>
                    <LocalOfferIcon fontSize="small" sx={{ mr: 0.5 }} />
                    Économies:
                  </Typography>
                  <Typography fontWeight="bold" color="success.main">
                    {formatPrice(
                      items.reduce((total, item) => {
                        return item.hasPromo ? total + (item.prixOriginal - item.price) * item.quantity : total
                      }, 0),
                    )}{" "}
                    TND
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h6">Total estimé:</Typography>
                <Typography variant="h6">{formatPrice(cartTotal)} TND</Typography>
              </Box>

              <Button variant="contained" color="primary" fullWidth size="large" onClick={handleCheckout}>
                Passer à la caisse
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  )
}

export default CartPage
