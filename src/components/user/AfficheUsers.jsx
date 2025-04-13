
import { useState } from "react"
import {
  Box,
  Chip,
  Avatar,
  Typography,
  Button as MuiButton,
  IconButton,
  Tooltip,
  Paper,
  Switch,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material"
import { PersonOutline, AdminPanelSettings, CheckCircleOutline, CancelOutlined, Edit } from "@mui/icons-material"
import { toggleUserStatus, updateUserRole } from "../../service/userservice"
import EditUser from "./EditUser"

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

const StatusSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#4caf50",
    "&:hover": {
      backgroundColor: "rgba(76, 175, 80, 0.08)",
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#4caf50",
  },
}))

const RoleButton = styled(MuiButton, {
    shouldForwardProp: (prop) => prop !== '$isAdmin', // Explicitly prevent $isAdmin from reaching DOM
  })(({ $isAdmin }) => ({
    borderRadius: "8px",
    textTransform: "none",
    fontWeight: 500,
    padding: "6px 16px",
    backgroundColor: $isAdmin ? "#e3f2fd" : "#f5f5f5",
    color: $isAdmin ? "#1976d2" : "#616161",
    border: $isAdmin ? "1px solid #bbdefb" : "1px solid #e0e0e0",
    "&:hover": {
      backgroundColor: $isAdmin ? "#bbdefb" : "#e0e0e0",
    },
  }));

const AfficheUsers = ({ users, handleUpdateUser }) => {
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleOpenEditModal = (user) => {
    setSelectedUser(user)
    setEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setEditModalOpen(false)
    setSelectedUser(null)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  // Pagination
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0
  const visibleUsers = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <>
      <StyledPaper>
        <StyledTableContainer>
          <Table>
            <TableHead>
              <StyledTableHeadRow>
                <TableCell>Utilisateur</TableCell>
                <TableCell>Téléphone</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Rôle</TableCell>
                <TableCell>Actions</TableCell>
              </StyledTableHeadRow>
            </TableHead>
            <TableBody>
              {visibleUsers.map((user) => (
                <StyledTableRow key={user._id}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <Avatar
                        src={user.avatar || ""}
                        alt={`${user.firstname} ${user.lastname}`}
                        sx={{
                          width: 50,
                          height: 50,
                          bgcolor: user.role === "admin" ? "#bbdefb" : "#e0e0e0",
                        }}
                      >
                        {user.firstname?.charAt(0)}
                        {user.lastname?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {user.firstname} {user.lastname}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{user.telephone || "Non défini"}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <StatusSwitch
                        checked={user.isActive}
                        onChange={async () => {
                          try {
                            const res = await toggleUserStatus(user.email)
                            handleUpdateUser(res.data.user)
                          } catch (error) {
                            console.error("Erreur lors du changement de statut:", error)
                          }
                        }}
                        size="small"
                      />
                      <Chip
                        icon={
                          user.isActive ? <CheckCircleOutline fontSize="small" /> : <CancelOutlined fontSize="small" />
                        }
                        label={user.isActive ? "Actif" : "Inactif"}
                        variant="outlined"
                        size="small"
                        sx={{
                          borderRadius: "6px",
                          backgroundColor: user.isActive ? "rgba(76, 175, 80, 0.1)" : "rgba(244, 67, 54, 0.1)",
                          borderColor: user.isActive ? "rgba(76, 175, 80, 0.5)" : "rgba(244, 67, 54, 0.5)",
                          color: user.isActive ? "#2e7d32" : "#d32f2f",
                          "& .MuiChip-icon": {
                            color: "inherit",
                          },
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                  <RoleButton
                    $isAdmin={user.role === "admin"}
                    onClick={async () => {
                        try {
                        const newRole = user.role === "admin" ? "user" : "admin";
                        const res = await updateUserRole(user._id, newRole);
                        handleUpdateUser({ ...user, role: newRole });
                        } catch (error) {
                        console.error("Erreur lors du changement de rôle:", error);
                        }
                    }}
                    startIcon={user.role === "admin" ? <AdminPanelSettings /> : <PersonOutline />}
                    size="small"
                    >
                    {user.role === "admin" ? "Administrateur" : "Client"}
                    </RoleButton>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Modifier l'utilisateur">
                      <IconButton
                        size="small"
                        sx={{
                          backgroundColor: "#f5f5f5",
                          "&:hover": { backgroundColor: "#e0e0e0" },
                        }}
                        onClick={() => handleOpenEditModal(user)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </StyledTableRow>
              ))}
              {emptyRows > 0 && (
                <StyledTableRow style={{ height: 73 * emptyRows }}>
                  <TableCell colSpan={5} />
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
        />
      </StyledPaper>

      {selectedUser && (
        <EditUser
          open={editModalOpen}
          handleClose={handleCloseEditModal}
          user={selectedUser}
          handleUpdateUser={handleUpdateUser}
        />
      )}
    </>
  )
}

export default AfficheUsers

