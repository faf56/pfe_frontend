"use client"

import { useEffect, useState } from "react"
import AfficheUsers from "./AfficheUsers"

import UserFilters from "./UserFilters"
import AddUser from "./AddUser"
import { CircularProgress, Box, Typography, Paper, Button, styled } from "@mui/material"
import {
  PrintOutlined,
  PeopleAltOutlined,
  RefreshOutlined,
  AdminPanelSettingsOutlined,
  CheckCircleOutlined,
  Add,
} from "@mui/icons-material"
import { fetchUsers } from "../../service/userservice"

// Styled components
const PageHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
}))

const HeaderTitle = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "16px",
}))

const StatsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: "16px",
  marginBottom: "24px",
}))

const StatCard = styled(Paper)(({ theme }) => ({
  flex: 1,
  padding: "20px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  gap: "16px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
}))

const StatIcon = styled(Box)(({ theme, color }) => ({
  width: "48px",
  height: "48px",
  borderRadius: "12px",
  backgroundColor: color,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
}))

const ActionButton = styled(Button)(({ theme, color = "#1976d2", bgcolor = "rgba(25, 118, 210, 0.1)" }) => ({
  borderRadius: "8px",
  textTransform: "none",
  backgroundColor: bgcolor,
  color: color,
  fontWeight: 500,
  padding: "8px 16px",
  "&:hover": {
    backgroundColor: bgcolor === "rgba(25, 118, 210, 0.1)" ? "rgba(25, 118, 210, 0.2)" : bgcolor,
  },
}))

const ListUsers = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(true)
  const [addModalOpen, setAddModalOpen] = useState(false)

  const getUsers = async () => {
    try {
      setIsPending(true)
      const res = await fetchUsers()
      setUsers(res.data)
      setFilteredUsers(res.data)
    } catch (error) {
      console.log(error)
      setError(error)
    } finally {
      setIsPending(false)
    }
  }

  useEffect(() => {
    getUsers()
  }, [])

  const handleUpdateUser = (updatedUser) => {
    const updatedUsers = users.map((user) => (user._id === updatedUser._id ? updatedUser : user))
    setUsers(updatedUsers)
    setFilteredUsers(filteredUsers.map((user) => (user._id === updatedUser._id ? updatedUser : user)))
  }

  const handleAddUser = (newUser) => {
    setUsers([newUser, ...users])
    setFilteredUsers([newUser, ...filteredUsers])
  }

  const handleFilterChange = (filters) => {
    let result = [...users]

    // Filter by status
    if (filters.status !== "all") {
      const isActive = filters.status === "active"
      result = result.filter((user) => user.isActive === isActive)
    }

    // Filter by role
    if (filters.role !== "all") {
      result = result.filter((user) => user.role === filters.role)
    }

    // Filter by ville
    if (filters.ville && filters.ville !== "all") {
      result = result.filter((user) => user.userVille === filters.ville)
    }

    // Filter by sexe
    if (filters.sexe && filters.sexe !== "all") {
      result = result.filter((user) => user.sexe === filters.sexe)
    }

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (user) =>
          user.firstname?.toLowerCase().includes(searchLower) ||
          user.lastname?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          (user.telephone && user.telephone.toString().includes(searchLower)) ||
          (user.userVille && user.userVille.toLowerCase().includes(searchLower)),
      )
    }

    setFilteredUsers(result)
  }

  const activeUsers = users.filter((user) => user.isActive).length
  const adminUsers = users.filter((user) => user.role === "admin").length

  return (
    <Box sx={{ padding: "24px" }}>
      <PageHeader>
        <HeaderTitle>
          <PeopleAltOutlined sx={{ fontSize: 32, color: "#1976d2" }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, color: "#333" }}>
              Gestion des utilisateurs
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gérez les comptes utilisateurs, leurs rôles et leurs statuts
            </Typography>
          </Box>
        </HeaderTitle>

        <Box sx={{ display: "flex", gap: 2 }}>
          <ActionButton
            startIcon={<Add />}
            onClick={() => setAddModalOpen(true)}
            variant="contained"
            color="white"
            bgcolor="#1976d2"
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
          >
            Ajouter un utilisateur
          </ActionButton>

          <ActionButton startIcon={<RefreshOutlined />} onClick={getUsers}>
            Actualiser
          </ActionButton>

          <ActionButton
            startIcon={<PrintOutlined />}
            onClick={() => window.print()}
            color="#00796b"
            bgcolor="rgba(0, 121, 107, 0.1)"
          >
            Imprimer
          </ActionButton>
        </Box>
      </PageHeader>

      <StatsContainer>
        <StatCard>
          <StatIcon color="#1976d2">
            <PeopleAltOutlined />
          </StatIcon>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total Utilisateurs
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {users.length}
            </Typography>
          </Box>
        </StatCard>

        <StatCard>
          <StatIcon color="#4caf50">
            <CheckCircleOutlined />
          </StatIcon>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Utilisateurs Actifs
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {activeUsers}
            </Typography>
          </Box>
        </StatCard>

        <StatCard>
          <StatIcon color="#ff9800">
            <AdminPanelSettingsOutlined />
          </StatIcon>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Administrateurs
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {adminUsers}
            </Typography>
          </Box>
        </StatCard>
      </StatsContainer>

      <Box sx={{ my: 3 }}>
        <UserFilters onFilterChange={handleFilterChange} users={users} />
      </Box>

      {isPending ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
          <CircularProgress color="primary" size={60} />
        </Box>
      ) : error ? (
        <Paper
          sx={{
            p: 3,
            borderRadius: "12px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            border: "1px solid #ffcdd2",
          }}
        >
          <Typography variant="h6">Erreur lors du chargement des utilisateurs</Typography>
          <Typography variant="body2">
            {error.message || "Une erreur s'est produite. Veuillez réessayer plus tard."}
          </Typography>
        </Paper>
      ) : (
        <AfficheUsers users={filteredUsers} handleUpdateUser={handleUpdateUser} />
      )}

      <AddUser open={addModalOpen} handleClose={() => setAddModalOpen(false)} handleAddUser={handleAddUser} />
    </Box>
  )
}

export default ListUsers
