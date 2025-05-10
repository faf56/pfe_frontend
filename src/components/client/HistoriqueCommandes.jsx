"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material"
import {
  Close as CloseIcon,
  ShoppingBag as ShoppingBagIcon,
  LocalShipping as LocalShippingIcon,
  Payment as PaymentIcon,
  Info as InfoIcon,
  Home as HomeIcon,
} from "@mui/icons-material"
import { fetchOrdersByUser } from "../../service/orderservice"

// Seuil pour la livraison gratuite
const FREE_SHIPPING_THRESHOLD = 99

// Fonction pour formater la date
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
  return new Date(dateString).toLocaleDateString("fr-FR", options)
}

// Fonction pour obtenir la couleur du statut
const getStatusColor = (status) => {
  switch (status) {
    case "en_attente":
      return { color: "warning", label: "En attente" }
    case "confirmee":
      return { color: "info", label: "Confirmée" }
    case "en_preparation":
      return { color: "primary", label: "En préparation" }
    case "expediee":
      return { color: "secondary", label: "Expédiée" }
    case "livree":
      return { color: "success", label: "Livrée" }
    case "annulee":
      return { color: "error", label: "Annulée" }
    default:
      return { color: "default", label: status }
  }
}

// Fonction pour vérifier si la livraison est gratuite
const isShippingFree = (order) => {
  // Vérifier si la propriété livraisonGratuite est définie
  if (order.livraisonGratuite === true) {
    return true
  }

  // Vérifier si le sous-total est supérieur ou égal au seuil
  return order.sousTotal >= FREE_SHIPPING_THRESHOLD
}

const HistoriqueCommandes = ({ userId }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const response = await fetchOrdersByUser(userId)

        // Ajouter un log pour déboguer
        console.log("Commandes reçues:", response.data)

        // Enrichir les commandes avec la propriété isShippingFree et calculer le total correct
        const enrichedOrders = response.data.map((order) => {
          const shippingIsFree = isShippingFree(order)
          let finalTotal = order.sousTotal

          // Si la livraison n'est pas gratuite, ajouter les frais de livraison au total
          if (!shippingIsFree) {
            finalTotal += order.fraisLivraison || 0
          }

          return {
            ...order,
            isShippingFree: shippingIsFree,
            finalTotal: finalTotal,
          }
        })

        setOrders(enrichedOrders)
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes:", error)
        setError("Impossible de charger vos commandes. Veuillez réessayer plus tard.")
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchOrders()
    }
  }, [userId])

  const handleOpenOrderDetails = (order) => {
    console.log("Détails de la commande:", order)
    setSelectedOrder(order)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    )
  }

  if (orders.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center", bgcolor: "#f9f9f9" }}>
        <ShoppingBagIcon sx={{ fontSize: 60, color: "#bdbdbd", mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Vous n'avez pas encore passé de commande
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Vos commandes apparaîtront ici une fois que vous aurez effectué un achat.
        </Typography>
        <Button variant="contained" color="primary" href="/product" sx={{ mt: 2 }}>
          Découvrir nos produits
        </Button>
      </Paper>
    )
  }

  return (
    <Box>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>N° Commande</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => {
              const { color, label } = getStatusColor(order.statut)
              return (
                <TableRow key={order._id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      #{order._id.substring(order._id.length - 8).toUpperCase()}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography variant="body2">
                        {order.finalTotal ? order.finalTotal.toFixed(3) : order.total.toFixed(3)} DT
                      </Typography>
                      {order.isShippingFree && (
                        <Chip
                          label="Livraison gratuite"
                          size="small"
                          color="success"
                          sx={{ mt: 0.5, height: 20, fontSize: "0.7rem" }}
                          icon={<LocalShippingIcon style={{ fontSize: "0.7rem" }} />}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={label} color={color} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined" onClick={() => handleOpenOrderDetails(order)}>
                      Détails
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog pour afficher les détails de la commande */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
        aria-labelledby="order-details-title"
        disableRestoreFocus
      >
        {selectedOrder && (
          <>
            <DialogTitle
              id="order-details-title"
              sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <Typography variant="h6" component="span">
                Détails de la commande #{selectedOrder._id.substring(selectedOrder._id.length - 8).toUpperCase()}
              </Typography>
              <IconButton aria-label="close" onClick={handleCloseDialog} sx={{ color: "grey.500" }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Statut de la commande
                    </Typography>
                    <Chip
                      label={getStatusColor(selectedOrder.statut).label}
                      color={getStatusColor(selectedOrder.statut).color}
                      variant="outlined"
                    />
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <InfoIcon sx={{ mr: 1, color: "#1976d2" }} />
                      <Typography variant="subtitle1" fontWeight="bold">
                        Informations de commande
                      </Typography>
                    </Box>
                    <Typography variant="body2" gutterBottom>
                      <strong>Date:</strong> {formatDate(selectedOrder.createdAt)}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Numéro de commande:</strong> #{selectedOrder._id}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <PaymentIcon sx={{ mr: 1, color: "#1976d2" }} />
                      <Typography variant="subtitle1" fontWeight="bold">
                        Méthode de paiement
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      {selectedOrder.methodePaiement === "en_ligne" ? "Paiement en ligne" : "Paiement à la livraison"}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <LocalShippingIcon sx={{ mr: 1, color: "#1976d2" }} />
                      <Typography variant="subtitle1" fontWeight="bold">
                        Méthode de livraison
                      </Typography>
                    </Box>
                    <Typography variant="body2">{selectedOrder.livraisonID?.titre || "Livraison standard"}</Typography>
                    {selectedOrder.isShippingFree && (
                      <Chip
                        label="Livraison gratuite"
                        size="small"
                        color="success"
                        sx={{ mt: 1, height: 24 }}
                        icon={<LocalShippingIcon style={{ fontSize: "0.9rem" }} />}
                      />
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <HomeIcon sx={{ mr: 1, color: "#1976d2" }} />
                      <Typography variant="subtitle1" fontWeight="bold">
                        Adresse de livraison
                      </Typography>
                    </Box>
                    {selectedOrder.adresseLivraison ? (
                      <>
                        <Typography variant="body2" gutterBottom>
                          {selectedOrder.adresseLivraison.rue}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          {selectedOrder.adresseLivraison.codePostal} {selectedOrder.adresseLivraison.ville}
                        </Typography>
                        <Typography variant="body2">Téléphone: {selectedOrder.adresseLivraison.telephone}</Typography>
                      </>
                    ) : (
                      <Typography variant="body2">Retrait en magasin</Typography>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Produits commandés
                  </Typography>

                  <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Produit</TableCell>
                          <TableCell align="right">Prix unitaire</TableCell>
                          <TableCell align="right">Quantité</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedOrder.produits.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                {item.produitID?.imagepro && (
                                  <Box
                                    component="img"
                                    src={item.produitID.imagepro}
                                    alt={item.produitID.title}
                                    sx={{ width: 50, height: 50, mr: 2, objectFit: "cover", borderRadius: 1 }}
                                  />
                                )}
                                <Typography variant="body2">
                                  {item.produitID?.title || "Produit non disponible"}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right">{item.prix.toFixed(3)} DT</TableCell>
                            <TableCell align="right">{item.quantite}</TableCell>
                            <TableCell align="right">{(item.prix * item.quantite).toFixed(3)} DT</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "250px", mb: 1 }}>
                      <Typography variant="body1">Sous-total:</Typography>
                      <Typography variant="body1">{selectedOrder.sousTotal.toFixed(3)} DT</Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "250px",
                        mb: 1,
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body1">Frais de livraison:</Typography>
                      {selectedOrder.isShippingFree ? (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography variant="body1" color="success.main" fontWeight="bold" sx={{ mr: 1 }}>
                            GRATUIT
                          </Typography>
                          {selectedOrder.fraisLivraison > 0 && (
                            <Typography
                              variant="caption"
                              sx={{ textDecoration: "line-through", color: "text.secondary" }}
                            >
                              {selectedOrder.fraisLivraison.toFixed(3)} DT
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        <Typography variant="body1">{selectedOrder.fraisLivraison.toFixed(3)} DT</Typography>
                      )}
                    </Box>
                    {selectedOrder.isShippingFree && (
                      <Box
                        sx={{
                          backgroundColor: "rgba(76, 175, 80, 0.1)",
                          p: 1,
                          borderRadius: 1,
                          mb: 1,
                          width: "250px",
                        }}
                      >
                        <Typography variant="caption" color="success.main" align="center" sx={{ display: "block" }}>
                          Livraison gratuite à partir de {FREE_SHIPPING_THRESHOLD} DT d'achat !
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "250px", mb: 1 }}>
                      <Typography variant="body1" fontWeight="bold">
                        Total:
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {selectedOrder.finalTotal
                          ? selectedOrder.finalTotal.toFixed(3)
                          : selectedOrder.total.toFixed(3)}{" "}
                        DT
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions>
              <Button onClick={handleCloseDialog}>Fermer</Button>
              
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  )
}

export default HistoriqueCommandes
