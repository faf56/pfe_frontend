"use client"

import { useState, useEffect } from "react"
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
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material"
import { Search, FilterList, Inventory2, InventoryOutlined, AttachMoney } from "@mui/icons-material"
import { fetchscategories } from "../../service/scategorieservice"
import { fetchmarques } from "../../service/marqueservice"

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

const PriceRangeSlider = styled(Slider)(({ theme }) => ({
  width: "100%",
  color: "#1976d2",
  "& .MuiSlider-thumb": {
    height: 20,
    width: 20,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "0 0 0 8px rgba(25, 118, 210, 0.16)",
    },
  },
  "& .MuiSlider-valueLabel": {
    backgroundColor: "#1976d2",
  },
}))

const ProduitFilter = ({ onFilterChange, produits }) => {
  const [stockFilter, setStockFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [marqueFilter, setMarqueFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [maxPrice, setMaxPrice] = useState(1000)
  const [categories, setCategories] = useState([])
  const [marques, setMarques] = useState([])
  const [loading, setLoading] = useState(true)
  // Ajouter un nouveau state pour la plage de stock
  const [stockRange, setStockRange] = useState([0, 100])
  const [maxStock, setMaxStock] = useState(100)

  // Charger les catégories et marques
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [categoriesRes, marquesRes] = await Promise.all([fetchscategories(), fetchmarques()])
        setCategories(categoriesRes.data)
        setMarques(marquesRes.data)
      } catch (error) {
        console.error("Erreur lors du chargement des filtres:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Calculer le prix maximum des produits
  useEffect(() => {
    if (produits && produits.length > 0) {
      const maxProductPrice = Math.max(...produits.map((p) => p.prix))
      setMaxPrice(Math.ceil(maxProductPrice))
      setPriceRange([0, Math.ceil(maxProductPrice)])

      // Calculer le stock maximum
      const maxProductStock = Math.max(...produits.map((p) => p.stock))
      setMaxStock(Math.ceil(maxProductStock))
      setStockRange([0, Math.ceil(maxProductStock)])
    }
  }, [produits])

  const handleStockChange = (event, newStock) => {
    if (newStock !== null) {
      setStockFilter(newStock)
      onFilterChange({
        stock: newStock,
        category: categoryFilter,
        marque: marqueFilter,
        search: searchTerm,
        price: priceRange,
        stockRange: stockRange,
      })
    }
  }

  const handleCategoryChange = (event) => {
    const newCategory = event.target.value
    setCategoryFilter(newCategory)
    onFilterChange({
      stock: stockFilter,
      category: newCategory,
      marque: marqueFilter,
      search: searchTerm,
      price: priceRange,
      stockRange: stockRange,
    })
  }

  const handleMarqueChange = (event) => {
    const newMarque = event.target.value
    setMarqueFilter(newMarque)
    onFilterChange({
      stock: stockFilter,
      category: categoryFilter,
      marque: newMarque,
      search: searchTerm,
      price: priceRange,
      stockRange: stockRange,
    })
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
    onFilterChange({
      stock: stockFilter,
      category: categoryFilter,
      marque: marqueFilter,
      search: event.target.value,
      price: priceRange,
      stockRange: stockRange,
    })
  }

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue)
    onFilterChange({
      stock: stockFilter,
      category: categoryFilter,
      marque: marqueFilter,
      search: searchTerm,
      price: newValue,
      stockRange: stockRange,
    })
  }

  // Ajouter la fonction pour gérer le changement de plage de stock
  const handleStockChangeRange = (event, newValue) => {
    setStockRange(newValue)
    onFilterChange({
      stock: stockFilter,
      category: categoryFilter,
      marque: marqueFilter,
      search: searchTerm,
      price: priceRange,
      stockRange: newValue,
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
            placeholder="Rechercher un produit..."
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

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          mb: 2,
        }}
      >
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
                {category.nomscategorie}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 200, flexGrow: 1 }}>
          <InputLabel id="marque-filter-label">Marque</InputLabel>
          <Select
            labelId="marque-filter-label"
            id="marque-filter"
            value={marqueFilter}
            label="Marque"
            onChange={handleMarqueChange}
            disabled={loading}
          >
            <MenuItem value="all">Toutes les marques</MenuItem>
            {marques.map((marque) => (
              <MenuItem key={marque._id} value={marque._id}>
                {marque.nommarque}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ px: 2, mt: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <AttachMoney sx={{ color: "#757575", mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Fourchette de prix
          </Typography>
        </Box>
        <PriceRangeSlider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={maxPrice}
          valueLabelFormat={(value) => `${value} DT`}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {priceRange[0]} DT
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {priceRange[1]} DT
          </Typography>
        </Box>
      </Box>

      <Box sx={{ px: 2, mt: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <InventoryOutlined sx={{ color: "#757575", mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Quantité en stock
          </Typography>
        </Box>
        <PriceRangeSlider
          value={stockRange}
          onChange={handleStockChangeRange}
          valueLabelDisplay="auto"
          min={0}
          max={maxStock}
          valueLabelFormat={(value) => `${value} unités`}
          sx={{
            color: "#4caf50", // Couleur verte pour différencier du slider de prix
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {stockRange[0]} unités
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {stockRange[1]} unités
          </Typography>
        </Box>
      </Box>

      {(stockFilter !== "all" ||
        categoryFilter !== "all" ||
        marqueFilter !== "all" ||
        searchTerm ||
        priceRange[0] > 0 ||
        priceRange[1] < maxPrice ||
        stockRange[0] > 0 ||
        stockRange[1] < maxStock) && (
        <Box sx={{ display: "flex", gap: 1, mt: 3, flexWrap: "wrap" }}>
          <Typography variant="body2" color="text.secondary" sx={{ alignSelf: "center" }}>
            Filtres actifs:
          </Typography>

          {stockFilter !== "all" && (
            <Chip
              label={stockFilter === "inStock" ? "En stock" : "Stock faible"}
              onDelete={() => handleStockChange(null, "all")}
              size="small"
              color={stockFilter === "inStock" ? "success" : "warning"}
              variant="outlined"
            />
          )}

          {categoryFilter !== "all" && (
            <Chip
              label={`Catégorie: ${categories.find((c) => c._id === categoryFilter)?.nomscategorie || "Sélectionnée"}`}
              onDelete={() => {
                setCategoryFilter("all")
                onFilterChange({
                  stock: stockFilter,
                  category: "all",
                  marque: marqueFilter,
                  search: searchTerm,
                  price: priceRange,
                  stockRange: stockRange,
                })
              }}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}

          {marqueFilter !== "all" && (
            <Chip
              label={`Marque: ${marques.find((m) => m._id === marqueFilter)?.nommarque || "Sélectionnée"}`}
              onDelete={() => {
                setMarqueFilter("all")
                onFilterChange({
                  stock: stockFilter,
                  category: categoryFilter,
                  marque: "all",
                  search: searchTerm,
                  price: priceRange,
                  stockRange: stockRange,
                })
              }}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}

          {searchTerm && (
            <Chip
              label={`Recherche: ${searchTerm}`}
              onDelete={() => {
                setSearchTerm("")
                onFilterChange({
                  stock: stockFilter,
                  category: categoryFilter,
                  marque: marqueFilter,
                  search: "",
                  price: priceRange,
                  stockRange: stockRange,
                })
              }}
              size="small"
              variant="outlined"
            />
          )}

          {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
            <Chip
              label={`Prix: ${priceRange[0]} DT - ${priceRange[1]} DT`}
              onDelete={() => {
                setPriceRange([0, maxPrice])
                onFilterChange({
                  stock: stockFilter,
                  category: categoryFilter,
                  marque: marqueFilter,
                  search: searchTerm,
                  price: [0, maxPrice],
                  stockRange: stockRange,
                })
              }}
              size="small"
              color="info"
              variant="outlined"
            />
          )}
          {(stockRange[0] > 0 || stockRange[1] < maxStock) && (
            <Chip
              label={`Stock: ${stockRange[0]} - ${stockRange[1]} unités`}
              onDelete={() => {
                setStockRange([0, maxStock])
                onFilterChange({
                  stock: stockFilter,
                  category: categoryFilter,
                  marque: marqueFilter,
                  search: searchTerm,
                  price: priceRange,
                  stockRange: [0, maxStock],
                })
              }}
              size="small"
              color="success"
              variant="outlined"
            />
          )}
        </Box>
      )}
    </FiltersContainer>
  )
}

export default ProduitFilter
