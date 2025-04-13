"use client"

import { useState } from "react"
import { Box, Paper, Typography, Chip, TextField, InputAdornment, styled } from "@mui/material"
import { Search, FilterList } from "@mui/icons-material"

const FiltersContainer = styled(Paper)(({ theme }) => ({
  padding: "16px",
  borderRadius: "12px",
  marginBottom: "24px",
  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)",
}))

const MarqueFilter = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
    onFilterChange({
      search: event.target.value,
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
          mb: 3,
        }}
      >
        <Box sx={{ minWidth: "300px", flexGrow: 1 }}>
          <TextField
            fullWidth
            placeholder="Rechercher une marque..."
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

      {searchTerm && (
        <Box sx={{ display: "flex", gap: 1, mt: 3, flexWrap: "wrap" }}>
          <Typography variant="body2" color="text.secondary" sx={{ alignSelf: "center" }}>
            Filtres actifs:
          </Typography>

          <Chip
            label={`Recherche: ${searchTerm}`}
            onDelete={() => {
              setSearchTerm("")
              onFilterChange({
                search: "",
              })
            }}
            size="small"
            variant="outlined"
          />
        </Box>
      )}
    </FiltersContainer>
  )
}

export default MarqueFilter
