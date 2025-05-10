"use client"

import { useState, useRef, useEffect } from "react"
import { Box, Typography, Paper, Tabs, Tab, Grid, Card, CardContent, Divider, styled, useTheme } from "@mui/material"
import {
  TrendingUp,
  CalendarToday,
  DateRange,
  EventNote,
  AttachMoney,
  ShoppingCart,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

// Composant de graphique personnalisé utilisant directement Chart.js
const LineChart = ({ data, options, height }) => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (chartRef.current) {
      // Détruire le graphique précédent s'il existe
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const ctx = chartRef.current.getContext("2d")
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: data,
        options: options,
      })
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, options])

  return <canvas ref={chartRef} height={height} />
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  overflow: "hidden",
}))

const StyledCard = styled(Card)(({ theme }) => ({
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

const PercentageIndicator = styled(Box)(({ theme, ispositive }) => ({
  display: "flex",
  alignItems: "center",
  color: ispositive === "true" ? theme.palette.success.main : theme.palette.error.main,
  fontSize: "0.875rem",
  fontWeight: 500,
}))

const RevenueStats = ({ orders }) => {
  const theme = useTheme()
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  // Fonction pour calculer les statistiques de chiffre d'affaires
  const calculateRevenueStats = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    // Début de la semaine (lundi)
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1))

    // Début de la semaine dernière
    const startOfLastWeek = new Date(startOfWeek)
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7)

    // Début du mois
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    // Début du mois dernier
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)

    // Fin du mois dernier
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)

    // Filtrer les commandes non annulées
    const validOrders = orders.filter((order) => order.statut !== "annulee")

    // Chiffre d'affaires aujourd'hui
    const todayRevenue = validOrders
      .filter((order) => {
        const orderDate = new Date(order.createdAt)
        return orderDate >= today
      })
      .reduce((sum, order) => sum + (order.total || 0), 0)

    // Chiffre d'affaires hier
    const yesterdayRevenue = validOrders
      .filter((order) => {
        const orderDate = new Date(order.createdAt)
        return orderDate >= yesterday && orderDate < today
      })
      .reduce((sum, order) => sum + (order.total || 0), 0)

    // Chiffre d'affaires cette semaine
    const thisWeekRevenue = validOrders
      .filter((order) => {
        const orderDate = new Date(order.createdAt)
        return orderDate >= startOfWeek
      })
      .reduce((sum, order) => sum + (order.total || 0), 0)

    // Chiffre d'affaires semaine dernière
    const lastWeekRevenue = validOrders
      .filter((order) => {
        const orderDate = new Date(order.createdAt)
        return orderDate >= startOfLastWeek && orderDate < startOfWeek
      })
      .reduce((sum, order) => sum + (order.total || 0), 0)

    // Chiffre d'affaires ce mois
    const thisMonthRevenue = validOrders
      .filter((order) => {
        const orderDate = new Date(order.createdAt)
        return orderDate >= startOfMonth
      })
      .reduce((sum, order) => sum + (order.total || 0), 0)

    // Chiffre d'affaires mois dernier
    const lastMonthRevenue = validOrders
      .filter((order) => {
        const orderDate = new Date(order.createdAt)
        return orderDate >= startOfLastMonth && orderDate < startOfMonth
      })
      .reduce((sum, order) => sum + (order.total || 0), 0)

    // Nombre de commandes aujourd'hui
    const todayOrders = validOrders.filter((order) => {
      const orderDate = new Date(order.createdAt)
      return orderDate >= today
    }).length

    // Nombre de commandes cette semaine
    const thisWeekOrders = validOrders.filter((order) => {
      const orderDate = new Date(order.createdAt)
      return orderDate >= startOfWeek
    }).length

    // Nombre de commandes ce mois
    const thisMonthOrders = validOrders.filter((order) => {
      const orderDate = new Date(order.createdAt)
      return orderDate >= startOfMonth
    }).length

    // Calcul des variations en pourcentage
    const dailyChange = yesterdayRevenue === 0 ? 100 : ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100

    const weeklyChange = lastWeekRevenue === 0 ? 100 : ((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100

    const monthlyChange =
      lastMonthRevenue === 0 ? 100 : ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100

    // Données pour les graphiques
    const dailyData = prepareDailyChartData(validOrders)
    const weeklyData = prepareWeeklyChartData(validOrders)
    const monthlyData = prepareMonthlyChartData(validOrders)

    return {
      daily: {
        revenue: todayRevenue,
        previousRevenue: yesterdayRevenue,
        change: dailyChange,
        orders: todayOrders,
        chartData: dailyData,
      },
      weekly: {
        revenue: thisWeekRevenue,
        previousRevenue: lastWeekRevenue,
        change: weeklyChange,
        orders: thisWeekOrders,
        chartData: weeklyData,
      },
      monthly: {
        revenue: thisMonthRevenue,
        previousRevenue: lastMonthRevenue,
        change: monthlyChange,
        orders: thisMonthOrders,
        chartData: monthlyData,
      },
    }
  }

  // Préparer les données pour le graphique journalier (dernières 24 heures)
  const prepareDailyChartData = (orders) => {
    const now = new Date()
    const hours = []
    const revenueData = []

    // Générer les 24 dernières heures
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now)
      hour.setHours(now.getHours() - i, 0, 0, 0)
      const hourLabel = hour.getHours().toString().padStart(2, "0") + "h"
      hours.push(hourLabel)

      // Filtrer les commandes pour cette heure
      const hourStart = new Date(hour)
      const hourEnd = new Date(hour)
      hourEnd.setHours(hourEnd.getHours() + 1)

      const hourRevenue = orders
        .filter((order) => {
          const orderDate = new Date(order.createdAt)
          return orderDate >= hourStart && orderDate < hourEnd && order.statut !== "annulee"
        })
        .reduce((sum, order) => sum + (order.total || 0), 0)

      revenueData.push(hourRevenue)
    }

    return {
      labels: hours,
      datasets: [
        {
          label: "Chiffre d'affaires (DT)",
          data: revenueData,
          borderColor: "#1976d2",
          backgroundColor: "rgba(25, 118, 210, 0.1)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#1976d2",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
      ],
    }
  }

  // Préparer les données pour le graphique hebdomadaire (7 derniers jours)
  const prepareWeeklyChartData = (orders) => {
    const now = new Date()
    const days = []
    const revenueData = []

    // Générer les 7 derniers jours
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now)
      day.setDate(now.getDate() - i)
      day.setHours(0, 0, 0, 0)

      const dayLabel = day.toLocaleDateString("fr-FR", { weekday: "short" })
      days.push(dayLabel)

      // Filtrer les commandes pour ce jour
      const dayStart = new Date(day)
      const dayEnd = new Date(day)
      dayEnd.setDate(dayEnd.getDate() + 1)

      const dayRevenue = orders
        .filter((order) => {
          const orderDate = new Date(order.createdAt)
          return orderDate >= dayStart && orderDate < dayEnd && order.statut !== "annulee"
        })
        .reduce((sum, order) => sum + (order.total || 0), 0)

      revenueData.push(dayRevenue)
    }

    return {
      labels: days,
      datasets: [
        {
          label: "Chiffre d'affaires (DT)",
          data: revenueData,
          borderColor: "#4caf50",
          backgroundColor: "rgba(76, 175, 80, 0.1)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#4caf50",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
      ],
    }
  }

  // Préparer les données pour le graphique mensuel (30 derniers jours)
  const prepareMonthlyChartData = (orders) => {
    const now = new Date()
    const days = []
    const revenueData = []

    // Générer les 30 derniers jours
    for (let i = 29; i >= 0; i--) {
      const day = new Date(now)
      day.setDate(now.getDate() - i)
      day.setHours(0, 0, 0, 0)

      const dayLabel =
        day.getDate().toString().padStart(2, "0") + "/" + (day.getMonth() + 1).toString().padStart(2, "0")
      days.push(dayLabel)

      // Filtrer les commandes pour ce jour
      const dayStart = new Date(day)
      const dayEnd = new Date(day)
      dayEnd.setDate(dayEnd.getDate() + 1)

      const dayRevenue = orders
        .filter((order) => {
          const orderDate = new Date(order.createdAt)
          return orderDate >= dayStart && orderDate < dayEnd && order.statut !== "annulee"
        })
        .reduce((sum, order) => sum + (order.total || 0), 0)

      revenueData.push(dayRevenue)
    }

    return {
      labels: days,
      datasets: [
        {
          label: "Chiffre d'affaires (DT)",
          data: revenueData,
          borderColor: "#9c27b0",
          backgroundColor: "rgba(156, 39, 176, 0.1)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#9c27b0",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
      ],
    }
  }

  const stats = calculateRevenueStats()

  // Options communes pour les graphiques
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        padding: 10,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 14,
        },
        callbacks: {
          label: (context) => `${context.parsed.y.toFixed(3)} DT`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 11,
          },
          callback: (value) => value.toFixed(0) + " DT",
        },
      },
    },
  }

  return (
    <StyledPaper>
      <Box sx={{ p: 2, backgroundColor: "#f8f9fa", borderBottom: "1px solid #e0e0e0" }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600, display: "flex", alignItems: "center" }}>
          <TrendingUp sx={{ mr: 1, color: "#1976d2" }} />
          Chiffre d'affaires
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.9rem",
            },
          }}
        >
          <Tab icon={<CalendarToday fontSize="small" />} label="Aujourd'hui" iconPosition="start" sx={{ py: 1.5 }} />
          <Tab icon={<DateRange fontSize="small" />} label="Cette semaine" iconPosition="start" sx={{ py: 1.5 }} />
          <Tab icon={<EventNote fontSize="small" />} label="Ce mois" iconPosition="start" sx={{ py: 1.5 }} />
        </Tabs>
      </Box>

      <Box sx={{ p: 3 }}>
        {/* Contenu de l'onglet Aujourd'hui */}
        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <StatIconWrapper bgcolor="#1976d2">
                      <AttachMoney />
                    </StatIconWrapper>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Chiffre d'affaires aujourd'hui
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {stats.daily.revenue.toFixed(3)} DT
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 1.5 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      Par rapport à hier
                    </Typography>
                    <PercentageIndicator ispositive={(stats.daily.change >= 0).toString()}>
                      {stats.daily.change >= 0 ? (
                        <ArrowUpward fontSize="small" sx={{ mr: 0.5 }} />
                      ) : (
                        <ArrowDownward fontSize="small" sx={{ mr: 0.5 }} />
                      )}
                      {Math.abs(stats.daily.change).toFixed(1)}%
                    </PercentageIndicator>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <StatIconWrapper bgcolor="#ff9800">
                      <ShoppingCart />
                    </StatIconWrapper>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Commandes aujourd'hui
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {stats.daily.orders}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 1.5 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      Panier moyen
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {stats.daily.orders > 0 ? (stats.daily.revenue / stats.daily.orders).toFixed(3) : "0.000"} DT
                    </Typography>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <StatIconWrapper bgcolor="#4caf50">
                      <CalendarToday />
                    </StatIconWrapper>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Hier
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {stats.daily.previousRevenue.toFixed(3)} DT
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 1.5 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      Différence
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      color={stats.daily.revenue >= stats.daily.previousRevenue ? "success.main" : "error.main"}
                    >
                      {(stats.daily.revenue - stats.daily.previousRevenue).toFixed(3)} DT
                    </Typography>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ height: 300, mt: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                  Chiffre d'affaires par heure (dernières 24h)
                </Typography>
                <LineChart data={stats.daily.chartData} options={chartOptions} height={300} />
              </Box>
            </Grid>
          </Grid>
        )}

        {/* Contenu de l'onglet Cette semaine */}
        {tabValue === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <StatIconWrapper bgcolor="#4caf50">
                      <AttachMoney />
                    </StatIconWrapper>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Chiffre d'affaires cette semaine
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {stats.weekly.revenue.toFixed(3)} DT
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 1.5 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      Par rapport à la semaine dernière
                    </Typography>
                    <PercentageIndicator ispositive={(stats.weekly.change >= 0).toString()}>
                      {stats.weekly.change >= 0 ? (
                        <ArrowUpward fontSize="small" sx={{ mr: 0.5 }} />
                      ) : (
                        <ArrowDownward fontSize="small" sx={{ mr: 0.5 }} />
                      )}
                      {Math.abs(stats.weekly.change).toFixed(1)}%
                    </PercentageIndicator>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <StatIconWrapper bgcolor="#ff9800">
                      <ShoppingCart />
                    </StatIconWrapper>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Commandes cette semaine
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {stats.weekly.orders}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 1.5 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      Panier moyen
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {stats.weekly.orders > 0 ? (stats.weekly.revenue / stats.weekly.orders).toFixed(3) : "0.000"} DT
                    </Typography>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <StatIconWrapper bgcolor="#9c27b0">
                      <DateRange />
                    </StatIconWrapper>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Semaine dernière
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {stats.weekly.previousRevenue.toFixed(3)} DT
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 1.5 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      Différence
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      color={stats.weekly.revenue >= stats.weekly.previousRevenue ? "success.main" : "error.main"}
                    >
                      {(stats.weekly.revenue - stats.weekly.previousRevenue).toFixed(3)} DT
                    </Typography>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ height: 300, mt: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                  Chiffre d'affaires par jour (7 derniers jours)
                </Typography>
                <LineChart data={stats.weekly.chartData} options={chartOptions} height={300} />
              </Box>
            </Grid>
          </Grid>
        )}

        {/* Contenu de l'onglet Ce mois */}
        {tabValue === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <StatIconWrapper bgcolor="#9c27b0">
                      <AttachMoney />
                    </StatIconWrapper>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Chiffre d'affaires ce mois
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {stats.monthly.revenue.toFixed(3)} DT
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 1.5 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      Par rapport au mois dernier
                    </Typography>
                    <PercentageIndicator ispositive={(stats.monthly.change >= 0).toString()}>
                      {stats.monthly.change >= 0 ? (
                        <ArrowUpward fontSize="small" sx={{ mr: 0.5 }} />
                      ) : (
                        <ArrowDownward fontSize="small" sx={{ mr: 0.5 }} />
                      )}
                      {Math.abs(stats.monthly.change).toFixed(1)}%
                    </PercentageIndicator>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <StatIconWrapper bgcolor="#ff9800">
                      <ShoppingCart />
                    </StatIconWrapper>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Commandes ce mois
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {stats.monthly.orders}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 1.5 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      Panier moyen
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {stats.monthly.orders > 0 ? (stats.monthly.revenue / stats.monthly.orders).toFixed(3) : "0.000"}{" "}
                      DT
                    </Typography>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <StatIconWrapper bgcolor="#1976d2">
                      <EventNote />
                    </StatIconWrapper>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Mois dernier
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {stats.monthly.previousRevenue.toFixed(3)} DT
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 1.5 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      Différence
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      color={stats.monthly.revenue >= stats.monthly.previousRevenue ? "success.main" : "error.main"}
                    >
                      {(stats.monthly.revenue - stats.monthly.previousRevenue).toFixed(3)} DT
                    </Typography>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ height: 300, mt: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                  Chiffre d'affaires par jour (30 derniers jours)
                </Typography>
                <LineChart data={stats.monthly.chartData} options={chartOptions} height={300} />
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
    </StyledPaper>
  )
}

export default RevenueStats
