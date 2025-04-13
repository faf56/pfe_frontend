"use client"

import { useMemo, useState } from "react"
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
import { Edit as EditIcon, Delete as DeleteIcon, Category } from "@mui/icons-material"
import Editscategorie from "./Editscategorie"

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

const CategoryChip = styled(Chip)(({ theme }) => ({
  borderRadius: "6px",
  fontWeight: 500,
  backgroundColor: "rgba(25, 118, 210, 0.08)",
  color: "#1976d2",
  border: "1px solid rgba(25, 118, 210, 0.3)",
}))

const Affichescategorie = ({ scategories, handleDeleteScategorie, handleUpdateScategorie }) => {
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedScategorie, setSelectedScategorie] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleOpenEditModal = (scategorie) => {
    setSelectedScategorie(scategorie)
    setEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setEditModalOpen(false)
    setSelectedScategorie(null)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  // Enrichir les données avec le nom de la catégorie
  const enrichedScategories = useMemo(
    () =>
      scategories.map((scat) => ({
        ...scat,
        nomcategorie: scat.categorieID?.nomcategorie || "Non défini",
      })),
    [scategories],
  )

  // Pagination
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - enrichedScategories.length) : 0
  const visibleScategories = enrichedScategories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <>
      <StyledPaper>
        <StyledTableContainer>
          <Table>
            <TableHead>
              <StyledTableHeadRow>
                <TableCell>Sous-catégorie</TableCell>
                <TableCell>Catégorie</TableCell>
                <TableCell>Actions</TableCell>
              </StyledTableHeadRow>
            </TableHead>
            <TableBody>
              {visibleScategories.map((scategorie) => (
                <StyledTableRow key={scategorie._id}>
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
                        <Category sx={{ color: "#1976d2" }} />
                      </Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {scategorie.nomscategorie}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <CategoryChip label={scategorie.nomcategorie} size="small" />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex" }}>
                      <Tooltip title="Modifier">
                        <ActionButton size="small" color="primary" onClick={() => handleOpenEditModal(scategorie)}>
                          <EditIcon fontSize="small" />
                        </ActionButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <ActionButton size="small" color="error" onClick={() => handleDeleteScategorie(scategorie._id)}>
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
          count={enrichedScategories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
        />
      </StyledPaper>

      {selectedScategorie && (
        <Editscategorie
          show={editModalOpen}
          handleClose={handleCloseEditModal}
          sca={selectedScategorie}
          handleUpdateScategorie={handleUpdateScategorie}
        />
      )}
    </>
  )
}

export default Affichescategorie

