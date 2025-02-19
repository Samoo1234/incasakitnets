import React from 'react'
import { Box, Typography, Paper, Container } from '@mui/material'
import { useSelector } from 'react-redux'

const Profile = () => {
  const { user } = useSelector((state) => state.auth)

  return (
    <Container maxWidth="md">
      <Box py={4}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Perfil do Usuário
          </Typography>
          <Box mt={3}>
            <Typography variant="body1">
              <strong>Email:</strong> {user?.email}
            </Typography>
            {user?.displayName && (
              <Typography variant="body1" mt={2}>
                <strong>Nome:</strong> {user.displayName}
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default Profile