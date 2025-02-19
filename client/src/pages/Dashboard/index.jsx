import React from 'react'
import { Box, Grid, Paper, Typography, Card, CardContent } from '@mui/material'
import { styled } from '@mui/material/styles'
import { 
  Apartment as ApartmentIcon,
  EventAvailable as EventAvailableIcon,
  Payment as PaymentIcon,
  People as PeopleIcon
} from '@mui/icons-material'

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4]
  }
}))

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '& > svg': {
    fontSize: 40,
    marginRight: theme.spacing(2),
    color: theme.palette.primary.main
  }
}))

const Dashboard = () => {
  const dashboardItems = [
    {
      title: 'Kitnets',
      value: '10 unidades',
      icon: <ApartmentIcon />,
      description: 'Total de kitnets disponíveis'
    },
    {
      title: 'Reservas',
      value: '5 ativas',
      icon: <EventAvailableIcon />,
      description: 'Reservas em andamento'
    },
    {
      title: 'Pagamentos',
      value: 'R$ 15.000,00',
      icon: <PaymentIcon />,
      description: 'Receita mensal'
    },
    {
      title: 'Clientes',
      value: '8 ativos',
      icon: <PeopleIcon />,
      description: 'Hóspedes atuais'
    }
  ]

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {dashboardItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StyledCard>
              <CardContent>
                <IconWrapper>
                  {item.icon}
                  <Typography variant="h6" component="div">
                    {item.title}
                  </Typography>
                </IconWrapper>
                <Typography variant="h4" color="primary" gutterBottom>
                  {item.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Dashboard