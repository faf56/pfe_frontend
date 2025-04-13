
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useShoppingCart } from "use-shopping-cart"
import { fetchproduitById } from "../service/produitservice"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

// Material UI imports
import {
  Box,
  Button,
  Breadcrumbs,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Rating,
  Skeleton,
  Typography,
  TextField,
  Alert,
  Snackbar,
  Tabs,
  Tab,
} from "@mui/material"

// Icons
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import FavoriteIcon from "@mui/icons-material/Favorite"
import ShareIcon from "@mui/icons-material/Share"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import Link from "@mui/material/Link"

// Tab Panel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const ProductDetail = () => {
  const { id } = useParams()
  //console.log("ID depuis useParams:", id)
  const navigate = useNavigate()
  const { addItem, cartDetails, setItemQuantity } = useShoppingCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [tabValue, setTabValue] = useState(0)

  const cartItem = cartDetails[id] || null
  const [quantity, setQuantity] = useState(cartItem ? cartItem.quantity : 1)

  // Charger les détails du produit
  useEffect(() => {
    if (!id) {
      console.error("Erreur: ID du produit est undefined !")
      setError("ID du produit manquant")
      setLoading(false)
      // Optional: redirect to products page after a short delay
      setTimeout(() => navigate("/allproduct"), 2000)
      return
    }

    const fetchProductDetails = async () => {
      try {
        setLoading(true)
        const response = await fetchproduitById(id)
        console.log("Réponse API:", response.data)
        setProduct(response.data)
        if (cartDetails[id]) {
          setQuantity(cartDetails[id].quantity)
        }
      } catch (err) {
        console.error("Erreur lors du chargement du produit:", err)
        setError("Impossible de charger les détails du produit")
      } finally {
        setLoading(false)
      }
    }

    fetchProductDetails()
  }, [id, navigate, cartDetails])

  // Gérer le changement de quantité
  const handleQuantityChange = (newValue) => {
    const newQuantity = Number.parseInt(newValue)
    if (isNaN(newQuantity) || newQuantity < 1 || newQuantity > product.stock) return
    setQuantity(newQuantity)
  }
  // Incrémenter la quantité
  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  // Décrémenter la quantité
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  // Ajouter au panier
  const handleAddToCart = () => {
    if (!product) return

    const cartItem = {
      id: product._id,
      title: product.title,
      prix: Number(product.prix),
      image: product.imagepro,
      quantity: quantity,
      marque: product.marqueID?.nommarque,
      qtestock: product.stock,
    }

    addItem(cartItem)
    setSnackbarOpen(true)
  }

  // Gérer le changement d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  // Fermer le snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        Retour
      </Button>

      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link underline="hover" color="inherit" href="/">
          Accueil
        </Link>
        {product?.scategorieID?.nomscategorie  && (
          <Link underline="hover" color="inherit" href={`/categories/${product.scategorieID._id}`}>
            {product.scategorieID.nomscategorie}
          </Link>
        )}
        <Typography color="text.primary">{loading ? <Skeleton width={100} /> : product?.title}</Typography>
      </Breadcrumbs>

      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : loading ? (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" height={60} />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" height={40} sx={{ mt: 2 }} />
            <Skeleton variant="text" width="80%" height={100} sx={{ mt: 2 }} />
            <Skeleton variant="rectangular" height={50} sx={{ mt: 3 }} />
          </Grid>
        </Grid>
      ) : (
        <>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: "1px solid #eee",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={product.imagepro || "/placeholder.svg"}
                  alt={product.title}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "400px",
                    objectFit: "contain",
                  }}
                />
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box>
                {product?.marqueID?.nommarque && (
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    {product.marqueID.nommarque}
                  </Typography>
                )}

                <Typography variant="h4" component="h1" gutterBottom>
                  {product.title}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Rating value={4} readOnly />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    (12 avis)
                  </Typography>
                </Box>

                <Typography variant="h5" color="primary" sx={{ fontWeight: "bold", my: 2 }}>
                  {Number(product.prix).toFixed(3)} TND
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body1" paragraph>
                  {product.description}
                </Typography>

                <Box
  sx={{
    display: "flex",
    alignItems: "center",
    bgcolor: product.stock > 0 ? "#e8f5e9" : "#ffebee",
    p: 1,
    borderRadius: 1,
    mb: 3,
  }}
>
  {product.stock > 0 ? (
    <>
      <CheckCircleIcon fontSize="small" color="success" sx={{ mr: 1 }} />
      <Typography variant="body2" color="success.main">
        En stock
      </Typography>
    </>
  ) : (
    <>
      <CancelIcon fontSize="small" color="error" sx={{ mr: 1 }} />
      <Typography variant="body2" color="error.main">
        Rupture de stock
      </Typography>
    </>
  )}
</Box>

                {product.stock > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Quantité
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <IconButton
                        size="small"
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                      >
                        <RemoveIcon />
                      </IconButton>

                      <TextField
                        size="small"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(e.target.value)}
                        inputProps={{
                          min: 1,
                          max: product.stock,
                          style: { textAlign: "center", width: "40px" },
                        }}
                        variant="outlined"
                        sx={{ mx: 1 }}
                      />

                      <IconButton
                        size="small"
                        onClick={incrementQuantity}
                        disabled={quantity >= product.stock}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Box>
                )}

                <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<ShoppingCartIcon />}
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    sx={{ flex: 1 }}
                  >
                    Ajouter au panier
                  </Button>

                  <IconButton color="secondary" aria-label="Ajouter aux favoris">
                    <FavoriteIcon />
                  </IconButton>

                  <IconButton color="primary" aria-label="Partager">
                    <ShareIcon />
                  </IconButton>
                </Box>

                <Box sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocalShippingIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">Livraison disponible dans toute la Tunisie</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Retrait gratuit en magasin
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 6 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="product tabs" variant="fullWidth">
              <Tab label="Description" id="product-tab-0" />
              <Tab label="Caractéristiques" id="product-tab-1" />
              <Tab label="Avis" id="product-tab-2" />
            </Tabs>

            <Paper sx={{ mt: 1 }}>
              <TabPanel value={tabValue} index={0}>
                <Typography variant="body1">{product.description}</Typography>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Marque
                    </Typography>
                    <Typography variant="body1">{product.marqueID?.nommarque || "Non spécifié"}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Catégorie
                    </Typography>
                    <Typography variant="body1">{product.scategorieID?.nomscategorie || "Non spécifié"}</Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Référence
                    </Typography>
                    <Typography variant="body1">{product._id}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
  <Typography variant="subtitle1" fontWeight="bold">
    Stock
  </Typography>
  {product.stock > 0 ? (
    <Typography variant="body1" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
      <CheckCircleIcon fontSize="small" color="success" sx={{ mr: 1 }} />
      En stock
    </Typography>
  ) : (
    <Typography variant="body1" color="error.main" sx={{ display: 'flex', alignItems: 'center' }}>
      <CancelIcon fontSize="small" color="error" sx={{ mr: 1 }} />
      Rupture de stock
    </Typography>
  )}
</Grid>
                </Grid>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <Box sx={{ textAlign: "center", py: 2 }}>
                  <Typography variant="body1" color="text.secondary">
                    Aucun avis pour ce produit pour le moment.
                  </Typography>
                  <Button variant="outlined" sx={{ mt: 2 }}>
                    Soyez le premier à donner votre avis
                  </Button>
                </Box>
              </TabPanel>
            </Paper>
          </Box>
        </>
      )}

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          {product?.title} a été ajouté à votre panier!
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default ProductDetail

