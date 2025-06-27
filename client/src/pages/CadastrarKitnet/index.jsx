import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Paper, IconButton, Alert, CircularProgress } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useSelector } from 'react-redux';
import { db, storage } from '../../firebase';
import localImageStorage from '../../utils/localImageStorage';

const CadastrarKitnet = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    endereco: '',
    valorDiaria: '',
    descricao: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useSelector((state) => state.auth);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo e tamanho do arquivo
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecione apenas arquivos de imagem.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setError('A imagem deve ter no máximo 5MB.');
        return;
      }
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      // Validar campos obrigatórios
      if (!formData.titulo || !formData.endereco || !formData.valorDiaria) {
        throw new Error('Por favor, preencha todos os campos obrigatórios.');
      }

      // Imagem é opcional - se não houver, usará placeholder

      let imageUrl = '';

      // Upload local da imagem até resolver problema do Firebase Storage
      if (selectedImage) {
        try {
          console.log('Salvando imagem localmente...');
          const localImage = await localImageStorage.saveImage(selectedImage);
          imageUrl = localImage.url;
          console.log('Imagem salva localmente com sucesso:', localImage.id);
        } catch (localError) {
          console.error('Erro no armazenamento local:', localError);
          // Fallback para placeholder se mesmo o local falhar
          imageUrl = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop';
        }
      } else {
        // Imagem placeholder padrão
        imageUrl = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop';
      }

      // Salvar dados no Firestore
      await addDoc(collection(db, 'kitnets'), {
        titulo: formData.titulo,
        endereco: formData.endereco,
        valorDiaria: Number(formData.valorDiaria),
        descricao: formData.descricao,
        imageUrl: imageUrl,
        disponivel: true,
        criadoEm: new Date(),
        criadoPor: user?.uid || 'unknown'
      });

      // Reset do formulário
      setFormData({
        titulo: '',
        endereco: '',
        valorDiaria: '',
        descricao: ''
      });
      setSelectedImage(null);
      setPreviewUrl(null);
      setSuccess(true);

    } catch (error) {
      console.error('Erro ao cadastrar kitnet:', error);
      setError(error.message || 'Erro ao cadastrar kitnet. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Cadastrar Nova Kitnet
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Kitnet cadastrada com sucesso!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Endereço"
                name="endereco"
                value={formData.endereco}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Valor da Diária"
                name="valorDiaria"
                type="number"
                value={formData.valorDiaria}
                onChange={handleInputChange}
                inputProps={{ min: 0, step: 0.01 }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="icon-button-file"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="icon-button-file">
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                >
                  <PhotoCamera />
                </IconButton>
                <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                  Adicionar Foto
                </Typography>
              </label>
              {previewUrl && (
                <Box sx={{ mt: 2, maxWidth: 300 }}>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{ width: '100%', height: 'auto' }}
                  />
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
              >
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CadastrarKitnet;