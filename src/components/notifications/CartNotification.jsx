"use client"
import { Box, Typography, Button, Paper, IconButton, Divider } from "@mui/material"
import { Close, CheckCircle, ArrowBack } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import "./CartNotification.css"

const CartNotification = ({
  open,
  onClose,
  product,
  quantity = 1,
  cartTotal = {
    items: 0,
    subtotal: 0,
    shipping: 7.0,
    total: 0,
  },
}) => {
  const navigate = useNavigate()

  if (!open || !product) return null

  const handleContinueShopping = () => {
    onClose()
  }

  const handleGoToCart = () => {
    onClose()
    navigate("/panier")
  }

  return (
    <div className="cart-notification-overlay">
      <Paper className="cart-notification-container">
        <Box className="cart-notification-header">
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CheckCircle sx={{ color: "#4caf50", mr: 1 }} />
            <Typography variant="h6">Produit ajouté au panier avec succès</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>

        <Box className="cart-notification-content">
          <Box className="cart-notification-product">
            <Box className="cart-notification-image">
              <img src={product.image || "/placeholder.svg"} alt={product.name} />
            </Box>
            <Box className="cart-notification-details">
              <Typography variant="h6" className="cart-notification-title">
                {product.name}
              </Typography>
              <Typography variant="body1" className="cart-notification-price">
                {product.price?.toFixed(3)} TND
              </Typography>
              <Typography variant="body2" className="cart-notification-quantity">
                Quantité : {quantity}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          
        </Box>

        <Box className="cart-notification-actions">
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleContinueShopping}
            className="cart-notification-continue"
          >
            Continuer mes achats
          </Button>
          <Button variant="contained" color="primary" onClick={handleGoToCart} className="cart-notification-checkout">
            Commander
          </Button>
        </Box>
      </Paper>
    </div>
  )
}

export default CartNotification
