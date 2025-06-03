"use client"

import { useState } from "react"
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { Sort as SortIcon, ArrowUpward, ArrowDownward } from "@mui/icons-material"

const SortSelector = ({ onSortChange, initialSort = "default" }) => {
  const [sortOption, setSortOption] = useState(initialSort)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const handleSortChange = (event) => {
    const newSortOption = event.target.value
    setSortOption(newSortOption)
    onSortChange(newSortOption)
  }

  const toggleSortDirection = () => {
    const newSortOption = sortOption.includes("asc")
      ? sortOption.replace("asc", "desc")
      : sortOption.includes("desc")
        ? sortOption.replace("desc", "asc")
        : sortOption

    setSortOption(newSortOption)
    onSortChange(newSortOption)
  }

  const showDirectionButton = sortOption.includes("price")

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <FormControl size="small" variant="outlined" sx={{ minWidth: isMobile ? 120 : 200 }}>
        <InputLabel id="sort-select-label">Trier par</InputLabel>
        <Select
          labelId="sort-select-label"
          id="sort-select"
          value={sortOption}
          onChange={handleSortChange}
          label="Trier par"
          startAdornment={<SortIcon sx={{ mr: 1, color: "action.active" }} />}
        >
          <MenuItem value="default">Pertinence</MenuItem>
          <MenuItem value="price_asc">Prix croissant</MenuItem>
          <MenuItem value="price_desc">Prix décroissant</MenuItem>
          <MenuItem value="name_asc">Nom (A-Z)</MenuItem>
          <MenuItem value="name_desc">Nom (Z-A)</MenuItem>
          <MenuItem value="newest">Plus récents</MenuItem>
        </Select>
      </FormControl>

      {showDirectionButton && (
        <Tooltip title={sortOption.includes("asc") ? "Prix décroissant" : "Prix croissant"}>
          <IconButton onClick={toggleSortDirection} size="small" color="primary">
            {sortOption.includes("asc") ? <ArrowUpward /> : <ArrowDownward />}
          </IconButton>
        </Tooltip>
      )}
    </Box>
  )
}

export default SortSelector
