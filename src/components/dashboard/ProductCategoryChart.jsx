"use client"

import { useEffect, useRef } from "react"
import { Box, useTheme } from "@mui/material"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

const ProductCategoryChart = ({ data }) => {
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
        type: "bar",
        data: {
          labels: data.labels,
          datasets: [
            {
              label: "Nombre de produits",
              data: data.values,
              backgroundColor: data.colors || Array(data.values.length).fill("#1976d2"),
              borderRadius: 6,
              barThickness: 20,
              maxBarThickness: 30,
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
                precision: 0,
                font: {
                  size: 12,
                },
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

export default ProductCategoryChart
