import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { Delete, Storage, Image, Info } from '@mui/icons-material';
import localImageStorage from '../utils/localImageStorage';

const GerenciarArmazenamento = () => {
  const [storageInfo, setStorageInfo] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmDialog, setConfirmDialog] = useState(false);

  useEffect(() => {
    carregarInformacoes();
  }, []);

  const carregarInformacoes = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [info, imagesList] = await Promise.all([
        localImageStorage.getStorageInfo(),
        localImageStorage.getAllImages()
      ]);
      
      setStorageInfo(info);
      setImages(imagesList);
    } catch (error) {
      console.error('Erro ao carregar informações:', error);
      setError('Erro ao carregar informações do armazenamento.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      const sucesso = await localImageStorage.deleteImage(imageId);
      if (sucesso) {
        setSuccess('Imagem deletada com sucesso!');
        carregarInformacoes();
      } else {
        setError('Erro ao deletar imagem.');
      }
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      setError('Erro ao deletar imagem.');
    }
  };

  const handleClearAll = async () => {
    try {
      setClearing(true);
      const sucesso = await localImageStorage.clearAll();
      if (sucesso) {
        setSuccess('Todas as imagens foram removidas!');
        carregarInformacoes();
      } else {
        setError('Erro ao limpar armazenamento.');
      }
    } catch (error) {
      console.error('Erro ao limpar armazenamento:', error);
      setError('Erro ao limpar armazenamento.');
    } finally {
      setClearing(false);
      setConfirmDialog(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('pt-BR');
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Gerenciar Armazenamento Local
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Sistema temporário enquanto o Firebase Storage não estiver configurado.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Storage color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Informações do Armazenamento
                  </Typography>
                </Box>
                
                {storageInfo && (
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Total de Imagens" 
                        secondary={storageInfo.count} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Espaço Utilizado" 
                        secondary={`${storageInfo.totalSizeMB} MB`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Tamanho Médio" 
                        secondary={formatBytes(storageInfo.averageSize)} 
                      />
                    </ListItem>
                  </List>
                )}
              </CardContent>
              <CardActions>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={carregarInformacoes}
                  startIcon={<Info />}
                >
                  Atualizar
                </Button>
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={() => setConfirmDialog(true)}
                  startIcon={<Delete />}
                  disabled={!storageInfo || storageInfo.count === 0}
                >
                  Limpar Tudo
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Image color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Status do Sistema
                  </Typography>
                </Box>
                
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Modo:</strong> Armazenamento Local Temporário
                  </Typography>
                </Alert>
                
                <Alert severity="warning">
                  <Typography variant="body2">
                    As imagens são salvas no navegador. Limpar dados do navegador fará com que sejam perdidas.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Imagens Armazenadas ({images.length})
              </Typography>
              
              {images.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <Typography variant="body1" color="text.secondary">
                    Nenhuma imagem armazenada localmente.
                  </Typography>
                </Box>
              ) : (
                <List>
                  {images.map((image) => (
                    <ListItem key={image.id}>
                      <Box 
                        component="img" 
                        src={image.base64} 
                        alt={image.name}
                        sx={{ 
                          width: 60, 
                          height: 60, 
                          objectFit: 'cover', 
                          borderRadius: 1,
                          mr: 2 
                        }}
                      />
                      <ListItemText
                        primary={image.name || 'Sem nome'}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Tamanho: {formatBytes(image.size)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Criado: {formatDate(image.timestamp)}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton 
                          edge="end" 
                          color="error"
                          onClick={() => handleDeleteImage(image.id)}
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>
        </Grid>

        <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
          <DialogTitle>Confirmar Limpeza</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tem certeza que deseja remover todas as imagens? Esta ação não pode ser desfeita.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleClearAll} 
              color="error" 
              disabled={clearing}
            >
              {clearing ? 'Limpando...' : 'Confirmar'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default GerenciarArmazenamento; 