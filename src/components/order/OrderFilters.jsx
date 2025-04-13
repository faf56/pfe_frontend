"use client"

import { useState } from "react"
import {
  Box,
  Paper,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  styled,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from "@mui/material"
import { Search, FilterList, Clear } from "@mui/icons-material"

const FiltersContainer = styled(Paper)(({ theme }) => ({
  padding: "16px",
  borderRadius: "12px",
  marginBottom: "24px",
  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)",
}))

const OrderFilters = ({ onFilterChange }) => {
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const handleStatusChange = (event) => {
    const newStatus = event.target.value
    setStatusFilter(newStatus)
    onFilterChange({
      status: newStatus,
      search: searchTerm
    })
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
    onFilterChange({
      status: statusFilter,
      search: event.target.value
    })
  }

  const clearFilters = () => {
    setStatusFilter("all")
    setSearchTerm("")
    onFilterChange({
      status: "all",
      search: ""
    })
  }

  return (
    <FiltersContainer>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <FilterList sx={{ color: "#757575", mr: 1 }} />
        <Typography variant="subtitle1" fontWeight={600}>
          Filtres
        </Typography>
        {(statusFilter !== "all" || searchTerm) && (
          <Button
            startIcon={<Clear />}
            onClick={clearFilters}
            size="small"
            sx={{ ml: 'auto' }}
          >
            Réinitialiser
          </Button>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          alignItems: { xs: "flex-start", md: "center" },
          mb: 3,
        }}
      >
        <Box sx={{ minWidth: "300px", flexGrow: 1 }}>
          <TextField
            fullWidth
            placeholder="Rechercher une commande..."
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

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="status-filter-label">Statut</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter"
            value={statusFilter}
            label="Statut"
            onChange={handleStatusChange}
          >
            <MenuItem value="all">Tous les statuts</MenuItem>
            <MenuItem value="en_attente">En attente</MenuItem>
            <MenuItem value="confirmee">Confirmée</MenuItem>
            <MenuItem value="en_preparation">En préparation</MenuItem>
            <MenuItem value="expediee">Expédiée</MenuItem>
            <MenuItem value="livree">Livrée</MenuItem>
            <MenuItem value="annulee">Annulée</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {(statusFilter !== "all" || searchTerm) && (
        <Box sx={{ display: "flex", gap: 1, mt: 3, flexWrap: "wrap" }}>
          <Typography variant="body2" color="text.secondary" sx={{ alignSelf: "center" }}>
            Filtres actifs:
          </Typography>

          {statusFilter !== "all" && (
            <Chip
              label={`Statut: ${
                statusFilter === 'en_attente' ? 'En attente' :
                statusFilter === 'confirmee' ? 'Confirmée' :
                statusFilter === 'en_preparation' ? 'En préparation' :
                statusFilter === 'expediee' ? 'Expédiée' :
                statusFilter === 'livree' ? 'Livrée' : 'Annulée'
              }`}
              onDelete={() => {
                setStatusFilter("all")
                onFilterChange({
                  status: "all",
                  search: searchTerm
                })
              }}
              size="small"
              variant="outlined"
            />
          )}

          {searchTerm && (
            <Chip
              label={`Recherche: ${searchTerm}`}
              onDelete={() => {
                setSearchTerm("")
                onFilterChange({
                  status: statusFilter,
                  search: ""
                })
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

export default OrderFilters