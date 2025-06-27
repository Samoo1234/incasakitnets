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
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/pt-br';
import { useNavigate, useLocation } from 'react-router-dom';
import { AccountCircle } from '@mui/icons-material';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import dayjs from 'dayjs';

// Placeholder para imagem padrão
const defaultImage = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=200&fit=crop';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [kitnets, setKitnets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dataInicial, setDataInicial] = useState(null);
  const [dataFinal, setDataFinal] = useState(null);
  
  // Debug das datas
  console.log('🗓️ Estados das datas na Home:', {
    dataInicial: dataInicial ? dataInicial.format('DD/MM/YYYY') : 'null',
    dataFinal: dataFinal ? dataFinal.format('DD/MM/YYYY') : 'null'
  });
  const [disponibilidade, setDisponibilidade] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const verificarDisponibilidade = async (kitnetId, dataInicio, dataFim) => {
    if (!dataInicio || !dataFim) return true;

    try {
      const reservasRef = collection(db, 'reservas');
      const dataInicioTimestamp = dayjs(dataInicio).startOf('day');
      const dataFimTimestamp = dayjs(dataFim).endOf('day');

      // Simplificando a query para evitar erro de índice
      const q = query(
        reservasRef,
        where('kitnetId', '==', kitnetId)
      );

      const querySnapshot = await getDocs(q);
      
      // Verificar conflitos manualmente para evitar problemas de índice
      let temConflito = false;
      querySnapshot.forEach(doc => {
        const reserva = doc.data();
        if (reserva.status !== 'cancelada') {
          const reservaInicio = dayjs(reserva.dataInicial.toDate());
          const reservaFim = dayjs(reserva.dataFinal.toDate());
          
          // Verifica se há sobreposição de datas
          if (dataInicioTimestamp.isBefore(reservaFim) && dataFimTimestamp.isAfter(reservaInicio)) {
            temConflito = true;
          }
        }
      });
      
      return !temConflito;
    } catch (error) {
      console.error('Erro ao verificar disponibilidade:', error);
      // Em caso de erro, assume que está disponível para não bloquear o usuário
      return true;
    }
  };

  // Verificar mensagem de sucesso do aluguel
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Limpar o state para não mostrar a mensagem novamente
      navigate('/', { replace: true });
    }
  }, [location.state, navigate]);

  // Carregar kitnets do Firebase
  useEffect(() => {
    const carregarKitnets = async () => {
      try {
        setLoading(true);
        setError('');
        
        const q = query(
          collection(db, 'kitnets'),
          orderBy('criadoEm', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const kitnetsDoFirebase = [];
        
        querySnapshot.forEach(doc => {
          kitnetsDoFirebase.push({ 
            id: doc.id, 
            ...doc.data() 
          });
        });
        
        setKitnets(kitnetsDoFirebase);
      } catch (error) {
        console.error('Erro ao carregar kitnets:', error);
        setError('Erro ao carregar kitnets. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    carregarKitnets();
  }, []);

  // Verificar disponibilidade quando as datas mudam
  useEffect(() => {
    const verificarTodasKitnets = async () => {
      if (!kitnets.length) return;
      
      const novaDisponibilidade = {};
      
      if (!dataInicial || !dataFinal) {
        // Sem datas: usa o status base da kitnet
        kitnets.forEach(kitnet => {
          novaDisponibilidade[kitnet.id] = kitnet.disponivel;
        });
      } else {
        // Com datas: verifica conflitos de reservas
        for (const kitnet of kitnets) {
          if (!kitnet.disponivel) {
            // Se a kitnet está desabilitada, não está disponível
            novaDisponibilidade[kitnet.id] = false;
          } else {
            // Se está habilitada, verifica conflitos no período
            novaDisponibilidade[kitnet.id] = await verificarDisponibilidade(
              kitnet.id,
              dataInicial,
              dataFinal
            );
          }
        }
      }
      
      setDisponibilidade(novaDisponibilidade);
    };

    verificarTodasKitnets();
  }, [dataInicial, dataFinal, kitnets]);

  const handleAlugar = (kitnetId) => {
    const kitnet = kitnets.find(k => k.id === kitnetId);
    
    // Validar se as datas são válidas antes de navegar
    if (!dataInicial || !dataFinal) {
      alert('Por favor, selecione as datas de entrada e saída.');
      return;
    }

    if (!dayjs.isDayjs(dataInicial) || !dayjs.isDayjs(dataFinal)) {
      alert('Datas inválidas. Por favor, selecione novamente.');
      return;
    }
    
    console.log('🚀 Navegando para aluguel com dados:', {
      kitnet: kitnet ? kitnet.titulo : 'não encontrada',
      dataInicial: dataInicial.format('DD/MM/YYYY'),
      dataFinal: dataFinal.format('DD/MM/YYYY')
    });
    
    navigate('/aluguel', { 
      state: { 
        kitnet,
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
        
        {successMessage && (
          <Alert 
            severity="success" 
            sx={{ mb: 3 }}
            onClose={() => setSuccessMessage('')}
          >
            {successMessage}
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress size={60} />
          </Box>
        ) : kitnets.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary">
              Nenhuma kitnet cadastrada ainda.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/login')}
              sx={{ mt: 2 }}
            >
              Área Administrativa
            </Button>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {kitnets.map((kitnet) => (
              <Grid item key={kitnet.id} xs={12} sm={6} md={4}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={kitnet.imageUrl || defaultImage}
                    alt={kitnet.titulo}
                    onError={(e) => {
                      e.target.src = defaultImage;
                    }}
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
                        R$ {kitnet.valorDiaria}
                      </Typography>
                      <Chip
                        label={(() => {
                          if (!kitnet.disponivel) return 'Kitnet Desabilitada';
                          if (!dataInicial || !dataFinal) return 'Disponível';
                          return disponibilidade[kitnet.id] ? 'Disponível no Período' : 'Ocupada no Período';
                        })()}
                        color={kitnet.disponivel && disponibilidade[kitnet.id] ? 'success' : 'error'}
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
                      variant="contained"
                    >
                      {(() => {
                        if (!kitnet.disponivel) return 'Kitnet Indisponível';
                        if (!dataInicial || !dataFinal) return 'Selecione as Datas';
                        if (!disponibilidade[kitnet.id]) return 'Ocupada no Período';
                        return 'Alugar Agora';
                      })()}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Home;