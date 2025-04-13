import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShoppingCart } from 'use-shopping-cart';
import { fetchLivraisons } from '../service/livraisonservice';

// Material UI imports
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
  TextField,
  CircularProgress
} from '@mui/material';

// Icons
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const CartPage = () => {
  const navigate = useNavigate();
  const { 
    cartDetails, 
    removeItem, 
    clearCart, 
    incrementItem, 
    decrementItem, 
    setItemQuantity 
  } = useShoppingCart();
  
  const cartItems = Object.values(cartDetails);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Récupérer les méthodes de livraison depuis l'API
  useEffect(() => {
    const getShippingMethods = async () => {
      try {
        setLoading(true);
        const response = await fetchLivraisons();
        setShippingMethods(response.data);
      } catch (err) {
        console.error('Erreur lors du chargement des méthodes de livraison:', err);
        setError('Impossible de charger les méthodes de livraison');
      } finally {
        setLoading(false);
      }
    };

    getShippingMethods();
  }, []);
  
  // Calculer le sous-total
  const sousTotal = cartItems.reduce((total, item) => {
    return total + (item.prix * item.quantity);
  }, 0);

  // Gérer le changement de quantité directement
  const handleQuantityChange = (id, value) => {
    const quantity = parseInt(value);
    if (isNaN(quantity) || quantity < 1) return;
    setItemQuantity(id, quantity);
  };

  // Rediriger vers la page de checkout
  const handleCheckout = () => {
    navigate('/checkout');
  };

  // Fonction pour formater le prix avec vérification
  const formatPrice = (price) => {
    // Vérifier si price est défini et est un nombre
    if (price !== undefined && price !== null && !isNaN(Number(price))) {
      return Number(price).toFixed(3);
    }
    return '0.000'; // Valeur par défaut
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Retour
      </Button>

      <Typography variant="h4" component="h1" gutterBottom>
        <ShoppingCartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Mon Panier
      </Typography>

      {cartItems.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Votre panier est vide
          </Alert>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/')}
          >
            Continuer vos achats
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Produit</TableCell>
                    <TableCell align="center">Prix</TableCell>
                    <TableCell align="center">Quantité</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: 80, height: 80, mr: 2, overflow: 'hidden' }}>
                            <img 
                              src={item.image || "/placeholder.svg"} 
                              alt={item.title} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                          </Box>
                          <Box>
                            <Typography variant="subtitle1">{item.title}</Typography>
                            {item.marque && (
                              <Typography variant="body2" color="text.secondary">
                                {item.marque}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {formatPrice(item.prix)} TND
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IconButton 
                            size="small" 
                            onClick={() => decrementItem(item.id)}
                            disabled={item.quantity <= 1}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          
                          <TextField
                            size="small"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                            inputProps={{ 
                              min: 1, 
                              style: { textAlign: 'center', width: '40px' } 
                            }}
                            variant="outlined"
                            sx={{ mx: 1 }}
                          />
                          
                          <IconButton 
                            size="small" 
                            onClick={() => incrementItem(item.id)}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle2">
                          {formatPrice(item.prix * item.quantity)} TND
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          color="error" 
                          onClick={() => removeItem(item.id)}
                          aria-label="Supprimer"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                variant="outlined" 
                color="error" 
                onClick={() => clearCart()}
                startIcon={<DeleteIcon />}
              >
                Vider le panier
              </Button>
              
              <Button 
                variant="outlined" 
                onClick={() => navigate('/')}
              >
                Continuer vos achats
              </Button>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Récapitulatif de la commande
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Sous-total ({cartItems.length} article{cartItems.length > 1 ? 's' : ''}):</Typography>
                <Typography fontWeight="bold">{formatPrice(sousTotal)} TND</Typography>
              </Box>
              
              {/* Méthodes de livraison disponibles */}
              {/* <Box sx={{ mt: 3, mb: 2 }}>
                <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocalShippingIcon sx={{ mr: 1, fontSize: 20 }} />
                  Livraison disponible
                </Typography>
                
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : error ? (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {error}
                  </Alert>
                ) : shippingMethods.length > 0 ? (
                  <Box sx={{ pl: 2 }}>
                    {shippingMethods.slice(0, 2).map((method) => (
                      <Typography key={method._id} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        • {method.title}: {formatPrice(method.fee)} TND
                      </Typography>
                    ))}
                    {shippingMethods.length > 2 && (
                      <Typography variant="body2" color="text.secondary">
                        • Et plus d'options à l'étape suivante...
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Aucune méthode de livraison disponible
                  </Typography>
                )}
              </Box> */}
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Total estimé:</Typography>
                <Typography variant="h6">{formatPrice(sousTotal)} TND</Typography>
              </Box>
              
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                size="large"
                onClick={handleCheckout}
              >
                Passer à la caisse
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default CartPage;