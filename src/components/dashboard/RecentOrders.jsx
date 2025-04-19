"use client"

import { Box, Typography, Paper, List, ListItem, Chip, Divider, styled, Avatar, AvatarGroup } from "@mui/material"
import {
  ShoppingCart,
  LocalShipping as ShippedIcon,
  Payment as PaidIcon,
  Pending as PendingIcon,
  CheckCircle as CompletedIcon,
  Cancel as CancelledIcon,
  Inventory as PreparingIcon,
} from "@mui/icons-material"

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  overflow: "hidden",
}))

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: "16px",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.02)",
  },
}))

const StatusChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "status",
})(({ theme, status }) => ({
  borderRadius: "6px",
  fontWeight: 500,
  backgroundColor:
    status === "livree"
      ? "rgba(76, 175, 80, 0.1)"
      : status === "expediee"
        ? "rgba(25, 118, 210, 0.1)"
        : status === "confirmee"
          ? "rgba(103, 58, 183, 0.1)"
          : status === "annulee"
            ? "rgba(244, 67, 54, 0.1)"
            : status === "en_preparation"
              ? "rgba(255, 193, 7, 0.1)"
              : "rgba(255, 152, 0, 0.1)",
  color:
    status === "livree"
      ? "#2e7d32"
      : status === "expediee"
        ? "#1976d2"
        : status === "confirmee"
          ? "#673ab7"
          : status === "annulee"
            ? "#d32f2f"
            : status === "en_preparation"
              ? "#ffa000"
              : "#ed6c02",
  border: `1px solid ${
    status === "livree"
      ? "rgba(76, 175, 80, 0.5)"
      : status === "expediee"
        ? "rgba(25, 118, 210, 0.5)"
        : status === "confirmee"
          ? "rgba(103, 58, 183, 0.5)"
          : status === "annulee"
            ? "rgba(244, 67, 54, 0.5)"
            : status === "en_preparation"
              ? "rgba(255, 193, 7, 0.5)"
              : "rgba(255, 152, 0, 0.5)"
  }`,
}))

// Composant personnalisé pour le contenu des éléments de liste
const OrderListItemContent = ({ order, getStatusIcon, getStatusLabel }) => (
  <div style={{ flex: 1, minWidth: 0 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
      <Typography variant="subtitle1" component="div" sx={{ fontWeight: 600 }}>
        #{order._id.substring(0, 8)}
      </Typography>
      <StatusChip
        icon={getStatusIcon(order.statut)}
        label={getStatusLabel(order.statut)}
        size="small"
        status={order.statut}
      />
    </div>

    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
      <Typography variant="body2" component="div" color="text.secondary">
        {order.userID ? `${order.userID.firstname} ${order.userID.lastname}` : "Client non identifié"}
      </Typography>
      <Typography variant="body2" component="div" color="primary" sx={{ fontWeight: 500 }}>
        {order.total.toFixed(3)} DT
      </Typography>
    </div>

    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Typography variant="caption" component="div" color="text.secondary">
        {new Date(order.createdAt).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Typography>
      <AvatarGroup max={3} sx={{ "& .MuiAvatar-root": { width: 24, height: 24 } }}>
        {order.produits?.map((item, idx) => (
          <Avatar
            key={idx}
            src={item.produitID?.imagepro || "/placeholder.svg?height=24&width=24"}
            alt={item.produitID?.title || "Produit"}
            sx={{ width: 24, height: 24 }}
          />
        ))}
      </AvatarGroup>
    </div>
  </div>
)

const RecentOrders = ({ orders }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "livree":
        return <CompletedIcon fontSize="small" />
      case "expediee":
        return <ShippedIcon fontSize="small" />
      case "confirmee":
        return <PaidIcon fontSize="small" />
      case "annulee":
        return <CancelledIcon fontSize="small" />
      case "en_preparation":
        return <PreparingIcon fontSize="small" />
      default:
        return <PendingIcon fontSize="small" />
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "en_attente":
        return "En attente"
      case "confirmee":
        return "Confirmée"
      case "en_preparation":
        return "En préparation"
      case "expediee":
        return "Expédiée"
      case "livree":
        return "Livrée"
      case "annulee":
        return "Annulée"
      default:
        return status
    }
  }

  return (
    <StyledPaper>
      <Box sx={{ p: 2, backgroundColor: "#f8f9fa", borderBottom: "1px solid #e0e0e0" }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600, display: "flex", alignItems: "center" }}>
          <ShoppingCart sx={{ mr: 1, color: "#1976d2" }} />
          Commandes récentes
        </Typography>
      </Box>

      {orders.length === 0 ? (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="body2" component="div" color="text.secondary">
            Aucune commande récente
          </Typography>
        </Box>
      ) : (
        <List disablePadding>
          {orders.map((order, index) => (
            <Box key={order._id}>
              <StyledListItem>
                <OrderListItemContent order={order} getStatusIcon={getStatusIcon} getStatusLabel={getStatusLabel} />
              </StyledListItem>
              {index < orders.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      )}
    </StyledPaper>
  )
}

export default RecentOrders
