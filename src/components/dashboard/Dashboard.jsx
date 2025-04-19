"use client"

import { useEffect, useState } from "react"
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Button,
  styled,
  useTheme,
} from "@mui/material"
import {
  TrendingUp,
  ShoppingCart,
  People,
  Inventory,
  AttachMoney,
  Category,
  Storefront,
  LocalShipping,
  CheckCircle,
  Cancel,
  Refresh,
  Dashboard as DashboardIcon,
} from "@mui/icons-material"
import { fetchOrders } from "../../service/orderservice"
import { fetchproduits } from "../../service/produitservice"
import { fetchUsers } from "../../service/userservice"
import { fetchscategories } from "../../service/scategorieservice"
import { fetchmarques } from "../../service/marqueservice"
import SalesChart from "./SalesChart"
import OrderStatusChart from "./OrderStatusChart"
import TopSellingProducts from "./TopSellingProducts"
import RecentOrders from "./RecentOrders"
import StockAlerts from "./StockAlerts"

// Styled components
const PageHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
}))

const HeaderTitle = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "16px",
}))

const StatCard = styled(Card)(({ theme }) => ({
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  height: "100%",
}))

const StatIconWrapper = styled(Box)(({ theme, bgcolor }) => ({
  width: "48px",
  height: "48px",
  borderRadius: "12px",
  backgroundColor: bgcolor,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
}))

const ChartContainer = styled(Paper)(({ theme }) => ({
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  height: "100%",
}))

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "300px",
}))

const Dashboard = () => {
  const theme = useTheme()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dashboardData, setDashboardData] = useState({
    orders: [],
    products: [],
    users: [],
    categories: [],
    brands: [],
  })

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [ordersRes, productsRes, usersRes, categoriesRes, brandsRes] = await Promise.all([
        fetchOrders(),
        fetchproduits(),
        fetchUsers(),
        fetchscategories(),
        fetchmarques(),
      ])

      setDashboardData({
        orders: ordersRes.data,
        products: productsRes.data,
        users: usersRes.data,
        categories: categoriesRes.data,
        brands: brandsRes.data,
      })
    } catch (error) {
      console.error("Erreur lors du chargement des données du tableau de bord:", error)
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  // Calcul des statistiques
  const calculateStats = () => {
    const { orders, products, users, categories, brands } = dashboardData

    // Statistiques des commandes
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
    const pendingOrders = orders.filter((order) => order.statut === "en_attente").length
    const shippedOrders = orders.filter((order) => order.statut === "expediee").length
    const completedOrders = orders.filter((order) => order.statut === "livree").length
    const cancelledOrders = orders.filter((order) => order.statut === "annulee").length

    // Statistiques des produits
    const totalProducts = products.length
    const lowStockProducts = products.filter((product) => product.stock > 0 && product.stock <= 10).length
    const outOfStockProducts = products.filter((product) => product.stock === 0).length
    const productsOnPromo = products.filter(
      (product) => product.prixPromo && product.prixPromo > 0 && product.prixPromo < product.prix,
    ).length

    // Statistiques des utilisateurs
    const totalUsers = users.length
    const activeUsers = users.filter((user) => user.isActive).length
    const adminUsers = users.filter((user) => user.role === "admin").length

    // Statistiques des catégories et marques
    const totalCategories = categories.length
    const totalBrands = brands.length

    // Calcul des ventes par mois (6 derniers mois)
    const salesByMonth = calculateSalesByMonth(orders)

    // Top 5 des produits les plus vendus
    const topSellingProducts = calculateTopSellingProducts(orders, products)

    // Commandes récentes (5 dernières)
    const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

    // Produits avec stock faible
    const stockAlerts = products
      .filter((product) => product.stock <= 10)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5)

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      shippedOrders,
      completedOrders,
      cancelledOrders,
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      productsOnPromo,
      totalUsers,
      activeUsers,
      adminUsers,
      totalCategories,
      totalBrands,
      salesByMonth,
      topSellingProducts,
      recentOrders,
      stockAlerts,
    }
  }

  const calculateSalesByMonth = (orders) => {
    const now = new Date()
    const months = []
    const salesData = []

    // Générer les 6 derniers mois
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = month.toLocaleDateString("fr-FR", { month: "short" })
      months.push(monthName)

      // Filtrer les commandes pour ce mois
      const monthOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt)
        return (
          orderDate.getMonth() === month.getMonth() &&
          orderDate.getFullYear() === month.getFullYear() &&
          order.statut !== "annulee"
        )
      })

      // Calculer le total des ventes pour ce mois
      const monthTotal = monthOrders.reduce((sum, order) => sum + (order.total || 0), 0)
      salesData.push(monthTotal)
    }

    return { months, salesData }
  }

  const calculateTopSellingProducts = (orders, products) => {
    // Créer un map pour compter les ventes par produit
    const productSales = {}

    // Parcourir toutes les commandes non annulées
    orders
      .filter((order) => order.statut !== "annulee")
      .forEach((order) => {
        // Parcourir les produits de chaque commande
        order.produits?.forEach((item) => {
          const productId = item.produitID?._id || item.produitID
          if (productId) {
            if (!productSales[productId]) {
              productSales[productId] = {
                quantity: 0,
                revenue: 0,
              }
            }
            productSales[productId].quantity += item.quantite || 0
            productSales[productId].revenue += (item.prix || 0) * (item.quantite || 0)
          }
        })
      })

    // Convertir en tableau et trier par quantité vendue
    const topProducts = Object.keys(productSales)
      .map((productId) => {
        const product = products.find((p) => p._id === productId)
        return {
          id: productId,
          name: product?.title || "Produit inconnu",
          image: product?.imagepro || "",
          quantity: productSales[productId].quantity,
          revenue: productSales[productId].revenue,
        }
      })
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)

    return topProducts
  }

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress size={60} />
      </LoadingContainer>
    )
  }

  if (error) {
    return (
      <Paper
        sx={{
          p: 3,
          borderRadius: "12px",
          backgroundColor: "#ffebee",
          color: "#c62828",
          border: "1px solid #ffcdd2",
        }}
      >
        <Typography variant="h6" component="div">
          Erreur lors du chargement des données
        </Typography>
        <Typography variant="body2" component="div">
          {error.message || "Une erreur s'est produite. Veuillez réessayer plus tard."}
        </Typography>
        <Button variant="outlined" color="error" sx={{ mt: 2 }} startIcon={<Refresh />} onClick={loadDashboardData}>
          Réessayer
        </Button>
      </Paper>
    )
  }

  const stats = calculateStats()

  return (
    <Box sx={{ padding: "24px" }}>
      <PageHeader>
        <HeaderTitle>
          <DashboardIcon sx={{ fontSize: 32, color: "#1976d2" }} />
          <Box>
            <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: "#333" }}>
              Tableau de bord
            </Typography>
            <Typography variant="body2" component="div" color="text.secondary">
              Aperçu des performances de votre boutique Perlacoif
            </Typography>
          </Box>
        </HeaderTitle>

        <Button
          startIcon={<Refresh />}
          onClick={loadDashboardData}
          variant="outlined"
          sx={{
            borderRadius: "8px",
            textTransform: "none",
          }}
        >
          Actualiser
        </Button>
      </PageHeader>

      {/* Statistiques principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <StatIconWrapper bgcolor="#1976d2">
                <ShoppingCart />
              </StatIconWrapper>
              <Box>
                <Typography variant="body2" component="div" color="text.secondary">
                  Commandes
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                  {stats.totalOrders}
                </Typography>
              </Box>
            </CardContent>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <StatIconWrapper bgcolor="#4caf50">
                <AttachMoney />
              </StatIconWrapper>
              <Box>
                <Typography variant="body2" component="div" color="text.secondary">
                  Chiffre d'affaires
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                  {stats.totalRevenue.toFixed(3)} DT
                </Typography>
              </Box>
            </CardContent>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <StatIconWrapper bgcolor="#ff9800">
                <Inventory />
              </StatIconWrapper>
              <Box>
                <Typography variant="body2" component="div" color="text.secondary">
                  Produits
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                  {stats.totalProducts}
                </Typography>
              </Box>
            </CardContent>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <StatIconWrapper bgcolor="#9c27b0">
                <People />
              </StatIconWrapper>
              <Box>
                <Typography variant="body2" component="div" color="text.secondary">
                  Clients
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                  {stats.totalUsers}
                </Typography>
              </Box>
            </CardContent>
          </StatCard>
        </Grid>
      </Grid>

      {/* Graphiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <ChartContainer>
            <Typography variant="h6" component="div" sx={{ mb: 2, fontWeight: 600 }}>
              Évolution des ventes
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <SalesChart data={stats.salesByMonth} />
          </ChartContainer>
        </Grid>

        <Grid item xs={12} md={4}>
          <ChartContainer>
            <Typography variant="h6" component="div" sx={{ mb: 2, fontWeight: 600 }}>
              Statut des commandes
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <OrderStatusChart
              data={[
                { name: "En attente", value: stats.pendingOrders, color: "#ff9800" },
                { name: "Expédiées", value: stats.shippedOrders, color: "#2196f3" },
                { name: "Livrées", value: stats.completedOrders, color: "#4caf50" },
                { name: "Annulées", value: stats.cancelledOrders, color: "#f44336" },
              ]}
            />
          </ChartContainer>
        </Grid>
      </Grid>

      {/* Statistiques détaillées */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ mb: 2, fontWeight: 600 }}>
                Commandes
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body2"
                    component="div"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <ShoppingCart fontSize="small" sx={{ mr: 1, color: "#ff9800" }} /> En attente
                  </Typography>
                  <Typography variant="body2" component="div" fontWeight={500}>
                    {stats.pendingOrders}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body2"
                    component="div"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <LocalShipping fontSize="small" sx={{ mr: 1, color: "#2196f3" }} /> Expédiées
                  </Typography>
                  <Typography variant="body2" component="div" fontWeight={500}>
                    {stats.shippedOrders}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body2"
                    component="div"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <CheckCircle fontSize="small" sx={{ mr: 1, color: "#4caf50" }} /> Livrées
                  </Typography>
                  <Typography variant="body2" component="div" fontWeight={500}>
                    {stats.completedOrders}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body2"
                    component="div"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Cancel fontSize="small" sx={{ mr: 1, color: "#f44336" }} /> Annulées
                  </Typography>
                  <Typography variant="body2" component="div" fontWeight={500}>
                    {stats.cancelledOrders}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatCard>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ mb: 2, fontWeight: 600 }}>
                Produits
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body2"
                    component="div"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Category fontSize="small" sx={{ mr: 1, color: "#9c27b0" }} /> Catégories
                  </Typography>
                  <Typography variant="body2" component="div" fontWeight={500}>
                    {stats.totalCategories}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body2"
                    component="div"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Storefront fontSize="small" sx={{ mr: 1, color: "#3f51b5" }} /> Marques
                  </Typography>
                  <Typography variant="body2" component="div" fontWeight={500}>
                    {stats.totalBrands}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body2"
                    component="div"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <TrendingUp fontSize="small" sx={{ mr: 1, color: "#f44336" }} /> En promotion
                  </Typography>
                  <Typography variant="body2" component="div" fontWeight={500}>
                    {stats.productsOnPromo}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body2"
                    component="div"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Inventory fontSize="small" sx={{ mr: 1, color: "#ff9800" }} /> Stock faible
                  </Typography>
                  <Typography variant="body2" component="div" fontWeight={500}>
                    {stats.lowStockProducts}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatCard>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ mb: 2, fontWeight: 600 }}>
                Utilisateurs
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body2"
                    component="div"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <People fontSize="small" sx={{ mr: 1, color: "#9c27b0" }} /> Total
                  </Typography>
                  <Typography variant="body2" component="div" fontWeight={500}>
                    {stats.totalUsers}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body2"
                    component="div"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <CheckCircle fontSize="small" sx={{ mr: 1, color: "#4caf50" }} /> Actifs
                  </Typography>
                  <Typography variant="body2" component="div" fontWeight={500}>
                    {stats.activeUsers}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body2"
                    component="div"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Cancel fontSize="small" sx={{ mr: 1, color: "#f44336" }} /> Inactifs
                  </Typography>
                  <Typography variant="body2" component="div" fontWeight={500}>
                    {stats.totalUsers - stats.activeUsers}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body2"
                    component="div"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <People fontSize="small" sx={{ mr: 1, color: "#ff9800" }} /> Administrateurs
                  </Typography>
                  <Typography variant="body2" component="div" fontWeight={500}>
                    {stats.adminUsers}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatCard>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ mb: 2, fontWeight: 600 }}>
                Performance
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body2"
                    component="div"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <AttachMoney fontSize="small" sx={{ mr: 1, color: "#4caf50" }} /> CA moyen / commande
                  </Typography>
                  <Typography variant="body2" component="div" fontWeight={500}>
                    {stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(3) + " DT" : "0.000 DT"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body2"
                    component="div"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <TrendingUp fontSize="small" sx={{ mr: 1, color: "#2196f3" }} /> Taux de conversion
                  </Typography>
                  <Typography variant="body2" component="div" fontWeight={500}>
                    {stats.totalUsers > 0 ? Math.round((stats.totalOrders / stats.totalUsers) * 100) + "%" : "0%"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body2"
                    component="div"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <CheckCircle fontSize="small" sx={{ mr: 1, color: "#4caf50" }} /> Taux de livraison
                  </Typography>
                  <Typography variant="body2" component="div" fontWeight={500}>
                    {stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) + "%" : "0%"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body2"
                    component="div"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Cancel fontSize="small" sx={{ mr: 1, color: "#f44336" }} /> Taux d'annulation
                  </Typography>
                  <Typography variant="body2" component="div" fontWeight={500}>
                    {stats.totalOrders > 0 ? Math.round((stats.cancelledOrders / stats.totalOrders) * 100) + "%" : "0%"}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </StatCard>
        </Grid>
      </Grid>

      {/* Produits les plus vendus et commandes récentes */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TopSellingProducts products={stats.topSellingProducts} />
        </Grid>
        <Grid item xs={12} md={6}>
          <RecentOrders orders={stats.recentOrders} />
        </Grid>
      </Grid>

      {/* Alertes de stock */}
      <Box sx={{ mt: 3 }}>
        <StockAlerts products={stats.stockAlerts} />
      </Box>
    </Box>
  )
}

export default Dashboard
