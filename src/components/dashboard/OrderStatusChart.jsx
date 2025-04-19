"use client"

import { useEffect, useRef } from "react"
import { Box, Typography, useTheme } from "@mui/material"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

const OrderStatusChart = ({ data }) => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const theme = useTheme()

  useEffect(() => {
    if (chartRef.current) {
      // Détruire le graphique précédent s'il existe
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const ctx = chartRef.current.getContext("2d")
      chartInstance.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: data.map((item) => item.name),
          datasets: [
            {
              data: data.map((item) => item.value),
              backgroundColor: data.map((item) => item.color),
              borderColor: "#fff",
              borderWidth: 2,
              hoverOffset: 10,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "60%",
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                padding: 20,
                usePointStyle: true,
                pointStyle: "circle",
                font: {
                  size: 12,
                },
              },
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
            },
          },
        },
      })
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  // Calculer le total des commandes
  const totalOrders = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Box sx={{ height: 300, position: "relative", display: "flex", flexDirection: "column" }}>
      <Box sx={{ flex: 1, position: "relative" }}>
        <canvas ref={chartRef} />
      </Box>
      {totalOrders === 0 && (
        <Typography
          variant="body2"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "text.secondary",
          }}
        >
          Aucune commande
        </Typography>
      )}
    </Box>
  )
}

export default OrderStatusChart
