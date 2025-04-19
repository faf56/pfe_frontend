"use client"

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
  styled,
  Button,
} from "@mui/material"
import { Warning, Inventory, ArrowForward } from "@mui/icons-material"
// Remplacer next/link par un lien standard
// Si vous utilisez React Router, vous pouvez importer { Link } from "react-router-dom"

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  overflow: "hidden",
}))

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  "& .MuiTable-root": {
    borderCollapse: "separate",
    borderSpacing: "0",
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.02)",
  },
}))

const StyledTableHeadRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "#f8f9fa",
  "& th": {
    fontWeight: 600,
    color: "#555",
    fontSize: "0.875rem",
  },
}))

const ProductImage = styled("img")(({ theme }) => ({
  width: "40px",
  height: "40px",
  borderRadius: "8px",
  objectFit: "cover",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
}))

const StockChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "stock",
})(({ theme, stock }) => ({
  borderRadius: "6px",
  fontWeight: 500,
  backgroundColor: stock > 0 ? "rgba(255, 152, 0, 0.1)" : "rgba(244, 67, 54, 0.1)",
  color: stock > 0 ? "#ed6c02" : "#d32f2f",
  border: `1px solid ${stock > 0 ? "rgba(255, 152, 0, 0.5)" : "rgba(244, 67, 54, 0.5)"}`,
}))

const StockAlerts = ({ products }) => {
  return (
    <StyledPaper>
      <Box
        sx={{
          p: 2,
          backgroundColor: "#f8f9fa",
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, display: "flex", alignItems: "center" }}>
          <Warning sx={{ mr: 1, color: "#ff9800" }} />
          Alertes de stock
        </Typography>
        <Button
          component="a"
          href="/admin/products"
          endIcon={<ArrowForward />}
          sx={{ textTransform: "none", fontWeight: 500 }}
        >
          Voir tous les produits
        </Button>
      </Box>

      {products.length === 0 ? (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Aucune alerte de stock
          </Typography>
        </Box>
      ) : (
        <StyledTableContainer>
          <Table>
            <TableHead>
              <StyledTableHeadRow>
                <TableCell>Produit</TableCell>
                <TableCell>Catégorie</TableCell>
                <TableCell>Prix</TableCell>
                <TableCell>Stock</TableCell>
              </StyledTableHeadRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <StyledTableRow key={product._id}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <ProductImage
                        src={product.imagepro || "/placeholder.svg?height=40&width=40"}
                        alt={product.title}
                        onError={(e) => {
                          e.target.src = "/placeholder.svg?height=40&width=40"
                        }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {product.title}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{product.scategorieID?.nomscategorie || "Non défini"}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {product.prix.toFixed(3)} DT
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <StockChip
                      icon={<Inventory fontSize="small" />}
                      label={product.stock === 0 ? "Rupture de stock" : `${product.stock} unités`}
                      size="small"
                      stock={product.stock}
                    />
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      )}
    </StyledPaper>
  )
}

export default StockAlerts
