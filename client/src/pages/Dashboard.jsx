import React, { useState, useEffect } from 'react'
import { Box, Grid, Paper, Typography, Container, Card, CardContent, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase'
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
  const [stats, setStats] = useState({
    totalKitnets: 0,
    occupiedKitnets: 0,
    availableKitnets: 0,
    monthlyRevenue: 'R$ 0,00'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarEstatisticas()
  }, [])

  const carregarEstatisticas = async () => {
    try {
      setLoading(true)
      
      // Buscar total de kitnets
      const kitnetsSnapshot = await getDocs(collection(db, 'kitnets'))
      const totalKitnets = kitnetsSnapshot.size
      
      // Buscar kitnets disponíveis
      const kitnetsDisponiveisQuery = query(
        collection(db, 'kitnets'),
        where('disponivel', '==', true)
      )
      const kitnetsDisponiveisSnapshot = await getDocs(kitnetsDisponiveisQuery)
      const availableKitnets = kitnetsDisponiveisSnapshot.size
      
      // Kitnets ocupadas = Total - Disponíveis
      const occupiedKitnets = totalKitnets - availableKitnets
      
      // Buscar reservas do mês atual para calcular receita
      const hoje = new Date()
      const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
      const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0)
      
      const reservasSnapshot = await getDocs(collection(db, 'reservas'))
      let receitaMensal = 0
      
      reservasSnapshot.forEach(doc => {
        const reserva = doc.data()
        const dataReserva = reserva.criadoEm?.toDate()
        
        if (dataReserva && dataReserva >= inicioMes && dataReserva <= fimMes) {
          receitaMensal += reserva.valorTotal || 0
        }
      })
      
      setStats({
        totalKitnets,
        occupiedKitnets,
        availableKitnets,
        monthlyRevenue: `R$ ${receitaMensal.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`
      })
      
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setLoading(false)
    }
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
            {loading ? (
              <CircularProgress size={30} />
            ) : (
              <Typography component="p" variant="h4">
                {stats.totalKitnets}
              </Typography>
            )}
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
              Kitnets Indisponíveis
            </Typography>
            {loading ? (
              <CircularProgress size={30} />
            ) : (
              <Typography component="p" variant="h4">
                {stats.occupiedKitnets}
              </Typography>
            )}
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
              Kitnets Disponíveis
            </Typography>
            {loading ? (
              <CircularProgress size={30} />
            ) : (
              <Typography component="p" variant="h4">
                {stats.availableKitnets}
              </Typography>
            )}
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
              Receita Mensal
            </Typography>
            {loading ? (
              <CircularProgress size={30} />
            ) : (
              <Typography component="p" variant="h4">
                {stats.monthlyRevenue}
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Revenue Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Visão Geral de Receita (Simulado)
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