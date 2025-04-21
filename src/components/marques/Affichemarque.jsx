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
  Tooltip,
  styled,
  Avatar,
} from "@mui/material"
import { Edit as EditIcon, Delete as DeleteIcon, Sell } from "@mui/icons-material"
import Editmarque from "./Editmarque"

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

const BrandImage = styled("img")(({ theme }) => ({
  maxWidth: 250,
  maxHeight: 130,
  borderRadius: "8px",
  objectFit: "cover",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  
   
  
}))

const Affichemarque = ({ marques, handleDeleteMarque, handleUpdateMarque }) => {
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedMarque, setSelectedMarque] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleOpenEditModal = (marque) => {
    setSelectedMarque(marque)
    setEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setEditModalOpen(false)
    setSelectedMarque(null)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  // Pagination
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - marques.length) : 0
  const visibleMarques = marques.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <>
      <StyledPaper>
        <StyledTableContainer>
          <Table>
            <TableHead>
              <StyledTableHeadRow>
                <TableCell>Image</TableCell>
                <TableCell>Marque</TableCell>
                <TableCell>Actions</TableCell>
              </StyledTableHeadRow>
            </TableHead>
            <TableBody>
              {visibleMarques.map((marque) => (
                <StyledTableRow key={marque._id}>
                  <TableCell>
                    {marque.imagemarque ? (
                      <BrandImage
                        src={marque.imagemarque}
                        alt={marque.nommarque}
                        onError={(e) => {
                          e.target.src = "/placeholder.svg?height=60&width=60"
                        }}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          width: 60,
                          height: 60,
                          bgcolor: "rgba(25, 118, 210, 0.08)",
                          color: "#1976d2",
                        }}
                      >
                        <Sell />
                      </Avatar>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {marque.nommarque}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex" }}>
                      <Tooltip title="Modifier">
                        <ActionButton size="small" color="primary" onClick={() => handleOpenEditModal(marque)}>
                          <EditIcon fontSize="small" />
                        </ActionButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <ActionButton size="small" color="error" onClick={() => handleDeleteMarque(marque._id)}>
                          <DeleteIcon fontSize="small" />
                        </ActionButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </StyledTableRow>
              ))}
              {emptyRows > 0 && (
                <StyledTableRow style={{ height: 73 * emptyRows }}>
                  <TableCell colSpan={3} />
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={marques.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
        />
      </StyledPaper>

      {selectedMarque && (
        <Editmarque
          show={editModalOpen}
          handleClose={handleCloseEditModal}
          mar={selectedMarque}
          handleUpdateMarque={handleUpdateMarque}
        />
      )}
    </>
  )
}

export default Affichemarque

