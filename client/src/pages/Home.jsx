import React, { useState, useEffect } from 'react';
import { 
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Stack,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/pt-br';
import { useNavigate } from 'react-router-dom';
import { AccountCircle } from '@mui/icons-material';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import dayjs from 'dayjs';

// Dados de exemplo das kitnets (posteriormente serão carregados do backend)
const kitnets = [
  {
    id: 1,
    titulo: 'Kitnet Moderna Centro',
    descricao: 'Kitnet mobiliada com ótima localização',
    preco: 800,
    disponivel: true,
    imagem: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'
  },
  {
    id: 2,
    titulo: 'Kitnet Jardim América',
    descricao: 'Ambiente aconchegante e bem iluminado',
    preco: 750,
    disponivel: false,
    imagem: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'
  },
  {
    id: 3,
    titulo: 'Kitnet Universitária',
    descricao: 'Próximo a universidades e comércio',
    preco: 650,
    disponivel: true,
    imagem: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb'
  }
];

const Home = () => {
  const navigate = useNavigate();
  const [dataInicial, setDataInicial] = useState(null);
  const [dataFinal, setDataFinal] = useState(null);
  const [disponibilidade, setDisponibilidade] = useState({});

  const verificarDisponibilidade = async (kitnetId, dataInicio, dataFim) => {
    if (!dataInicio || !dataFim) return true;

    try {
      const reservasRef = collection(db, 'reservas');
      const dataInicioTimestamp = dayjs(dataInicio).startOf('day');
      const dataFimTimestamp = dayjs(dataFim).endOf('day');

      const q = query(
        reservasRef,
        where('kitnetId', '==', kitnetId),
        where('dataInicial', '<=', dataFimTimestamp.toDate()),
        where('dataFinal', '>=', dataInicioTimestamp.toDate())
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.empty;
    } catch (error) {
      console.error('Erro ao verificar disponibilidade:', error);
      return false;
    }
  };

  useEffect(() => {
    const verificarTodasKitnets = async () => {
      if (!dataInicial || !dataFinal) {
        const novaDisponibilidade = {};
        kitnets.forEach(kitnet => {
          novaDisponibilidade[kitnet.id] = kitnet.disponivel;
        });
        setDisponibilidade(novaDisponibilidade);
        return;
      }

      const novaDisponibilidade = {};
      
      for (const kitnet of kitnets) {
        if (kitnet.disponivel) {
          novaDisponibilidade[kitnet.id] = await verificarDisponibilidade(
            kitnet.id,
            dataInicial,
            dataFinal
          );
        } else {
          novaDisponibilidade[kitnet.id] = false;
        }
      }
      
      setDisponibilidade(novaDisponibilidade);
    };

    verificarTodasKitnets();
  }, [dataInicial, dataFinal]);

  const handleAlugar = (id) => {
    navigate('/aluguel', { 
      state: { 
        kitnetId: id,
        dataInicial,
        dataFinal
      } 
    });
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Incasa
          </Typography>
          <IconButton
            size="large"
            color="primary"
            onClick={handleLoginClick}
            title="Área Administrativa"
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Kitnets Disponíveis
        </Typography>
        <Grid container spacing={4}>
          {kitnets.map((kitnet) => (
            <Grid item key={kitnet.id} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={kitnet.imagem}
                  alt={kitnet.titulo}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {kitnet.titulo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {kitnet.descricao}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Typography variant="h6" color="primary">
                      R$ {kitnet.preco}
                    </Typography>
                    <Chip
                      label={kitnet.disponivel && (!dataInicial || !dataFinal || disponibilidade[kitnet.id]) ? 'Disponível' : 'Indisponível'}
                      color={kitnet.disponivel && (!dataInicial || !dataFinal || disponibilidade[kitnet.id]) ? 'success' : 'error'}
                      size="small"
                    />
                  </Stack>
                  
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                    <Stack spacing={2} sx={{ mt: 2 }}>
                      <DatePicker
                        label="Data de Entrada"
                        value={dataInicial}
                        onChange={(newValue) => setDataInicial(newValue)}
                        format="DD/MM/YYYY"
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                            placeholder: "DD/MM/AAAA"
                          }
                        }}
                        disablePast
                      />
                      <DatePicker
                        label="Data de Saída"
                        value={dataFinal}
                        onChange={(newValue) => setDataFinal(newValue)}
                        format="DD/MM/YYYY"
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                            placeholder: "DD/MM/AAAA"
                          }
                        }}
                        minDate={dataInicial}
                        disabled={!dataInicial}
                      />
                    </Stack>
                  </LocalizationProvider>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleAlugar(kitnet.id)}
                    disabled={!kitnet.disponivel || !dataInicial || !dataFinal || !disponibilidade[kitnet.id]}
                    fullWidth
                  >
                    {kitnet.disponivel && (!dataInicial || !dataFinal || disponibilidade[kitnet.id]) ? 'Alugar' : 'Indisponível'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;