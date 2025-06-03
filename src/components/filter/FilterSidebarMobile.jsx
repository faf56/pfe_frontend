"use client"

import { useState } from "react"
import {
  Drawer,
  Box,
  IconButton,
  Typography,
  Button,
  Divider,
  useMediaQuery,
  useTheme,
  Badge,
  Fab,
} from "@mui/material"
import { FilterAlt as FilterIcon, Close as CloseIcon } from "@mui/icons-material"
import FilterSidebar from "./FilterSidebar"

const FilterSidebarMobile = ({ initialProducts, onFilterChange }) => {
  const [open, setOpen] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  // Ne rendre ce composant que sur mobile
  if (!isMobile) return null

  // Fonction pour suivre le nombre de filtres actifs
  const handleFilterChange = (filteredProducts) => {
    // Calculer le nombre de filtres actifs en comparant les longueurs
    const filterDifference = initialProducts.length - filteredProducts.length
    setActiveFiltersCount(filterDifference > 0 ? filterDifference : 0)

    // Passer les produits filtrés au parent
    onFilterChange(filteredProducts)
  }

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <Fab
          variant="extended"
          color="primary"
          onClick={() => setOpen(true)}
          sx={{
            px: 2,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          }}
        >
          <Badge badgeContent={activeFiltersCount} color="error" sx={{ mr: 1 }}>
            <FilterIcon />
          </Badge>
          Filtres
        </Fab>
      </Box>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: "85%",
            maxWidth: "350px",
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
          },
        }}
      >
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FilterIcon color="primary" />
            Filtres
          </Typography>
          <IconButton onClick={() => setOpen(false)} edge="end">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ p: 2, overflowY: "auto", height: "calc(100% - 130px)" }}>
          <FilterSidebar initialProducts={initialProducts} onFilterChange={handleFilterChange} />
        </Box>
        <Divider />
        <Box sx={{ p: 2, display: "flex", gap: 2 }}>
          <Button variant="outlined" color="inherit" fullWidth onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button variant="contained" color="primary" fullWidth onClick={() => setOpen(false)}>
            Appliquer
          </Button>
        </Box>
      </Drawer>
    </>
  )
}

export default FilterSidebarMobile
