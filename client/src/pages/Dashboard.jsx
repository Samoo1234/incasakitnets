import React from 'react'
import { useSelector } from 'react-redux'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader
} from '@mui/material'
import KitnetList from '../components/KitnetList'

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth)

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Bem-vindo, {user?.displayName || 'Usuário'}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <KitnetList />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardHeader title="Atividades Recentes" />
            <CardContent>
              <Typography variant="body1">
                Nenhuma atividade recente para exibir.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardHeader title="Ações Rápidas" />
            <CardContent>
              <Typography variant="body1">
                Gerencie suas kitnets e reservas.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard