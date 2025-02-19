import React from 'react';
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
import { useNavigate } from 'react-router-dom';
import { AccountCircle } from '@mui/icons-material';

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

  const handleAlugar = (id) => {
    navigate('/register', { state: { kitnetId: id } });
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
                      label={kitnet.disponivel ? 'Disponível' : 'Alugado'}
                      color={kitnet.disponivel ? 'success' : 'error'}
                      size="small"
                    />
                  </Stack>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleAlugar(kitnet.id)}
                    disabled={!kitnet.disponivel}
                  >
                    {kitnet.disponivel ? 'Alugar' : 'Indisponível'}
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