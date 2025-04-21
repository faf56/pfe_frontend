"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom"
import { useShoppingCart } from "use-shopping-cart"
import { fetchproduitById, fetchProduitsByCategorie } from "../service/produitservice"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CancelIcon from "@mui/icons-material/Cancel"
import LocalOfferIcon from "@mui/icons-material/LocalOffer"
import Card from "../components/card/Card"
import { Row, Col, Carousel } from "react-bootstrap"

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
  Chip,
  CircularProgress,
  Link,
} from "@mui/material"

// Icons
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import FavoriteIcon from "@mui/icons-material/Favorite"
import ShareIcon from "@mui/icons-material/Share"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import StoreIcon from "@mui/icons-material/Store"

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
  const [similarProducts, setSimilarProducts] = useState([])
  const [loadingSimilar, setLoadingSimilar] = useState(false)

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

        // Récupérer les produits similaires si le produit a une catégorie
        // Vérifier d'abord si le produit a une catégorie principale (categorieID)
        if (response.data.categorieID?._id) {
          fetchSimilarProductsData(response.data.categorieID._id, response.data._id)
        }
        // Si pas de categorieID, essayer avec scategorieID
        else if (response.data.scategorieID?.categorieID?._id) {
          fetchSimilarProductsData(response.data.scategorieID.categorieID._id, response.data._id)
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

  // Fonction pour récupérer les produits similaires
  const fetchSimilarProductsData = async (categoryId, productId) => {
    if (!categoryId) return

    try {
      setLoadingSimilar(true)
      console.log("Récupération des produits de la catégorie:", categoryId)
      const response = await fetchProduitsByCategorie(categoryId)

      // Filtrer le produit actuel de la liste des produits similaires
      const filteredProducts = response.data.filter((product) => product._id !== productId)
      setSimilarProducts(filteredProducts)
      console.log("Produits similaires:", filteredProducts.length)
    } catch (error) {
      console.error("Erreur lors du chargement des produits similaires:", error)
    } finally {
      setLoadingSimilar(false)
    }
  }

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

  // Vérifier si le produit a un prix promotionnel
  const hasPromo =
    product &&
    product.prixPromo !== null &&
    product.prixPromo !== undefined &&
    product.prixPromo > 0 &&
    product.prixPromo < product.prix

  // Déterminer le prix final à utiliser
  const finalPrice = hasPromo ? product?.prixPromo : product?.prix

  // Ajouter au panier
  const handleAddToCart = () => {
    if (!product) return

    const cartItem = {
      id: product._id,
      title: product.title,
      prix: Number(finalPrice), // Utiliser le prix promotionnel si disponible
      prixOriginal: Number(product.prix), // Garder le prix original pour référence
      prixPromo: hasPromo ? Number(product.prixPromo) : null,
      hasPromo: hasPromo,
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

  // Calculer le pourcentage de réduction
  const calculateDiscount = () => {
    if (!hasPromo) return 0
    return Math.round(((product.prix - product.prixPromo) / product.prix) * 100)
  }

  // Fonction pour diviser le tableau en groupes
  const chunkArray = (array, size) => {
    const result = []
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size))
    }
    return result
  }

  // Préparer les chunks pour le carousel
  const similarProductChunks = chunkArray(similarProducts, 5)

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
          Retour
        </Button>

        {/* Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link component={RouterLink} to="/" underline="hover" color="inherit">
            Accueil
          </Link>
          {product?.scategorieID?.nomscategorie && (
            <Link
              component={RouterLink}
              to={`/categories/${product.scategorieID._id}`}
              underline="hover"
              color="inherit"
            >
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
                    position: "relative",
                  }}
                >
                  {hasPromo && (
                    <Chip
                      label={`-${calculateDiscount()}%`}
                      color="error"
                      size="small"
                      icon={<LocalOfferIcon />}
                      sx={{
                        position: "absolute",
                        top: 16,
                        left: 16,
                        fontWeight: "bold",
                      }}
                    />
                  )}
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
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <StoreIcon sx={{ mr: 1, fontSize: 20, color: "primary.main" }} />
                      <Link
                        component={RouterLink}
                        to={`/marques/${product.marqueID._id}`}
                        color="primary"
                        underline="hover"
                        sx={{
                          fontWeight: "medium",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        {product.marqueID.nommarque}
                      </Link>
                    </Box>
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

                  {/* Affichage du prix avec promotion si disponible */}
                  {hasPromo ? (
                    <Box sx={{ my: 2 }}>
                      <Typography
                        variant="h5"
                        color="error"
                        sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}
                      >
                        {Number(product.prixPromo).toFixed(3)} TND
                        <Chip label={`-${calculateDiscount()}%`} size="small" color="error" sx={{ ml: 2 }} />
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ textDecoration: "line-through", mt: 0.5 }}
                      >
                        Prix normal: {Number(product.prix).toFixed(3)} TND
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="h5" color="primary" sx={{ fontWeight: "bold", my: 2 }}>
                      {Number(product.prix).toFixed(3)} TND
                    </Typography>
                  )}

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
                        <IconButton size="small" onClick={decrementQuantity} disabled={quantity <= 1}>
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

                        <IconButton size="small" onClick={incrementQuantity} disabled={quantity >= product.stock}>
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
                      {product.marqueID ? (
                        <Link
                          component={RouterLink}
                          to={`/marques/${product.marqueID._id}`}
                          color="primary"
                          underline="hover"
                        >
                          {product.marqueID.nommarque}
                        </Link>
                      ) : (
                        <Typography variant="body1">Non spécifié</Typography>
                      )}
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
                        <Typography variant="body1" color="success.main" sx={{ display: "flex", alignItems: "center" }}>
                          <CheckCircleIcon fontSize="small" color="success" sx={{ mr: 1 }} />
                          En stock
                        </Typography>
                      ) : (
                        <Typography variant="body1" color="error.main" sx={{ display: "flex", alignItems: "center" }}>
                          <CancelIcon fontSize="small" color="error" sx={{ mr: 1 }} />
                          Rupture de stock
                        </Typography>
                      )}
                    </Grid>

                    {/* Afficher les informations de prix */}
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Prix
                      </Typography>
                      <Typography variant="body1">{Number(product.prix).toFixed(3)} TND</Typography>
                    </Grid>

                    {hasPromo && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Prix promotionnel
                        </Typography>
                        <Typography variant="body1" color="error.main" sx={{ display: "flex", alignItems: "center" }}>
                          <LocalOfferIcon fontSize="small" color="error" sx={{ mr: 1 }} />
                          {Number(product.prixPromo).toFixed(3)} TND (-{calculateDiscount()}%)
                        </Typography>
                      </Grid>
                    )}
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

      {/* Section des produits de la même catégorie */}
      {!loading && product && similarProducts.length > 0 && (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{ textAlign: "center", fontWeight: "bold", mb: 3, letterSpacing: "2px" }}
            >
              P R O D U I T S &nbsp; D E &nbsp; L A &nbsp; M Ê M E &nbsp; C A T É G O R I E
            </Typography>

            {loadingSimilar ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Carousel indicators={false} interval={3000}>
                {similarProductChunks.map((chunk, index) => (
                  <Carousel.Item key={index}>
                    <Row className="card-container display-center">
                      {chunk.map((pro) => (
                        <Col key={pro._id}>
                          <Card
                            _id={pro._id}
                            imagepro={pro.imagepro}
                            title={pro.title}
                            description={pro.description}
                            prix={pro.prix}
                            prixPromo={pro.prixPromo}
                            stock={pro.stock}
                            marqueID={pro.marqueID}
                          />
                        </Col>
                      ))}
                    </Row>
                  </Carousel.Item>
                ))}
              </Carousel>
            )}
          </Box>
        </Container>
      )}

      {/* Message si aucun produit similaire n'est trouvé */}
      {!loading && product && !loadingSimilar && similarProducts.length === 0 && (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{ fontWeight: "bold", mb: 3, letterSpacing: "2px" }}
            >
              P R O D U I T S &nbsp; D E &nbsp; L A &nbsp; M Ê M E &nbsp; C A T É G O R I E
            </Typography>
            <Paper sx={{ p: 4, bgcolor: "#f9f9f9" }}>
              <Typography variant="body1" color="text.secondary">
                Aucun autre produit dans cette catégorie pour le moment.
              </Typography>
            </Paper>
          </Box>
        </Container>
      )}
    </>
  )
}

export default ProductDetail
