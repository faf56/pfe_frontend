"use client"

import { useState } from "react"
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  IconButton,
  Chip,
  Tooltip,
  styled,
} from "@mui/material"
import { Edit as EditIcon, Delete as DeleteIcon, LocalShipping } from "@mui/icons-material"
import EditLivraison from "./EditLivraison"

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
}))

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  "& .MuiTable-root": {
    borderCollapse: "separate",
    borderSpacing: "0 8px",
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "#fff",
  "&:hover": {
    backgroundColor: "#f9f9f9",
  },
  "& td": {
    border: "none",
    padding: "16px 24px",
  },
}))

const StyledTableHeadRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "#f9f9f9",
  "& th": {
    border: "none",
    padding: "16px 24px",
    fontWeight: 600,
    color: "#555",
    fontSize: "0.875rem",
  },
}))

const ActionButton = styled(IconButton)(({ theme, color = "primary" }) => ({
  backgroundColor: color === "primary" ? "rgba(25, 118, 210, 0.08)" : "rgba(211, 47, 47, 0.08)",
  marginRight: "8px",
  "&:hover": {
    backgroundColor: color === "primary" ? "rgba(25, 118, 210, 0.16)" : "rgba(211, 47, 47, 0.16)",
  },
}))

const PriceChip = styled(Chip)(({ theme }) => ({
  borderRadius: "6px",
  fontWeight: 600,
  backgroundColor: "rgba(25, 118, 210, 0.08)",
  color: "#1976d2",
  border: "1px solid rgba(25, 118, 210, 0.3)",
}))

const AfficheLivraison = ({ livraisons, handleDeleteLivraison, handleUpdateLivraison }) => {
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedLivraison, setSelectedLivraison] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleOpenEditModal = (livraison) => {
    setSelectedLivraison(livraison)
    setEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setEditModalOpen(false)
    setSelectedLivraison(null)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  // Pagination
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - livraisons.length) : 0
  const visibleLivraisons = livraisons.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  // Fonction pour formater le prix
  const formatPrice = (price) => {
    return Number(price).toFixed(3)
  }

  return (
    <>
      <StyledPaper>
        <StyledTableContainer>
          <Table>
            <TableHead>
              <StyledTableHeadRow>
                <TableCell>Méthode de livraison</TableCell>
                <TableCell>Téléphone</TableCell>
                <TableCell>Frais</TableCell>
                <TableCell>Actions</TableCell>
              </StyledTableHeadRow>
            </TableHead>
            <TableBody>
              {visibleLivraisons.map((livraison) => (
                <StyledTableRow key={livraison._id}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "8px",
                          backgroundColor: "rgba(25, 118, 210, 0.08)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <LocalShipping sx={{ color: "#1976d2" }} />
                      </Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {livraison.titre}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{livraison.telephone || "Non défini"}</Typography>
                  </TableCell>
                  <TableCell>
                    <PriceChip label={`${formatPrice(livraison.frais)} TND`} size="small" />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex" }}>
                      <Tooltip title="Modifier">
                        <ActionButton size="small" color="primary" onClick={() => handleOpenEditModal(livraison)}>
                          <EditIcon fontSize="small" />
                        </ActionButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <ActionButton size="small" color="error" onClick={() => handleDeleteLivraison(livraison._id)}>
                          <DeleteIcon fontSize="small" />
                        </ActionButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </StyledTableRow>
              ))}
              {emptyRows > 0 && (
                <StyledTableRow style={{ height: 73 * emptyRows }}>
                  <TableCell colSpan={4} />
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={livraisons.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
        />
      </StyledPaper>

      {selectedLivraison && (
        <EditLivraison
          show={editModalOpen}
          handleClose={handleCloseEditModal}
          livraison={selectedLivraison}
          handleUpdateLivraison={handleUpdateLivraison}
        />
      )}
    </>
  )
}

export default AfficheLivraison
