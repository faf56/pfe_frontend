"use client"

import { useEffect, useRef } from "react"
import { Box, useTheme } from "@mui/material"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

const SalesChart = ({ data }) => {
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
        type: "line",
        data: {
          labels: data.months,
          datasets: [
            {
              label: "Chiffre d'affaires (DT)",
              data: data.salesData,
              backgroundColor: "rgba(25, 118, 210, 0.1)",
              borderColor: "#1976d2",
              borderWidth: 2,
              tension: 0.4,
              fill: true,
              pointBackgroundColor: "#1976d2",
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        },
        options: {
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
                  size: 12,
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
                  size: 12,
                },
                callback: (value) => value.toFixed(0) + " DT",
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

  return (
    <Box sx={{ height: 300, position: "relative" }}>
      <canvas ref={chartRef} />
    </Box>
  )
}

export default SalesChart
