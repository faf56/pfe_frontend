
import { useState } from "react"
import {
  Box,
  Paper,
  Typography,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  InputAdornment,
  styled,
} from "@mui/material"
import { Search, FilterList, CheckCircle, Cancel, AdminPanelSettings, Person } from "@mui/icons-material"

const FiltersContainer = styled(Paper)(({ theme }) => ({
  padding: "16px",
  borderRadius: "12px",
  marginBottom: "24px",
  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)",
}))

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  "& .MuiToggleButtonGroup-grouped": {
    margin: 4,
    borderRadius: "8px !important",
    border: "1px solid #e0e0e0 !important",
    "&.Mui-selected": {
      backgroundColor: "#f5f5f5",
    },
  },
}))

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  textTransform: "none",
  padding: "6px 16px",
}))

const UserFilters = ({ onFilterChange }) => {
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const handleStatusChange = (event, newStatus) => {
    if (newStatus !== null) {
      setStatusFilter(newStatus)
      onFilterChange({ status: newStatus, role: roleFilter, search: searchTerm })
    }
  }

  const handleRoleChange = (event, newRole) => {
    if (newRole !== null) {
      setRoleFilter(newRole)
      onFilterChange({ status: statusFilter, role: newRole, search: searchTerm })
    }
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
    onFilterChange({ status: statusFilter, role: roleFilter, search: event.target.value })
  }

  return (
    <FiltersContainer>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <FilterList sx={{ color: "#757575", mr: 1 }} />
        <Typography variant="subtitle1" fontWeight={600}>
          Filtres
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          alignItems: { xs: "flex-start", md: "center" },
        }}
      >
        <Box sx={{ minWidth: "300px" }}>
          <TextField
            fullWidth
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#9e9e9e" }} />
                </InputAdornment>
              ),
              sx: { borderRadius: "8px" },
            }}
          />
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Statut
            </Typography>
            <StyledToggleButtonGroup
              value={statusFilter}
              exclusive
              onChange={handleStatusChange}
              aria-label="status filter"
              size="small"
            >
              <StyledToggleButton value="all">Tous</StyledToggleButton>
              <StyledToggleButton value="active">
                <CheckCircle fontSize="small" sx={{ mr: 0.5, color: "#4caf50" }} />
                Actifs
              </StyledToggleButton>
              <StyledToggleButton value="inactive">
                <Cancel fontSize="small" sx={{ mr: 0.5, color: "#f44336" }} />
                Inactifs
              </StyledToggleButton>
            </StyledToggleButtonGroup>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Rôle
            </Typography>
            <StyledToggleButtonGroup
              value={roleFilter}
              exclusive
              onChange={handleRoleChange}
              aria-label="role filter"
              size="small"
            >
              <StyledToggleButton value="all">Tous</StyledToggleButton>
              <StyledToggleButton value="admin">
                <AdminPanelSettings fontSize="small" sx={{ mr: 0.5, color: "#1976d2" }} />
                Admin
              </StyledToggleButton>
              <StyledToggleButton value="user">
                <Person fontSize="small" sx={{ mr: 0.5, color: "#ff9800" }} />
                Client
              </StyledToggleButton>
            </StyledToggleButtonGroup>
          </Box>
        </Box>
      </Box>

      {(statusFilter !== "all" || roleFilter !== "all" || searchTerm) && (
        <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
          <Typography variant="body2" color="text.secondary" sx={{ alignSelf: "center" }}>
            Filtres actifs:
          </Typography>

          {statusFilter !== "all" && (
            <Chip
              label={statusFilter === "active" ? "Actifs" : "Inactifs"}
              onDelete={() => handleStatusChange(null, "all")}
              size="small"
              color={statusFilter === "active" ? "success" : "error"}
              variant="outlined"
            />
          )}

          {roleFilter !== "all" && (
            <Chip
              label={roleFilter === "admin" ? "Admin" : "Client"}
              onDelete={() => handleRoleChange(null, "all")}
              size="small"
              color={roleFilter === "admin" ? "primary" : "default"}
              variant="outlined"
            />
          )}

          {searchTerm && (
            <Chip
              label={`Recherche: ${searchTerm}`}
              onDelete={() => {
                setSearchTerm("")
                onFilterChange({ status: statusFilter, role: roleFilter, search: "" })
              }}
              size="small"
              variant="outlined"
            />
          )}
        </Box>
      )}
    </FiltersContainer>
  )
}

export default UserFilters

