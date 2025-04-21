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
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material"
import { Search, FilterList, Clear, LocalShipping as LocalShippingIcon } from "@mui/icons-material"

const FiltersContainer = styled(Paper)(({ theme }) => ({
  padding: "16px",
  borderRadius: "12px",
  marginBottom: "24px",
  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)",
}))

const OrderFilters = ({ onFilterChange }) => {
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [freeShippingOnly, setFreeShippingOnly] = useState(false)

  const handleStatusChange = (event) => {
    const newStatus = event.target.value
    setStatusFilter(newStatus)
    onFilterChange({
      status: newStatus,
      search: searchTerm,
      freeShippingOnly: freeShippingOnly,
    })
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
    onFilterChange({
      status: statusFilter,
      search: event.target.value,
      freeShippingOnly: freeShippingOnly,
    })
  }

  const handleFreeShippingChange = (event) => {
    setFreeShippingOnly(event.target.checked)
    onFilterChange({
      status: statusFilter,
      search: searchTerm,
      freeShippingOnly: event.target.checked,
    })
  }

  const clearFilters = () => {
    setStatusFilter("all")
    setSearchTerm("")
    setFreeShippingOnly(false)
    onFilterChange({
      status: "all",
      search: "",
      freeShippingOnly: false,
    })
  }

  return (
    <FiltersContainer>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <FilterList sx={{ color: "#757575", mr: 1 }} />
        <Typography variant="subtitle1" fontWeight={600}>
          Filtres
        </Typography>
        {(statusFilter !== "all" || searchTerm || freeShippingOnly) && (
          <Button startIcon={<Clear />} onClick={clearFilters} size="small" sx={{ ml: "auto" }}>
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

        <FormControlLabel
          control={
            <Checkbox
              checked={freeShippingOnly}
              onChange={handleFreeShippingChange}
              icon={<LocalShippingIcon color="action" />}
              checkedIcon={<LocalShippingIcon color="success" />}
            />
          }
          label="Livraison gratuite uniquement"
        />
      </Box>

      {(statusFilter !== "all" || searchTerm || freeShippingOnly) && (
        <Box sx={{ display: "flex", gap: 1, mt: 3, flexWrap: "wrap" }}>
          <Typography variant="body2" color="text.secondary" sx={{ alignSelf: "center" }}>
            Filtres actifs:
          </Typography>

          {statusFilter !== "all" && (
            <Chip
              label={`Statut: ${
                statusFilter === "en_attente"
                  ? "En attente"
                  : statusFilter === "confirmee"
                    ? "Confirmée"
                    : statusFilter === "en_preparation"
                      ? "En préparation"
                      : statusFilter === "expediee"
                        ? "Expédiée"
                        : statusFilter === "livree"
                          ? "Livrée"
                          : "Annulée"
              }`}
              onDelete={() => {
                setStatusFilter("all")
                onFilterChange({
                  status: "all",
                  search: searchTerm,
                  freeShippingOnly: freeShippingOnly,
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
                  search: "",
                  freeShippingOnly: freeShippingOnly,
                })
              }}
              size="small"
              variant="outlined"
            />
          )}

          {freeShippingOnly && (
            <Chip
              icon={<LocalShippingIcon style={{ fontSize: 16 }} />}
              label="Livraison gratuite uniquement"
              onDelete={() => {
                setFreeShippingOnly(false)
                onFilterChange({
                  status: statusFilter,
                  search: searchTerm,
                  freeShippingOnly: false,
                })
              }}
              size="small"
              variant="outlined"
              color="success"
            />
          )}
        </Box>
      )}
    </FiltersContainer>
  )
}

export default OrderFilters
