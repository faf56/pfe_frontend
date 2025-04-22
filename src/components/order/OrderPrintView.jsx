"use client"

import { forwardRef, useEffect, useState } from "react"
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Divider, Grid, Paper } from "@mui/material"
import { styled } from "@mui/material/styles"

// Seuil pour la livraison gratuite
const FREE_SHIPPING_THRESHOLD = 99

const PrintContainer = styled(Paper)({
  padding: "40px",
  maxWidth: "800px",
  margin: "0 auto",
  backgroundColor: "#fff",
  "@media print": {
    boxShadow: "none",
    padding: "0",
  },
})

const PrintHeader = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "30px",
})

const PrintSection = styled(Box)({
  marginBottom: "20px",
})

const OrderPrintView = forwardRef(({ order }, ref) => {
  const [isShippingFree, setIsShippingFree] = useState(false)
  const [finalTotal, setFinalTotal] = useState(0)

  useEffect(() => {
    if (order) {
      // Vérifier si la livraison est gratuite
      const shippingIsFree = order.livraisonGratuite === true || order.sousTotal >= FREE_SHIPPING_THRESHOLD
      setIsShippingFree(shippingIsFree)

      // Calculer le total final
      if (shippingIsFree) {
        // Si livraison gratuite, le total est égal au sous-total
        setFinalTotal(order.sousTotal)
      } else {
        // Sinon, ajouter les frais de livraison
        setFinalTotal(order.sousTotal + (order.fraisLivraison || 0))
      }

      console.log("OrderPrintView - Données de commande:", order)
      console.log("OrderPrintView - Livraison gratuite:", shippingIsFree)
      console.log("OrderPrintView - Sous-total:", order.sousTotal)
      console.log("OrderPrintView - Total calculé:", finalTotal)
    }
  }, [order])

  if (!order) return null

  // Format date
  const orderDate = new Date(order.createdAt).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  // Calculate totals
  const subtotal = order.sousTotal || 0
  const shippingCost = order.fraisLivraison || 0

  return (
    <div className="print-content">
      <PrintContainer>
        <PrintHeader>
          <Box>
            <Typography variant="h4" gutterBottom>
              FACTURE
            </Typography>
            <Typography variant="body2">
              <strong>N° Commande:</strong> {order._id}
            </Typography>
            <Typography variant="body2">
              <strong>Date:</strong> {orderDate}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="h6">Perla Coif</Typography>
            <Typography variant="body2">Kassas Nº5 entre Rte Ain et Afrane</Typography>
            <Typography variant="body2">Sfax, Tunisia</Typography>
            <Typography variant="body2">steperlacoiff@gmil.com</Typography>
            <Typography variant="body2">+216 71 123 456</Typography>
          </Box>
        </PrintHeader>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <PrintSection>
              <Typography variant="h6" gutterBottom>
                Client
              </Typography>
              {order.userID ? (
                <>
                  <Typography variant="body2">
                    {order.userID.firstname} {order.userID.lastname}
                  </Typography>
                  <Typography variant="body2">{order.userID.email}</Typography>
                  <Typography variant="body2">{order.userID.telephone}</Typography>
                </>
              ) : (
                <Typography variant="body2">Client non enregistré</Typography>
              )}
            </PrintSection>
          </Grid>
          <Grid item xs={6}>
            <PrintSection>
              <Typography variant="h6" gutterBottom>
                Livraison
              </Typography>
              {order.livraisonID && (
                <Typography variant="body2">
                  <strong>Méthode:</strong> {order.livraisonID.titre}
                </Typography>
              )}
              {order.adresseLivraison ? (
                <>
                  <Typography variant="body2">
                    <strong>Adresse:</strong> {order.adresseLivraison.rue}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Ville:</strong> {order.adresseLivraison.ville}, {order.adresseLivraison.codePostal}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Téléphone:</strong> {order.adresseLivraison.telephone}
                  </Typography>
                </>
              ) : (
                <Typography variant="body2">Retrait en magasin</Typography>
              )}
            </PrintSection>
          </Grid>
        </Grid>

        <PrintSection>
          <Typography variant="h6" gutterBottom>
            Détails de la commande
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Produit</TableCell>
                <TableCell align="center">Prix unitaire</TableCell>
                <TableCell align="center">Quantité</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.produits.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {item.produitID?.imagepro && (
                        <Box
                          component="img"
                          src={item.produitID.imagepro}
                          alt={item.produitID.title}
                          sx={{ width: 40, height: 40, mr: 2, objectFit: "cover" }}
                        />
                      )}
                      <Box>
                        <Typography variant="body2">{item.produitID?.title || "Produit"}</Typography>
                        {item.produitID?.marqueID?.nommarque && (
                          <Typography variant="caption" color="text.secondary">
                            {item.produitID.marqueID.nommarque}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center">{item.prix?.toFixed(3)} DT</TableCell>
                  <TableCell align="center">{item.quantite}</TableCell>
                  <TableCell align="right">{(item.prix * item.quantite).toFixed(3)} DT</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </PrintSection>

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", mb: 3 }}>
          <Box sx={{ width: "250px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2">Sous-total:</Typography>
              <Typography variant="body2">{subtotal.toFixed(3)} DT</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, alignItems: "center" }}>
              <Typography variant="body2">Frais de livraison:</Typography>
              {isShippingFree ? (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body2" color="success.main" fontWeight="bold" sx={{ mr: 1 }}>
                    GRATUIT
                  </Typography>
                  {shippingCost > 0 && (
                    <Typography variant="caption" sx={{ textDecoration: "line-through", color: "text.secondary" }}>
                      {shippingCost.toFixed(3)} DT
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography variant="body2">{shippingCost.toFixed(3)} DT</Typography>
              )}
            </Box>
            {isShippingFree && (
              <Box
                sx={{
                  backgroundColor: "rgba(76, 175, 80, 0.1)",
                  p: 1,
                  borderRadius: 1,
                  mb: 1,
                  width: "100%",
                }}
              >
                <Typography variant="caption" color="success.main" align="center" sx={{ display: "block" }}>
                  Livraison gratuite à partir de {FREE_SHIPPING_THRESHOLD} DT d'achat !
                </Typography>
              </Box>
            )}
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Total:
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold">
                {finalTotal.toFixed(3)} DT
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <PrintSection>
          <Typography variant="h6" gutterBottom>
            Informations de paiement
          </Typography>
          <Typography variant="body2">
            <strong>Méthode de paiement:</strong>{" "}
            {order.methodePaiement === "comptant_livraison"
              ? "Paiement à la livraison"
              : order.methodePaiement === "en_ligne"
                ? "Paiement en ligne"
                : order.methodePaiement}
          </Typography>
          <Typography variant="body2">
            <strong>Statut de la commande:</strong>{" "}
            {order.statut === "en_attente"
              ? "En attente"
              : order.statut === "confirmee"
                ? "Confirmée"
                : order.statut === "en_preparation"
                  ? "En préparation"
                  : order.statut === "expediee"
                    ? "Expédiée"
                    : order.statut === "livree"
                      ? "Livrée"
                      : order.statut === "annulee"
                        ? "Annulée"
                        : order.statut}
          </Typography>
        </PrintSection>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Merci pour votre commande!
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Pour toute question concernant cette facture, veuillez nous contacter à steperlacoiff@gmil.com
          </Typography>
        </Box>
      </PrintContainer>
    </div>
  )
})

OrderPrintView.displayName = "OrderPrintView"

export default OrderPrintView
