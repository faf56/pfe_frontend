"use client"

import { useRef, useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material"
import { Close as CloseIcon, Print as PrintIcon } from "@mui/icons-material"
import OrderPrintView from "./OrderPrintView"
import { fetchOrderById } from "../../service/orderservice"

const PrintOrderModal = ({ open, onClose, orderId }) => {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const printRef = useRef(null)

  useEffect(() => {
    if (open && orderId) {
      const loadOrder = async () => {
        try {
          setLoading(true)
          setError(null)
          const response = await fetchOrderById(orderId)
          console.log("Commande chargée:", response.data)
          setOrder(response.data)
        } catch (err) {
          console.error("Erreur lors du chargement de la commande:", err)
          setError("Impossible de charger les détails de la commande")
        } finally {
          setLoading(false)
        }
      }

      loadOrder()
    }
  }, [open, orderId])

  // Remplacer la fonction handlePrint par cette version plus robuste
  const handlePrint = () => {
    if (!order) return

    // Create a new window for printing
    const printWindow = window.open("", "_blank")

    if (!printWindow) {
      alert("Veuillez autoriser les popups pour imprimer la commande.")
      return
    }

    // Vérifier si la livraison est gratuite
    const subtotal = order.sousTotal || 0
    const isShippingFree = order.livraisonGratuite || subtotal >= 99

    // Simplify the approach to avoid port disconnection issues
    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Facture - Commande #${order._id}</title>
        <style>
          @page {
            size: A4;
            margin: 10mm;
          }
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: white;
          }
          .print-container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            box-sizing: border-box;
          }
          .print-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          .print-section {
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          img {
            max-width: 100%;
          }
          .divider {
            border-top: 1px solid #ddd;
            margin: 20px 0;
          }
          .text-right {
            text-align: right;
          }
          .text-center {
            text-align: center;
          }
          .bold {
            font-weight: bold;
          }
          .total-section {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            margin-bottom: 20px;
          }
          .total-box {
            width: 250px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #666;
          }
          .product-cell {
            display: flex;
            align-items: center;
          }
          .product-image {
            width: 40px;
            height: 40px;
            margin-right: 10px;
            object-fit: cover;
          }
          .free-shipping-box {
            background-color: rgba(76, 175, 80, 0.1);
            padding: 8px;
            border-radius: 4px;
            margin: 8px 0;
            text-align: center;
          }
          .free-shipping-text {
            color: #2e7d32;
            font-size: 0.9em;
          }
          .free-shipping-label {
            color: #2e7d32;
            font-weight: bold;
            margin-right: 5px;
          }
          .strikethrough {
            text-decoration: line-through;
            color: #666;
            font-size: 0.9em;
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .print-button {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <div class="print-button" style="text-align: right; margin-bottom: 20px;">
            <button onclick="window.print(); return false;" style="padding: 8px 16px; background-color: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Imprimer
            </button>
          </div>
          
          <div class="print-header">
            <div>
              <h2 style="margin-bottom: 8px;">FACTURE</h2>
              <p><strong>N° Commande:</strong> ${order._id}</p>
              <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}</p>
            </div>
            <div class="text-right">
              <h3 style="margin-bottom: 8px;">Perla Coif</h3>
              <p>Kassas Nº5 entre Rte Ain et Afrane</p>
              <p>Sfax, Tunisia</p>
              <p>steperlacoiff@gmil.com</p>
              <p>+216 71 123 456</p>
            </div>
          </div>
          
          <div class="divider"></div>
          
          <div style="display: flex; gap: 20px; margin-bottom: 20px;">
            <div style="flex: 1;">
              <div class="print-section">
                <h3 style="margin-bottom: 8px;">Client</h3>
                ${
                  order.userID
                    ? `
                  <p>${order.userID.firstname} ${order.userID.lastname}</p>
                  <p>${order.userID.email}</p>
                  <p>${order.userID.telephone || ""}</p>
                `
                    : `
                  <p>Client non enregistré</p>
                `
                }
              </div>
            </div>
            <div style="flex: 1;">
              <div class="print-section">
                <h3 style="margin-bottom: 8px;">Livraison</h3>
                ${
                  order.livraisonID
                    ? `
                  <p><strong>Méthode:</strong> ${order.livraisonID.titre}</p>
                `
                    : ""
                }
                ${
                  order.adresseLivraison
                    ? `
                  <p><strong>Adresse:</strong> ${order.adresseLivraison.rue}</p>
                  <p><strong>Ville:</strong> ${order.adresseLivraison.ville}, ${order.adresseLivraison.codePostal}</p>
                  <p><strong>Téléphone:</strong> ${order.adresseLivraison.telephone}</p>
                `
                    : `
                  <p>Retrait en magasin</p>
                `
                }
              </div>
            </div>
          </div>
          
          <div class="print-section">
            <h4 style="margin-bottom: 8px;">Détails de la commande</h4>
            <table>
              <thead>
                <tr>
                  <th>Produit</th>
                  <th style="text-align: center;">Prix unitaire</th>
                  <th style="text-align: center;">Quantité</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.produits
                  .map(
                    (item) => `
                  <tr>
                    <td>
                      <div class="product-cell">
                        ${
                          item.produitID?.imagepro
                            ? `
                          <img src="${item.produitID.imagepro}" alt="${item.produitID.title || "Produit"}" class="product-image">
                        `
                            : ""
                        }
                        <div>
                          <div>${item.produitID?.title || "Produit"}</div>
                          ${
                            item.produitID?.marqueID?.nommarque
                              ? `
                            <div style="color: #666; font-size: 0.8em;">${item.produitID.marqueID.nommarque}</div>
                          `
                              : ""
                          }
                        </div>
                      </div>
                    </td>
                    <td style="text-align: center;">${item.prix?.toFixed(3)} DT</td>
                    <td style="text-align: center;">${item.quantite}</td>
                    <td style="text-align: right;">${(item.prix * item.quantite).toFixed(3)} DT</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
          
          <div class="total-section">
            <div class="total-box">
              <div class="total-row">
                <span>Sous-total:</span>
                <span>${order.sousTotal?.toFixed(3) || "0.000"} DT</span>
              </div>
              <div class="total-row">
                <span>Frais de livraison:</span>
                ${
                  isShippingFree
                    ? `
                    <span style="display: flex; align-items: center;">
                      <span class="free-shipping-label">GRATUIT</span>
                      ${
                        order.fraisLivraison > 0
                          ? `<span class="strikethrough">${order.fraisLivraison?.toFixed(3) || "0.000"} DT</span>`
                          : ""
                      }
                    </span>
                    `
                    : `<span>${order.fraisLivraison?.toFixed(3) || "0.000"} DT</span>`
                }
              </div>
              ${
                isShippingFree
                  ? `
                  <div class="free-shipping-box">
                    <span class="free-shipping-text">Livraison gratuite à partir de 99 DT d'achat !</span>
                  </div>
                  `
                  : ""
              }
              <div class="divider" style="margin: 8px 0;"></div>
              <div class="total-row bold">
                <span>Total:</span>
                <span>${order.total?.toFixed(3) || "0.000"} DT</span>
              </div>
            </div>
          </div>
          
          <div class="divider"></div>
          
          <div class="print-section">
            
            <p>
              <strong>Méthode de paiement:</strong> 
              ${
                order.methodePaiement === "comptant_livraison"
                  ? "Paiement à la livraison"
                  : order.methodePaiement === "en_ligne"
                    ? "Paiement en ligne"
                    : order.methodePaiement || ""
              }
            </p>
            
          </div>
          
          <div class="footer">
            <p>Merci pour votre commande!</p>
            <p style="font-size: 0.8em;">Pour toute question concernant cette facture, veuillez nous contacter à steperlacoiff@gmil.com</p>
          </div>
        </div>
        
        <script>
          // Simple script to auto-focus the print button
          document.addEventListener('DOMContentLoaded', function() {
            const printButton = document.querySelector('.print-button button');
            if (printButton) {
              printButton.focus();
            }
          });
        </script>
      </body>
    </html>
  `)

    printWindow.document.close()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      // Fix for the aria-hidden warning
      disableEnforceFocus
      disableRestoreFocus
      keepMounted={false}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
        <Typography variant="h6">Aperçu avant impression</Typography>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3, textAlign: "center", color: "error.main" }}>
            <Typography variant="body1">{error}</Typography>
          </Box>
        ) : (
          <div ref={printRef}>
            <OrderPrintView order={order} />
          </div>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Fermer
        </Button>
        <Button
          onClick={handlePrint}
          variant="contained"
          color="primary"
          startIcon={<PrintIcon />}
          disabled={loading || !!error}
        >
          Imprimer
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PrintOrderModal
