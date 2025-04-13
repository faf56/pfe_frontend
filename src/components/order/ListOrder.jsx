"use client"

import { useEffect, useState } from "react"
import AfficheOrder from "./AfficheOrder"
import OrderFilter from "./OrderFilters"
import { CircularProgress, Box, Typography, Paper, Button, styled } from "@mui/material"
import { RefreshOutlined } from "@mui/icons-material"
import { fetchOrders, updateOrderStatus } from "../../service/orderservice"

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

const ActionButton = styled(Button)(({ color = "#1976d2", bgcolor = "rgba(25, 118, 210, 0.1)" }) => ({
  borderRadius: "8px",
  textTransform: "none",
  backgroundColor: bgcolor,
  color: color,
  fontWeight: 500,
  padding: "8px 16px",
  "&:hover": {
    backgroundColor: bgcolor === "rgba(25, 118, 210, 0.1)" ? "rgba(25, 118, 210, 0.2)" : bgcolor,
  },
}))

const Listorder = () => {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(true)

  const getOrders = async () => {
    try {
      setIsPending(true)
      const ordersRes = await fetchOrders()
      setOrders(ordersRes.data)
      setFilteredOrders(ordersRes.data)
    } catch (error) {
      console.log(error)
      setError(error)
    } finally {
      setIsPending(false)
    }
  }

  useEffect(() => {
    getOrders()
  }, [])

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, statut: newStatus } : order
      ))
      setFilteredOrders(filteredOrders.map(order =>
        order._id === orderId ? { ...order, statut: newStatus } : order
      ))
    } catch (error) {
      console.log(error)
      alert("Erreur lors de la mise à jour du statut")
    }
  }

  const handleFilterChange = (filters) => {
    let result = [...orders]

    // Filtrer par statut
    if (filters.status !== "all") {
      result = result.filter(order => order.statut === filters.status)
    }

    // Filtrer par date
    if (filters.dateRange) {
      const [startDate, endDate] = filters.dateRange
      result = result.filter(order => {
        const orderDate = new Date(order.createdAt)
        return orderDate >= startDate && orderDate <= endDate
      })
    }

    // Recherche par ID ou nom client
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(order =>
        order._id.toLowerCase().includes(searchLower) ||
        (order.userID?.firstname?.toLowerCase()?.includes(searchLower) ?? false) ||
        (order.userID?.lastname?.toLowerCase()?.includes(searchLower) ?? false)
      )
    }

    setFilteredOrders(result)
  }

  const handlePrintOrder = (orderId) => {
    window.open(`/orders/${orderId}/print`, '_blank')
  }

  return (
    <Box sx={{ padding: "24px" }}>
      <PageHeader>
        <HeaderTitle>
          <Typography variant="h4" sx={{ fontWeight: 600, color: "#333" }}>
            Gestion des Commandes
          </Typography>
        </HeaderTitle>

        <Box sx={{ display: "flex", gap: 2 }}>
          <ActionButton startIcon={<RefreshOutlined />} onClick={getOrders}>
            Actualiser
          </ActionButton>
        </Box>
      </PageHeader>

      <Box sx={{ my: 3 }}>
        <OrderFilter onFilterChange={handleFilterChange} orders={orders} />
      </Box>

      {isPending ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
          <CircularProgress color="primary" size={60} />
        </Box>
      ) : error ? (
        <Paper
          sx={{
            p: 3,
            borderRadius: "12px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            border: "1px solid #ffcdd2",
          }}
        >
          <Typography variant="h6">Erreur lors du chargement des commandes</Typography>
          <Typography variant="body2">
            {error.message || "Une erreur s'est produite. Veuillez réessayer plus tard."}
          </Typography>
        </Paper>
      ) : (
        <AfficheOrder
          orders={filteredOrders}
          onUpdateStatus={handleUpdateOrderStatus}
          onPrintOrder={handlePrintOrder}
        />
      )}
    </Box>
  )
}

export default Listorder
