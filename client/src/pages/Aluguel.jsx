import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  IconButton,
  Stack
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/pt-br';
import { useLocation, useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ArrowBack, CloudUpload } from '@mui/icons-material';
import dayjs from 'dayjs';

const Aluguel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { kitnetId, dataInicial, dataFinal } = location.state || {};

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [documento, setDocumento] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Calcula o número de dias entre as datas
  const diasAluguel = dataInicial && dataFinal
    ? dayjs(dataFinal).diff(dayjs(dataInicial), 'day')
    : 0;

  // Valor da diária (você pode ajustar conforme necessário)
  const valorDiaria = 100;
  const valorTotal = diasAluguel * valorDiaria;

  const handleDocumentoChange = (event) => {
    if (event.target.files[0]) {
      setDocumento(event.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!nome || !email || !telefone || !cpf || !documento) {
      setError('Por favor, preencha todos os campos e faça upload do documento.');
      return;
    }

    try {
      // Upload do documento
      const documentoRef = ref(storage, `documentos/${kitnetId}/${documento.name}`);
      await uploadBytes(documentoRef, documento);
      const documentoUrl = await getDownloadURL(documentoRef);

      // Salvar reserva no Firestore
      await addDoc(collection(db, 'reservas'), {
        kitnetId,
        nome,
        email,
        telefone,
        cpf,
        documentoUrl,
        dataInicial: dayjs(dataInicial).toDate(),
        dataFinal: dayjs(dataFinal).toDate(),
        valorTotal,
        dataCriacao: new Date()
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setError('Erro ao processar a reserva. Tente novamente.');
      console.error('Erro:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <IconButton onClick={() => navigate('/')} sx={{ mb: 2 }}>
          <ArrowBack />
        </IconButton>

        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Formulário de Aluguel
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Reserva realizada com sucesso! Redirecionando...
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome Completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="E-mail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Telefone"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="CPF"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  sx={{ width: '100%' }}
                >
                  {documento ? documento.name : 'Upload de Documento'}
                  <input
                    type="file"
                    hidden
                    onChange={handleDocumentoChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Período de Aluguel
                  </Typography>
                  <Stack spacing={2}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                      <DatePicker
                        label="Data de Entrada"
                        value={dataInicial}
                        readOnly
                        format="DD/MM/YYYY"
                      />
                      <DatePicker
                        label="Data de Saída"
                        value={dataFinal}
                        readOnly
                        format="DD/MM/YYYY"
                      />
                    </LocalizationProvider>
                    <Typography variant="body1">
                      Período: {diasAluguel} dias
                    </Typography>
                    <Typography variant="h6" color="primary">
                      Valor Total: R$ {valorTotal.toFixed(2)}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                >
                  Confirmar Aluguel
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Aluguel;