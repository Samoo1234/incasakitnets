import React from 'react'
import { Box, Grid, Paper, Typography, Container, Card, CardContent } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const mockData = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 2000 },
  { month: 'Apr', revenue: 2780 },
  { month: 'May', revenue: 1890 },
  { month: 'Jun', revenue: 2390 }
]

const Dashboard = () => {
  const navigate = useNavigate()

  const stats = {
    totalKitnets: 15,
    occupiedKitnets: 12,
    availableKitnets: 3,
    monthlyRevenue: 'R$ 15.000'
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Total Kitnets
            </Typography>
            <Typography component="p" variant="h4">
              {stats.totalKitnets}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Occupied Kitnets
            </Typography>
            <Typography component="p" variant="h4">
              {stats.occupiedKitnets}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Available Kitnets
            </Typography>
            <Typography component="p" variant="h4">
              {stats.availableKitnets}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Monthly Revenue
            </Typography>
            <Typography component="p" variant="h4">
              {stats.monthlyRevenue}
            </Typography>
          </Paper>
        </Grid>

        {/* Revenue Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Revenue Overview
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Dashboard