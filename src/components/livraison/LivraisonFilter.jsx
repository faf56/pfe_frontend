"use client"

import { useState } from "react"
import { Box, Paper, Typography, Chip, TextField, InputAdornment, styled, Slider, Divider } from "@mui/material"
import { Search, FilterList, AttachMoney } from "@mui/icons-material"

const FiltersContainer = styled(Paper)(({ theme }) => ({
  padding: "16px",
  borderRadius: "12px",
  marginBottom: "24px",
  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)",
}))


const LivraisonFilter = ({ onFilterChange, livraisons }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState([0, 20])
  const [maxPrice, setMaxPrice] = useState(20)

  // Calculer le prix maximum des méthodes de livraison
  useState(() => {
    if (livraisons && livraisons.length > 0) {
      const maxLivraisonPrice = Math.max(...livraisons.map((l) => l.frais))
      setMaxPrice(Math.ceil(maxLivraisonPrice))
      setPriceRange([0, Math.ceil(maxLivraisonPrice)])
    }
  }, [livraisons])

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
    onFilterChange({
      search: event.target.value,
      price: priceRange,
    })
  }

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue)
    onFilterChange({
      search: searchTerm,
      price: newValue,
    })
  }

  // Fonction pour formater le prix
  const formatPrice = (price) => {
    return Number(price).toFixed(3)
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
            placeholder="Rechercher une méthode de livraison..."
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

      <Divider sx={{ my: 2 }} />

      

      {(searchTerm || priceRange[0] > 0 || priceRange[1] < maxPrice) && (
        <Box sx={{ display: "flex", gap: 1, mt: 3, flexWrap: "wrap" }}>
          <Typography variant="body2" color="text.secondary" sx={{ alignSelf: "center" }}>
            Filtres actifs:
          </Typography>

          {searchTerm && (
            <Chip
              label={`Recherche: ${searchTerm}`}
              onDelete={() => {
                setSearchTerm("")
                onFilterChange({
                  search: "",
                  price: priceRange,
                })
              }}
              size="small"
              variant="outlined"
            />
          )}

          {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
            <Chip
              label={`Prix: ${formatPrice(priceRange[0])} TND - ${formatPrice(priceRange[1])} TND`}
              onDelete={() => {
                setPriceRange([0, maxPrice])
                onFilterChange({
                  search: searchTerm,
                  price: [0, maxPrice],
                })
              }}
              size="small"
              color="info"
              variant="outlined"
            />
          )}
        </Box>
      )}
    </FiltersContainer>
  )
}

export default LivraisonFilter
