"use client"

import { useState, useEffect } from "react"
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
} from "@mui/material"
import { Search, FilterList } from "@mui/icons-material"
import { fetchcategories } from "../../service/categorieservice"

const FiltersContainer = styled(Paper)(({ theme }) => ({
  padding: "16px",
  borderRadius: "12px",
  marginBottom: "24px",
  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)",
}))

const ScategorieFilter = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  // Charger les catégories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true)
        const response = await fetchcategories()
        setCategories(response.data)
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
    onFilterChange({
      search: event.target.value,
      category: categoryFilter,
    })
  }

  const handleCategoryChange = (event) => {
    setCategoryFilter(event.target.value)
    onFilterChange({
      search: searchTerm,
      category: event.target.value,
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
            placeholder="Rechercher une sous-catégorie..."
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

        <FormControl size="small" sx={{ minWidth: 200, flexGrow: 1 }}>
          <InputLabel id="category-filter-label">Catégorie</InputLabel>
          <Select
            labelId="category-filter-label"
            id="category-filter"
            value={categoryFilter}
            label="Catégorie"
            onChange={handleCategoryChange}
            disabled={loading}
          >
            <MenuItem value="all">Toutes les catégories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.nomcategorie}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {(searchTerm || categoryFilter !== "all") && (
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
                  category: categoryFilter,
                })
              }}
              size="small"
              variant="outlined"
            />
          )}

          {categoryFilter !== "all" && (
            <Chip
              label={`Catégorie: ${categories.find((c) => c._id === categoryFilter)?.nomcategorie || "Sélectionnée"}`}
              onDelete={() => {
                setCategoryFilter("all")
                onFilterChange({
                  search: searchTerm,
                  category: "all",
                })
              }}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
      )}
    </FiltersContainer>
  )
}

export default ScategorieFilter
