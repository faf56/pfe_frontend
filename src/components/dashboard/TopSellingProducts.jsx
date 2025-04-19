"use client"

import { Box, Typography, Paper, List, ListItem, ListItemAvatar, Avatar, Divider, styled } from "@mui/material"
import { TrendingUp } from "@mui/icons-material"

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

const ProductAvatar = styled(Avatar)(({ theme }) => ({
  width: 50,
  height: 50,
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
}))

// Composant personnalisé pour remplacer ListItemText et éviter les problèmes d'hydratation
const CustomListItemContent = ({ primary, secondary }) => (
  <div style={{ flex: 1, minWidth: 0 }}>
    <div>{primary}</div>
    <div>{secondary}</div>
  </div>
)

const TopSellingProducts = ({ products }) => {
  return (
    <StyledPaper>
      <Box sx={{ p: 2, backgroundColor: "#f8f9fa", borderBottom: "1px solid #e0e0e0" }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600, display: "flex", alignItems: "center" }}>
          <TrendingUp sx={{ mr: 1, color: "#1976d2" }} />
          Produits les plus vendus
        </Typography>
      </Box>

      {products.length === 0 ? (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="body2" component="div" color="text.secondary">
            Aucune donnée disponible
          </Typography>
        </Box>
      ) : (
        <List disablePadding>
          {products.map((product, index) => (
            <Box key={product.id}>
              <StyledListItem>
                <ListItemAvatar>
                  <ProductAvatar
                    src={product.image || "/placeholder.svg?height=50&width=50"}
                    alt={product.name}
                    variant="rounded"
                  />
                </ListItemAvatar>

                <CustomListItemContent
                  primary={
                    <Typography variant="subtitle1" component="div" sx={{ fontWeight: 600 }}>
                      {product.name}
                    </Typography>
                  }
                  secondary={
                    <div>
                      <Typography variant="body2" component="div" color="text.secondary">
                        {product.quantity} unités vendues
                      </Typography>
                      <Typography variant="body2" component="div" color="primary" sx={{ fontWeight: 500 }}>
                        {product.revenue.toFixed(3)} DT
                      </Typography>
                    </div>
                  }
                />

                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    backgroundColor: "#1976d2",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "0.75rem",
                  }}
                >
                  {index + 1}
                </Box>
              </StyledListItem>
              {index < products.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      )}
    </StyledPaper>
  )
}

export default TopSellingProducts
