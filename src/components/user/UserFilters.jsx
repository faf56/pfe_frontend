"use client"

import { useState, useMemo } from "react"
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import {
  Search,
  FilterList,
  CheckCircle,
  Cancel,
  AdminPanelSettings,
  Person,
  LocationOn,
  Male,
  Female,
} from "@mui/icons-material"

// Liste des principales villes de Tunisie
const tunisianCities = [
  "Tunis",
  "Sfax",
  "Sousse",
  "Kairouan",
  "Bizerte",
  "Gabès",
  "Ariana",
  "Gafsa",
  "Monastir",
  "Ben Arous",
  "Kasserine",
  "Médenine",
  "Nabeul",
  "Tataouine",
  "Béja",
  "Jendouba",
  "El Kef",
  "Mahdia",
  "Sidi Bouzid",
  "Tozeur",
  "Siliana",
  "Kébili",
  "Zaghouan",
  "Manouba",
].sort() // Tri alphabétique des villes

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

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 150,
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
  },
}))

const UserFilters = ({ onFilterChange, users }) => {
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [villeFilter, setVilleFilter] = useState("all")
  const [sexeFilter, setSexeFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Extraire les villes uniques des utilisateurs
  const uniqueVilles = useMemo(() => {
    const villes = users
      ?.filter((user) => user.userVille)
      .map((user) => user.userVille)
      .filter((ville, index, self) => self.indexOf(ville) === index)
    return villes || []
  }, [users])

  const handleStatusChange = (event, newStatus) => {
    if (newStatus !== null) {
      setStatusFilter(newStatus)
      applyFilters(newStatus, roleFilter, villeFilter, sexeFilter, searchTerm)
    }
  }

  const handleRoleChange = (event, newRole) => {
    if (newRole !== null) {
      setRoleFilter(newRole)
      applyFilters(statusFilter, newRole, villeFilter, sexeFilter, searchTerm)
    }
  }

  const handleVilleChange = (event) => {
    const newVille = event.target.value
    setVilleFilter(newVille)
    applyFilters(statusFilter, roleFilter, newVille, sexeFilter, searchTerm)
  }

  const handleSexeChange = (event, newSexe) => {
    if (newSexe !== null) {
      setSexeFilter(newSexe)
      applyFilters(statusFilter, roleFilter, villeFilter, newSexe, searchTerm)
    }
  }

  const handleSearchChange = (event) => {
    const newSearch = event.target.value
    setSearchTerm(newSearch)
    applyFilters(statusFilter, roleFilter, villeFilter, sexeFilter, newSearch)
  }

  const applyFilters = (status, role, ville, sexe, search) => {
    onFilterChange({
      status,
      role,
      ville,
      sexe,
      search,
    })
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
          flexWrap: "wrap",
          mb: 2,
        }}
      >
        <Box sx={{ minWidth: "300px", flexGrow: 1 }}>
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
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          alignItems: { xs: "flex-start", md: "flex-end" },
          flexWrap: "wrap",
        }}
      >
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

        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Sexe
          </Typography>
          <StyledToggleButtonGroup
            value={sexeFilter}
            exclusive
            onChange={handleSexeChange}
            aria-label="sexe filter"
            size="small"
          >
            <StyledToggleButton value="all">Tous</StyledToggleButton>
            <StyledToggleButton value="homme">
              <Male fontSize="small" sx={{ mr: 0.5, color: "#1976d2" }} />
              Homme
            </StyledToggleButton>
            <StyledToggleButton value="femme">
              <Female fontSize="small" sx={{ mr: 0.5, color: "#e91e63" }} />
              Femme
            </StyledToggleButton>
          </StyledToggleButtonGroup>
        </Box>

        <StyledFormControl size="small">
          <InputLabel id="ville-filter-label">Ville</InputLabel>
          <Select
            labelId="ville-filter-label"
            id="ville-filter"
            value={villeFilter}
            label="Ville"
            onChange={handleVilleChange}
            startAdornment={
              <InputAdornment position="start">
                <LocationOn fontSize="small" sx={{ color: "#757575" }} />
              </InputAdornment>
            }
          >
            <MenuItem value="all">Toutes les villes</MenuItem>
            {tunisianCities.map((ville) => (
              <MenuItem key={ville} value={ville}>
                {ville}
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>
      </Box>

      {(statusFilter !== "all" ||
        roleFilter !== "all" ||
        villeFilter !== "all" ||
        sexeFilter !== "all" ||
        searchTerm) && (
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

          {sexeFilter !== "all" && (
            <Chip
              label={sexeFilter === "homme" ? "Homme" : "Femme"}
              onDelete={() => handleSexeChange(null, "all")}
              size="small"
              color={sexeFilter === "homme" ? "info" : "secondary"}
              variant="outlined"
            />
          )}

          {villeFilter !== "all" && (
            <Chip
              icon={<LocationOn fontSize="small" />}
              label={villeFilter}
              onDelete={() => handleVilleChange({ target: { value: "all" } })}
              size="small"
              variant="outlined"
            />
          )}

          {searchTerm && (
            <Chip
              label={`Recherche: ${searchTerm}`}
              onDelete={() => {
                setSearchTerm("")
                applyFilters(statusFilter, roleFilter, villeFilter, sexeFilter, "")
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
