import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Stack,
  IconButton,
  Input,
  FormControl,
  FormLabel,
  Divider
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import dayjs from 'dayjs';

const AluguelForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { kitnetId, dataInicial, dataFinal } = location.state || {};
  const [totalDias, setTotalDias] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);
  const VALOR_DIARIA = 100; // Valor da diária em reais

  const [formData, setFormData] = useState({
    nomeCompleto: '',
    cpf: '',
    rg: '',
    dataNascimento: '',
    quantidadePessoas: '',
    email: '',
    telefone: '',
    comprovante: null
  });

  useEffect(() => {
    if (dataInicial && dataFinal) {
      const inicio = dayjs(dataInicial instanceof Date ? dataInicial : dataInicial.$d || dataInicial);
      const fim = dayjs(dataFinal instanceof Date ? dataFinal : dataFinal.$d || dataFinal);
      if (inicio.isValid() && fim.isValid()) {
        const dias = fim.diff(inicio, 'day') + 1;
        setTotalDias(dias);
        setValorTotal(dias * VALOR_DIARIA);
      }
    }
  }, [dataInicial, dataFinal]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'comprovante' && files) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para enviar os dados do formulário
    console.log({
      ...formData,
      kitnetId,
      dataInicial: dayjs(dataInicial).format('DD/MM/YYYY'),
      dataFinal: dayjs(dataFinal).format('DD/MM/YYYY')
    });
  };

  const handleVoltar = () => {
    navigate('/');
  };

  const formatarData = (data) => {
    if (!data) return '';
    try {
      const date = dayjs(data instanceof Date ? data : data.$d || data);
      return date.isValid() ? date.format('DD/MM/YYYY') : '';
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <IconButton onClick={handleVoltar} sx={{ mb: 2 }}>
          <ArrowBack />
        </IconButton>
        
        <Typography variant="h4" component="h1" gutterBottom>
          Formulário de Aluguel
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome Completo"
                  name="nomeCompleto"
                  value={formData.nomeCompleto}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="CPF"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="RG"
                  name="rg"
                  value={formData.rg}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Data de Nascimento"
                  name="dataNascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={handleInputChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Quantidade de Pessoas"
                  name="quantidadePessoas"
                  type="number"
                  value={formData.quantidadePessoas}
                  onChange={handleInputChange}
                  required
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="E-mail"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <FormLabel>CNH ou RG</FormLabel>
                  <Input
                    type="file"
                    name="comprovante"
                    onChange={handleInputChange}
                    required
                    sx={{ mt: 1 }}
                  />
                </FormControl>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={2}>
                  <Typography variant="h6" color="primary">
                    Resumo do Aluguel
                  </Typography>
                  <Typography variant="body1">
                    Período: {formatarData(dataInicial)} até {formatarData(dataFinal)}
                  </Typography>
                  <Typography variant="body1">
                    Total de dias: {totalDias}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    Valor Total: R$ {valorTotal.toFixed(2)}
                  </Typography>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                  >
                    Enviar Solicitação de Aluguel
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default AluguelForm;