"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { fetchmarques } from "../../service/marqueservice"
import { fetchscategories } from "../../service/scategorieservice"
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  Button,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Skeleton,
  Badge,
  styled,
  useTheme,
  Slider,
  TextField,
  InputAdornment,
} from "@mui/material"
import {
  ExpandMore as ExpandMoreIcon,
  FilterAlt as FilterIcon,
  RestartAlt as ResetIcon,
  BrandingWatermark as BrandIcon,
  Category as CategoryIcon,
  Check as CheckIcon,
  AttachMoney as MoneyIcon,
  LocalOffer as PromoIcon,
} from "@mui/icons-material"

// Styled components
const FilterPaper = styled(Paper)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  position: "sticky",
  top: theme.spacing(2),
}))

const FilterHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}))

const FilterTitle = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  fontWeight: 600,
  color: theme.palette.text.primary,
}))

const FilterAccordion = styled(Accordion)(({ theme }) => ({
  boxShadow: "none",
  "&:before": {
    display: "none",
  },
  marginBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  border: `1px solid ${theme.palette.divider}`,
}))

const FilterAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  padding: theme.spacing(0, 2),
  "& .MuiAccordionSummary-content": {
    margin: theme.spacing(1, 0),
  },
}))

const FilterAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(1, 2, 2),
  maxHeight: "250px",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    background: theme.palette.background.paper,
  },
  "&::-webkit-scrollbar-thumb": {
    background: theme.palette.divider,
    borderRadius: "3px",
  },
}))

const StyledFormControlLabel = styled(FormControlLabel)(({ theme, disabled }) => ({
  marginLeft: 0,
  marginRight: 0,
  width: "100%",
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.5, 1),
  transition: "background-color 0.2s",
  "&:hover": {
    backgroundColor: disabled ? "transparent" : theme.palette.action.hover,
  },
  "& .MuiFormControlLabel-label": {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.875rem",
    color: disabled ? theme.palette.text.disabled : theme.palette.text.primary,
  },
}))

const CountChip = styled(Chip)(({ theme, count }) => ({
  height: "20px",
  fontSize: "0.75rem",
  backgroundColor: count > 0 ? theme.palette.primary.main : theme.palette.action.disabledBackground,
  color: count > 0 ? theme.palette.primary.contrastText : theme.palette.text.disabled,
  "& .MuiChip-label": {
    padding: "0 8px",
  },
}))

const ResetButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 500,
  color: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: theme.palette.primary.light + "20",
  },
}))

const SelectedFiltersBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}))

const PriceInputContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}))

const FilterSidebar = ({ initialProducts, onFilterChange }) => {
  const theme = useTheme()
  const [marques, setMarques] = useState([])
  const [scategories, setScategories] = useState([])
  const [selectedMarques, setSelectedMarques] = useState([])
  const [selectedScategories, setSelectedScategories] = useState([])
  const [showPromoOnly, setShowPromoOnly] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState({
    marques: true,
    categories: true,
    price: true,
    promo: true,
  })

  // Use refs to prevent infinite loops
  const prevProductsRef = useRef(initialProducts)
  const prevFilteredProductsRef = useRef([])

  // Chargement des marques et scategories
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [marquesRes, scategoriesRes] = await Promise.all([fetchmarques(), fetchscategories()])
        setMarques(marquesRes.data)
        setScategories(scategoriesRes.data)
      } catch (error) {
        console.error("Erreur de chargement des filtres:", error)
      } finally {
        setLoading(false)
      }
    }
    loadFilters()
  }, [])

  // Déterminer la plage de prix à partir des produits
  useEffect(() => {
    if (initialProducts.length > 0) {
      const prices = initialProducts
        .map((product) => {
          // Utiliser le prix promo s'il existe, sinon le prix normal
          return product.prixPromo && product.prixPromo < product.prix ? product.prixPromo : product.prix
        })
        .filter((price) => price !== undefined && price !== null)

      if (prices.length > 0) {
        const min = Math.floor(Math.min(...prices))
        const max = Math.ceil(Math.max(...prices))
        setPriceRange([min, max])
        setMinPrice(min.toString())
        setMaxPrice(max.toString())
      }
    }
  }, [initialProducts])

  // Calcul des compteurs
  const counts = useMemo(() => {
    const marqueCounts = {}
    const scategorieCounts = {}

    initialProducts.forEach((product) => {
      if (product.marqueID) {
        marqueCounts[product.marqueID._id] = (marqueCounts[product.marqueID._id] || 0) + 1
      }
      if (product.scategorieID) {
        scategorieCounts[product.scategorieID._id] = (scategorieCounts[product.scategorieID._id] || 0) + 1
      }
    })

    return { marques: marqueCounts, scategories: scategorieCounts }
  }, [initialProducts])

  // Application des filtres
  useEffect(() => {
    if (!loading) {
      const filtered = initialProducts.filter((product) => {
        // Filtre par marque
        const marqueMatch =
          selectedMarques.length === 0 || (product.marqueID && selectedMarques.includes(product.marqueID._id))

        // Filtre par catégorie
        const scategorieMatch =
          selectedScategories.length === 0 ||
          (product.scategorieID && selectedScategories.includes(product.scategorieID._id))

        // Filtre par prix
        const productPrice = product.prixPromo && product.prixPromo < product.prix ? product.prixPromo : product.prix
        const priceMatch = productPrice >= priceRange[0] && productPrice <= priceRange[1]

        // Filtre par promotion
        const promoMatch = !showPromoOnly || (product.prixPromo && product.prixPromo < product.prix)

        return marqueMatch && scategorieMatch && priceMatch && promoMatch
      })

      // Compare current filtered products with previous filtered products
      const currentFilteredJSON = JSON.stringify(filtered)
      const prevFilteredJSON = JSON.stringify(prevFilteredProductsRef.current)

      // Only update if there's an actual change
      if (currentFilteredJSON !== prevFilteredJSON) {
        prevFilteredProductsRef.current = filtered
        onFilterChange(filtered)
      }
    }
  }, [selectedMarques, selectedScategories, priceRange, showPromoOnly, initialProducts, loading, onFilterChange])

  // Update prevProductsRef when initialProducts changes
  useEffect(() => {
    prevProductsRef.current = initialProducts
  }, [initialProducts])

  const toggleFilter = (type, id) => {
    if (type === "marque") {
      setSelectedMarques((prev) => {
        const newMarques = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        // Si on a tout décoché, on réinitialise complètement
        return newMarques.length === 0 ? [] : newMarques
      })
    } else {
      setSelectedScategories((prev) => {
        const newScategories = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        return newScategories.length === 0 ? [] : newScategories
      })
    }
  }

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue)
    setMinPrice(newValue[0].toString())
    setMaxPrice(newValue[1].toString())
  }

  const handleMinPriceChange = (event) => {
    const value = event.target.value
    setMinPrice(value)

    if (value === "" || isNaN(value)) return

    const numValue = Number(value)
    if (numValue >= 0 && numValue <= priceRange[1]) {
      setPriceRange([numValue, priceRange[1]])
    }
  }

  const handleMaxPriceChange = (event) => {
    const value = event.target.value
    setMaxPrice(value)

    if (value === "" || isNaN(value)) return

    const numValue = Number(value)
    if (numValue >= priceRange[0]) {
      setPriceRange([priceRange[0], numValue])
    }
  }

  const resetFilters = () => {
    setSelectedMarques([])
    setSelectedScategories([])
    setShowPromoOnly(false)

    // Reset price range to initial values from products
    if (initialProducts.length > 0) {
      const prices = initialProducts
        .map((product) => {
          return product.prixPromo && product.prixPromo < product.prix ? product.prixPromo : product.prix
        })
        .filter((price) => price !== undefined && price !== null)

      if (prices.length > 0) {
        const min = Math.floor(Math.min(...prices))
        const max = Math.ceil(Math.max(...prices))
        setPriceRange([min, max])
        setMinPrice(min.toString())
        setMaxPrice(max.toString())
      }
    }
  }

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded({ ...expanded, [panel]: isExpanded })
  }

  const getSelectedMarqueName = (id) => {
    const marque = marques.find((m) => m._id === id)
    return marque ? marque.nommarque : ""
  }

  const getSelectedCategoryName = (id) => {
    const category = scategories.find((s) => s._id === id)
    return category ? category.nomscategorie : ""
  }

  const removeFilter = (type, id) => {
    if (type === "marque") {
      setSelectedMarques((prev) => prev.filter((i) => i !== id))
    } else {
      setSelectedScategories((prev) => prev.filter((i) => i !== id))
    }
  }

  const hasActiveFilters = selectedMarques.length > 0 || selectedScategories.length > 0 || showPromoOnly

  if (loading) {
    return (
      <FilterPaper elevation={3}>
        <FilterHeader>
          <Skeleton variant="text" width={150} height={32} />
          <Skeleton variant="circular" width={24} height={24} />
        </FilterHeader>
        <Divider sx={{ mb: 2 }} />
        {[1, 2, 3].map((i) => (
          <Box key={i} sx={{ mb: 3 }}>
            <Skeleton variant="text" width={120} height={24} sx={{ mb: 1 }} />
            {[1, 2, 3, 4].map((j) => (
              <Skeleton key={j} variant="rectangular" height={36} sx={{ mb: 1, borderRadius: 1 }} />
            ))}
          </Box>
        ))}
      </FilterPaper>
    )
  }

  return (
    <FilterPaper elevation={3}>
      <FilterHeader>
        <FilterTitle variant="h6">
          <FilterIcon color="primary" />
          Filtres
        </FilterTitle>
        {hasActiveFilters && (
          <ResetButton startIcon={<ResetIcon />} onClick={resetFilters} size="small">
            Réinitialiser
          </ResetButton>
        )}
      </FilterHeader>

      <Divider sx={{ mb: 2 }} />

      {/* Affichage des filtres sélectionnés */}
      {hasActiveFilters && (
        <SelectedFiltersBox>
          {selectedMarques.map((id) => (
            <Chip
              key={`selected-marque-${id}`}
              label={getSelectedMarqueName(id)}
              onDelete={() => removeFilter("marque", id)}
              color="primary"
              variant="outlined"
              size="small"
            />
          ))}
          {selectedScategories.map((id) => (
            <Chip
              key={`selected-category-${id}`}
              label={getSelectedCategoryName(id)}
              onDelete={() => removeFilter("category", id)}
              color="secondary"
              variant="outlined"
              size="small"
            />
          ))}
          {showPromoOnly && (
            <Chip
              label="En promotion"
              onDelete={() => setShowPromoOnly(false)}
              color="error"
              variant="outlined"
              size="small"
            />
          )}
        </SelectedFiltersBox>
      )}

      {/* Filtre par promotion */}
      <FilterAccordion expanded={expanded.promo} onChange={handleAccordionChange("promo")}>
        <FilterAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PromoIcon color="error" fontSize="small" />
            <Typography variant="subtitle1" fontWeight={500}>
              Promotions
            </Typography>
          </Box>
        </FilterAccordionSummary>
        <FilterAccordionDetails>
          <FormGroup>
            <StyledFormControlLabel
              control={
                <Checkbox
                  checked={showPromoOnly}
                  onChange={(e) => setShowPromoOnly(e.target.checked)}
                  size="small"
                  color="error"
                />
              }
              label="Afficher uniquement les produits en promotion"
            />
          </FormGroup>
        </FilterAccordionDetails>
      </FilterAccordion>

      {/* Filtre par prix */}
      <FilterAccordion expanded={expanded.price} onChange={handleAccordionChange("price")}>
        <FilterAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MoneyIcon color="primary" fontSize="small" />
            <Typography variant="subtitle1" fontWeight={500}>
              Prix
            </Typography>
          </Box>
        </FilterAccordionSummary>
        <FilterAccordionDetails>
          <Box sx={{ px: 1 }}>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={Math.max(1000, ...initialProducts.map((p) => p.prix || 0))}
              step={5}
              marks
              valueLabelFormat={(value) => `${value} DT`}
            />

            <PriceInputContainer>
              <TextField
                label="Min"
                value={minPrice}
                onChange={handleMinPriceChange}
                size="small"
                InputProps={{
                  endAdornment: <InputAdornment position="end">DT</InputAdornment>,
                }}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
              />
              <TextField
                label="Max"
                value={maxPrice}
                onChange={handleMaxPriceChange}
                size="small"
                InputProps={{
                  endAdornment: <InputAdornment position="end">DT</InputAdornment>,
                }}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
              />
            </PriceInputContainer>
          </Box>
        </FilterAccordionDetails>
      </FilterAccordion>

      {/* Filtres par marque */}
      <FilterAccordion expanded={expanded.marques} onChange={handleAccordionChange("marques")}>
        <FilterAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BrandIcon color="primary" fontSize="small" />
            <Typography variant="subtitle1" fontWeight={500}>
              Marques
            </Typography>
            {selectedMarques.length > 0 && (
              <Badge badgeContent={selectedMarques.length} color="primary" sx={{ ml: 1 }} />
            )}
          </Box>
        </FilterAccordionSummary>
        <FilterAccordionDetails>
          <FormGroup>
            {marques.map((marque) => {
              const count = counts.marques[marque._id] || 0
              const isDisabled = count === 0
              const isSelected = selectedMarques.includes(marque._id)

              return (
                <StyledFormControlLabel
                  key={marque._id}
                  control={
                    <Checkbox
                      checked={isSelected}
                      onChange={() => toggleFilter("marque", marque._id)}
                      disabled={isDisabled}
                      size="small"
                      color="primary"
                      icon={
                        <Box
                          sx={{ width: 18, height: 18, border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}
                        />
                      }
                      checkedIcon={
                        <Box
                          sx={{
                            width: 18,
                            height: 18,
                            backgroundColor: theme.palette.primary.main,
                            borderRadius: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <CheckIcon sx={{ fontSize: 14, color: "white" }} />
                        </Box>
                      }
                    />
                  }
                  label={
                    <>
                      <span>{marque.nommarque}</span>
                      <CountChip
                        label={count}
                        size="small"
                        count={count}
                        variant={isSelected ? "filled" : "outlined"}
                      />
                    </>
                  }
                  disabled={isDisabled}
                />
              )
            })}
          </FormGroup>
        </FilterAccordionDetails>
      </FilterAccordion>

      {/* Filtres par sous-catégorie */}
      <FilterAccordion expanded={expanded.categories} onChange={handleAccordionChange("categories")}>
        <FilterAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CategoryIcon color="secondary" fontSize="small" />
            <Typography variant="subtitle1" fontWeight={500}>
              Catégories
            </Typography>
            {selectedScategories.length > 0 && (
              <Badge badgeContent={selectedScategories.length} color="secondary" sx={{ ml: 1 }} />
            )}
          </Box>
        </FilterAccordionSummary>
        <FilterAccordionDetails>
          <FormGroup>
            {scategories.map((scategorie) => {
              const count = counts.scategories[scategorie._id] || 0
              const isDisabled = count === 0
              const isSelected = selectedScategories.includes(scategorie._id)

              return (
                <StyledFormControlLabel
                  key={scategorie._id}
                  control={
                    <Checkbox
                      checked={isSelected}
                      onChange={() => toggleFilter("scategorie", scategorie._id)}
                      disabled={isDisabled}
                      size="small"
                      color="secondary"
                      icon={
                        <Box
                          sx={{ width: 18, height: 18, border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}
                        />
                      }
                      checkedIcon={
                        <Box
                          sx={{
                            width: 18,
                            height: 18,
                            backgroundColor: theme.palette.secondary.main,
                            borderRadius: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <CheckIcon sx={{ fontSize: 14, color: "white" }} />
                        </Box>
                      }
                    />
                  }
                  label={
                    <>
                      <span>{scategorie.nomscategorie}</span>
                      <CountChip
                        label={count}
                        size="small"
                        count={count}
                        variant={isSelected ? "filled" : "outlined"}
                        color="secondary"
                      />
                    </>
                  }
                  disabled={isDisabled}
                />
              )
            })}
          </FormGroup>
        </FilterAccordionDetails>
      </FilterAccordion>

      {/* Informations sur les filtres */}
      <Box sx={{ mt: 3, pt: 2, borderTop: `1px dashed ${theme.palette.divider}` }}>
        <Typography variant="body2" color="text.secondary" align="center">
          {initialProducts.length} produits disponibles
        </Typography>
        {hasActiveFilters && (
          <Typography variant="body2" color="primary" align="center" sx={{ mt: 1 }}>
            {prevFilteredProductsRef.current.length} produits correspondent à vos filtres
          </Typography>
        )}
      </Box>
    </FilterPaper>
  )
}

export default FilterSidebar
