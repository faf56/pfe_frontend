import { Box, Paper, Typography, Grid, styled, LinearProgress } from "@mui/material"
import { TrendingUp, TrendingDown, PersonAdd } from "@mui/icons-material"

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: "24px",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  height: "100%",
}))

const StatValue = styled(Typography)(({ theme, color }) => ({
  fontSize: "28px",
  fontWeight: 600,
  color: color || "inherit",
  marginBottom: "8px",
}))

// Fixed: Use transient prop $positive
const TrendIndicator = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$positive'
})(({ theme, $positive }) => ({
  display: "flex",
  alignItems: "center",
  gap: "4px",
  color: $positive ? "#4caf50" : "#f44336",
  fontSize: "14px",
  fontWeight: 500,
}))

const ProgressLabel = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "8px",
}))

const UserStats = ({ users }) => {
  // Calculate statistics
  const totalUsers = users.length
  const activeUsers = users.filter((user) => user.isActive).length
  const inactiveUsers = totalUsers - activeUsers
  const adminUsers = users.filter((user) => user.role === "admin").length
  const clientUsers = totalUsers - adminUsers

  // Calculate percentages
  const activePercentage = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0
  const adminPercentage = totalUsers > 0 ? (adminUsers / totalUsers) * 100 : 0

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <StyledPaper>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Statut des comptes
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Comptes actifs
                </Typography>
                <StatValue color="#2e7d32">{activeUsers}</StatValue>
                <TrendIndicator $positive={true}>
                  <TrendingUp fontSize="small" />
                  {activePercentage.toFixed(1)}%
                </TrendIndicator>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Comptes inactifs
                </Typography>
                <StatValue color="#c62828">{inactiveUsers}</StatValue>
                <TrendIndicator $positive={false}>
                  <TrendingDown fontSize="small" />
                  {(100 - activePercentage).toFixed(1)}%
                </TrendIndicator>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <ProgressLabel>
              <Typography variant="body2">Taux d'activation</Typography>
              <Typography variant="body2" fontWeight="500">
                {activePercentage.toFixed(1)}%
              </Typography>
            </ProgressLabel>
            <LinearProgress
              variant="determinate"
              value={activePercentage}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "rgba(198, 40, 40, 0.2)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#2e7d32",
                },
              }}
            />
          </Box>
        </StyledPaper>
      </Grid>

      <Grid item xs={12} md={6}>
        <StyledPaper>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Distribution des rôles
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Administrateurs
                </Typography>
                <StatValue color="#1565c0">{adminUsers}</StatValue>
                <TrendIndicator $positive={true}>
                  <PersonAdd fontSize="small" />
                  {adminPercentage.toFixed(1)}%
                </TrendIndicator>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Clients
                </Typography>
                <StatValue color="#f57c00">{clientUsers}</StatValue>
                <TrendIndicator $positive={true}>
                  <PersonAdd fontSize="small" />
                  {(100 - adminPercentage).toFixed(1)}%
                </TrendIndicator>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <ProgressLabel>
              <Typography variant="body2">Répartition Admin/Client</Typography>
              <Typography variant="body2" fontWeight="500">
                {adminPercentage.toFixed(1)}%
              </Typography>
            </ProgressLabel>
            <LinearProgress
              variant="determinate"
              value={adminPercentage}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "rgba(245, 124, 0, 0.2)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#1565c0",
                },
              }}
            />
          </Box>
        </StyledPaper>
      </Grid>
    </Grid>
  )
}

export default UserStats