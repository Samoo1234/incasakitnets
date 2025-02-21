import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RentalForm from '../components/RentalForm';
import { Box, Typography, Container } from '@mui/material';

const RentalPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { kitnetData, initialDate, finalDate } = location.state || {};

  if (!kitnetData || !initialDate || !finalDate) {
    navigate('/');
    return null;
  }

  const handleSubmit = (formData) => {
    // Aqui você pode implementar a lógica para enviar os dados do formulário
    console.log('Dados do formulário:', formData);
    // Após o envio bem-sucedido, redirecione para a página inicial ou de confirmação
    navigate('/');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Solicitar Aluguel
        </Typography>
        <Typography variant="h6" gutterBottom align="center">
          {kitnetData.title}
        </Typography>
        <Typography variant="body1" gutterBottom align="center" color="text.secondary">
          Período: {initialDate.format('DD/MM/YYYY')} - {finalDate.format('DD/MM/YYYY')}
        </Typography>
        <Box sx={{ mt: 4 }}>
          <RentalForm
            onSubmit={handleSubmit}
            kitnetData={kitnetData}
            initialDate={initialDate}
            finalDate={finalDate}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default RentalPage;