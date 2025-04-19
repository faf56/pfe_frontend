"use client"

import { useState } from "react"
import { Drawer, Box, IconButton, Typography, Button, Divider, useMediaQuery, useTheme } from "@mui/material"
import { FilterAlt as FilterIcon, Close as CloseIcon } from "@mui/icons-material"
import FilterSidebar from "./FilterSidebar"

const FilterSidebarMobile = ({ initialProducts, onFilterChange }) => {
  const [open, setOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  // Ne rendre ce composant que sur mobile
  if (!isMobile) return null

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
        <Button
          variant="contained"
          color="primary"
          startIcon={<FilterIcon />}
          onClick={() => setOpen(true)}
          sx={{
            borderRadius: 28,
            px: 3,
            py: 1.5,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          }}
        >
          Filtres
        </Button>
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
        <Box sx={{ p: 2, overflowY: "auto" }}>
          <FilterSidebar initialProducts={initialProducts} onFilterChange={onFilterChange} />
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Button variant="contained" color="primary" fullWidth onClick={() => setOpen(false)} sx={{ borderRadius: 2 }}>
            Appliquer les filtres
          </Button>
        </Box>
      </Drawer>
    </>
  )
}

export default FilterSidebarMobile
