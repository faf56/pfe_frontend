"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom"
import { useCart } from "react-use-cart"
import { fetchproduitById, fetchProduitsByCategorie } from "../service/produitservice"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CancelIcon from "@mui/icons-material/Cancel"
import LocalOfferIcon from "@mui/icons-material/LocalOffer"
import Card from "../components/card/Card"
import { Row, Col, Carousel } from "react-bootstrap"
import { addToFavorites, removeFromFavorites, checkIsFavorite } from "../service/favoriteService"
// Ajouter ces imports en haut du fichier
import CartNotification from "../components/notifications/CartNotification"

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
  Link,
} from "@mui/material"

// Icons
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import FavoriteIcon from "@mui/icons-material/Favorite"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
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
  const navigate = useNavigate()
  const { addItem, getItem, updateItemQuantity, cartTotal, items } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const [similarProducts, setSimilarProducts] = useState([])
  const [loadingSimilar, setLoadingSimilar] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  // Ajouter cet état après les autres déclarations d'état
  const [showNotification, setShowNotification] = useState(false)
  const [addedProduct, setAddedProduct] = useState(null)

  const cartItem = getItem(id)
  const [quantity, setQuantity] = useState(cartItem ? cartItem.quantity : 1)

  // Charger les détails du produit
  useEffect(() => {
    if (!id) return

    const fetchProductDetails = async () => {
      try {
        setLoading(true)
        const response = await fetchproduitById(id)
        console.log("Réponse API:", response.data)
        setProduct(response.data)

        // Synchronisation stricte avec le panier
        const existingItem = getItem(id)
        if (existingItem) {
          setQuantity(existingItem.quantity) // Prend la quantité du panier
        } else {
          setQuantity(1) // Réinitialise à 1 si absent du panier
        }

        // Récupérer les produits similaires si le produit a une catégorie
        if (response.data.categorieID?._id) {
          fetchSimilarProductsData(response.data.categorieID._id, response.data._id)
        }
        // Si pas de categorieID, essayer avec scategorieID
        else if (response.data.scategorieID?.categorieID?._id) {
          fetchSimilarProductsData(response.data.scategorieID.categorieID._id, response.data._id)
        }
      } catch (err) {
        setError("Erreur de chargement")
      } finally {
        setLoading(false)
      }
    }

    fetchProductDetails()
  }, [id, getItem])

  // Vérifier si le produit est dans les favoris
  useEffect(() => {
    if (product?._id) {
      const checkFavoriteStatus = async () => {
        const status = await checkIsFavorite(product._id)
        setIsFavorite(status)
      }

      checkFavoriteStatus()

      // Écouter les changements de favoris
      const handleFavoritesChanged = async () => {
        const status = await checkIsFavorite(product._id)
        setIsFavorite(status)
      }

      window.addEventListener("favoritesChanged", handleFavoritesChanged)
      window.addEventListener("userLogin", handleFavoritesChanged)

      return () => {
        window.removeEventListener("favoritesChanged", handleFavoritesChanged)
        window.removeEventListener("userLogin", handleFavoritesChanged)
      }
    }
  }, [product?._id])

  // Modifier la fonction toggleFavorite pour vérifier l'authentification
  const toggleFavorite = async () => {
    if (isProcessing) return

    // Vérifier si l'utilisateur est connecté
    const isAuthenticated = localStorage.getItem("CC_Token") !== null && localStorage.getItem("user") !== null
    if (!isAuthenticated) {
      // Stocker l'URL actuelle pour rediriger l'utilisateur après la connexion
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname)
      // Rediriger vers la page de connexion
      navigate("/login")
      return
    }

    setIsProcessing(true)

    try {
      if (isFavorite) {
        await removeFromFavorites(product._id)
      } else {
        await addToFavorites(product._id)
      }

      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error("Erreur lors de la modification des favoris:", error)
    } finally {
      setIsProcessing(false)
    }
  }

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
  const handleQuantityChange = (e) => {
    const value = e.target.value
    const newQuantity = Number.parseInt(value, 10)

    if (!isNaN(newQuantity) && newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    } else if (value === "") {
      setQuantity(1) // Valeur par défaut si champ vide
    }
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

  // Remplacer la fonction handleAddToCart par celle-ci
  const handleAddToCart = (e) => {
    e.preventDefault() // Empêche le rechargement
    if (!product) return

    // Créez un objet cartItem avec la quantité actuelle
    const cartItem = {
      id: product._id,
      name: product.title, // react-use-cart utilise name au lieu de title
      price: Number(finalPrice), // react-use-cart utilise price au lieu de prix
      prixOriginal: Number(product.prix), // Garder pour référence
      prixPromo: hasPromo ? Number(product.prixPromo) : null,
      hasPromo: hasPromo,
      image: product.imagepro,
      marque: product.marqueID?.nommarque,
      qtestock: product.stock,
    }

    // Ajoutez l'article avec la quantité correcte
    addItem(cartItem, quantity)

    // Préparer les données pour la notification
    setAddedProduct({ ...cartItem, quantity: quantity })

    // Afficher la notification
    setShowNotification(true)
  }

  // Ajouter cette fonction pour fermer la notification
  const closeNotification = () => {
    setShowNotification(false)
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
  const similarProductChunks = chunkArray(similarProducts, 4)

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
            <Link component={RouterLink}  underline="hover" color="inherit">
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
                          onChange={handleQuantityChange}
                          type="number"
                          inputProps={{
                            min: 1,
                            max: product.stock,
                            style: { textAlign: "center", width: "60px" },
                          }}
                          onBlur={() => {
                            if (quantity < 1) setQuantity(1)
                            if (quantity > product.stock) setQuantity(product.stock)
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

                    <IconButton
                      color={isFavorite ? "error" : "default"}
                      aria-label="Ajouter aux favoris"
                      onClick={toggleFavorite}
                      disabled={isProcessing}
                    >
                      {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
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
      <div className="memcategorie-container">
        <h2 className="title">Produit Meme Categorie</h2>

        {loadingSimilar ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Chargement des produits similaires...</p>
          </div>
        ) : similarProducts.length === 0 ? (
          <div className="no-products">
            <p>Aucun autre produit dans cette catégorie pour le moment</p>
          </div>
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
      </div>
      {/* Ajouter ce composant juste avant la fermeture de la balise <> à la fin du composant */}
      {/* Juste avant </> à la fin du composant */}
      <CartNotification
        open={showNotification}
        onClose={closeNotification}
        product={addedProduct}
        quantity={quantity}
        cartTotal={{
          items: items?.length + (getItem(id) ? 0 : 1),
          subtotal: cartTotal + quantity * (addedProduct?.price || 0),
          shipping: 7.0,
          total: cartTotal + quantity * (addedProduct?.price || 0) + 7.0,
        }}
      />
    </>
  )
}

export default ProductDetail
