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
  Stack,
  Card,
  CardContent,
  CardMedia,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/pt-br';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ArrowBack, CloudUpload, Person, Home as HomeIcon, AttachMoney } from '@mui/icons-material';
import dayjs from 'dayjs';

const Aluguel = () => {
  console.log('🚀 Aluguel component iniciando...');
  
  const location = useLocation();
  const navigate = useNavigate();
  
  console.log('📍 Location state:', location.state);
  
  // Abordagem super simples - apenas pegar os dados direto
  const { kitnet, dataInicial: dataInicialState, dataFinal: dataFinalState } = location.state || {};
  
  console.log('📦 Dados recebidos:', { 
    kitnet: kitnet ? kitnet.titulo : 'não encontrada',
    dataInicialState: dataInicialState ? String(dataInicialState) : 'null',
    dataFinalState: dataFinalState ? String(dataFinalState) : 'null'
  });
  
  // Versão ULTRA SIMPLES - sem dayjs complicado
  let dataInicialFormatada = '--';
  let dataFinalFormatada = '--';
  let diasAluguel = 1;
  let valorTotal = kitnet?.valorDiaria || 100;
  
  // VERSÃO SUPER SIMPLIFICADA - SEM USAR DAYJS
  console.log('🔍 Datas recebidas (MODO SIMPLES):', {
    dataInicialState: dataInicialState ? 'existe' : 'null',
    dataFinalState: dataFinalState ? 'existe' : 'null'
  });
  
  if (dataInicialState && dataFinalState) {
    // Usar JavaScript puro para processar as datas
    try {
      // Tentar extrair informações básicas das datas sem usar dayjs
      let dataInicialJS = null;
      let dataFinalJS = null;
      
      // Se o objeto tem propriedades de data
      if (dataInicialState.$d && dataInicialState.$d instanceof Date) {
        dataInicialJS = dataInicialState.$d;
      } else if (dataInicialState instanceof Date) {
        dataInicialJS = dataInicialState;
      }
      
      if (dataFinalState.$d && dataFinalState.$d instanceof Date) {
        dataFinalJS = dataFinalState.$d;
      } else if (dataFinalState instanceof Date) {
        dataFinalJS = dataFinalState;
      }
      
      console.log('📅 Datas extraídas:', { dataInicialJS, dataFinalJS });
      
      // Se conseguiu extrair as datas JavaScript
      if (dataInicialJS && dataFinalJS) {
        // Formatar datas usando JavaScript puro
        dataInicialFormatada = dataInicialJS.toLocaleDateString('pt-BR');
        dataFinalFormatada = dataFinalJS.toLocaleDateString('pt-BR');
        
        // Calcular diferença em dias usando JavaScript puro
        const diffTime = dataFinalJS.getTime() - dataInicialJS.getTime();
        diasAluguel = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        valorTotal = diasAluguel * (kitnet?.valorDiaria || 100);
        
        console.log('✅ SUCESSO - Processamento JavaScript:', {
          dataInicialFormatada,
          dataFinalFormatada,
          diasAluguel,
          valorTotal
        });
      } else {
        console.warn('⚠️ Não foi possível extrair datas JavaScript');
      }
    } catch (error) {
      console.warn('❌ Erro no processamento JavaScript:', error);
    }
  }
  
  console.log('💰 Valores calculados:', { 
    dataInicialFormatada, 
    dataFinalFormatada, 
    diasAluguel, 
    valorTotal 
  });

  // Estados do formulário
  const [formData, setFormData] = useState({
    // Dados pessoais
    nomeCompleto: '',
    email: '',
    telefone: '',
    cpf: '',
    rg: '',
    dataNascimento: null,
    estadoCivil: '',
    profissao: '',
    
    // Endereço
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    
    // Contato de emergência
    nomeEmergencia: '',
    telefoneEmergencia: '',
    
    // Observações
    observacoes: ''
  });

  const [documento, setDocumento] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Verifica se os dados necessários estão disponíveis
  if (!kitnet) {
    console.log('⚠️ Kitnet não encontrada');
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
          <IconButton onClick={() => navigate('/')} sx={{ mb: 2 }}>
            <ArrowBack />
          </IconButton>
          <Alert severity="error" sx={{ mb: 2 }}>
            Dados da reserva não encontrados. Por favor, selecione uma kitnet novamente.
          </Alert>
          <Button variant="contained" onClick={() => navigate('/')}>
            Voltar para Início
          </Button>
        </Box>
      </Container>
    );
  }

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleDateChange = (field) => (newValue) => {
    setFormData(prev => ({
      ...prev,
      [field]: newValue
    }));
  };

  const handleDocumentoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar tamanho (5MB máx)
      if (file.size > 5 * 1024 * 1024) {
        setError('O arquivo deve ter no máximo 5MB.');
        return;
      }
      // Validar tipo
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setError('Apenas arquivos PDF, JPG ou PNG são permitidos.');
        return;
      }
      setDocumento(file);
      setError('');
    }
  };

  const formatCPF = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 11) {
      return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const formatTelefone = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 11) {
      if (cleanValue.length <= 10) {
        return cleanValue.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else {
        return cleanValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
    }
    return value;
  };

  const formatCEP = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 8) {
      return cleanValue.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    return value;
  };

  const validarFormulario = () => {
    const camposObrigatorios = [
      'nomeCompleto', 'email', 'telefone', 'cpf', 'rg', 'profissao',
      'cep', 'endereco', 'numero', 'bairro', 'cidade', 'estado',
      'nomeEmergencia', 'telefoneEmergencia'
    ];

    for (const campo of camposObrigatorios) {
      if (!formData[campo] || formData[campo].trim() === '') {
        return false;
      }
    }

    if (!formData.dataNascimento) {
      return false;
    }

    if (!documento) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!validarFormulario()) {
        throw new Error('Por favor, preencha todos os campos obrigatórios.');
      }

      // Simular upload do documento
      let documentoInfo = null;
      if (documento) {
        documentoInfo = {
          nome: documento.name,
          tamanho: documento.size,
          tipo: documento.type,
          dataUpload: new Date()
        };
      }

      // Dados da reserva - VERSÃO SIMPLES
      const reservaData = {
        // Dados da kitnet
        kitnetId: kitnet.id,
        kitnetTitulo: kitnet.titulo,
        kitnetEndereco: kitnet.endereco,
        valorDiaria: kitnet.valorDiaria,
        
        // Período - usando strings simples
        dataInicialStr: dataInicialFormatada,
        dataFinalStr: dataFinalFormatada,
        diasAluguel,
        valorTotal,
        
        // Dados do cliente
        cliente: {
          ...formData,
          dataNascimento: formData.dataNascimento ? formData.dataNascimento.toDate() : null,
          documento: documentoInfo
        },
        
        // Metadados
        status: 'pendente',
        criadoEm: serverTimestamp(),
        confirmado: false
      };

      console.log('📝 Enviando reserva:', reservaData);

      // Salvar no Firestore
      await addDoc(collection(db, 'reservas'), reservaData);

      setSuccess(true);
      
      // Redirecionar após 3 segundos
      setTimeout(() => {
        navigate('/', { 
          state: { 
            message: 'Reserva enviada com sucesso! Entraremos em contato em breve.' 
          }
        });
      }, 3000);

    } catch (error) {
      console.error('❌ Erro ao processar reserva:', error);
      setError(error.message || 'Erro ao processar a reserva. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  console.log('✅ Renderizando formulário simplificado...');

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 2, mb: 4 }}>
        <IconButton onClick={() => navigate('/')} sx={{ mb: 2 }}>
          <ArrowBack />
        </IconButton>

        <Grid container spacing={3}>
          {/* Resumo da Kitnet */}
          <Grid item xs={12} md={4}>
            <Card sx={{ position: 'sticky', top: 20 }}>
              <CardMedia
                component="img"
                height="200"
                image={kitnet.imageUrl || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=200&fit=crop'}
                alt={kitnet.titulo || 'Kitnet'}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {kitnet.titulo || 'Kitnet'}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {kitnet.endereco || 'Endereço não informado'}
                </Typography>
                

                
                <Divider sx={{ my: 2 }} />
                
                <Stack spacing={1}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Check-in:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {dataInicialFormatada}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Check-out:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {dataFinalFormatada}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Período:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {diasAluguel} dias
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Diária:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      R$ {kitnet.valorDiaria || 0}
                    </Typography>
                  </Box>
                </Stack>
                
                <Divider sx={{ my: 2 }} />
                
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    R$ {valorTotal.toFixed(2)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Formulário */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Dados para Reserva
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Reserva enviada com sucesso! Redirecionando...
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                {/* Dados Pessoais */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Person sx={{ mr: 1 }} />
                    Dados Pessoais
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Nome Completo"
                        value={formData.nomeCompleto}
                        onChange={handleInputChange('nomeCompleto')}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="E-mail"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Telefone"
                        value={formData.telefone}
                        onChange={(e) => {
                          const formatted = formatTelefone(e.target.value);
                          setFormData(prev => ({ ...prev, telefone: formatted }));
                        }}
                        placeholder="(11) 99999-9999"
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="CPF"
                        value={formData.cpf}
                        onChange={(e) => {
                          const formatted = formatCPF(e.target.value);
                          setFormData(prev => ({ ...prev, cpf: formatted }));
                        }}
                        placeholder="000.000.000-00"
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="RG"
                        value={formData.rg}
                        onChange={handleInputChange('rg')}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                        <DatePicker
                          label="Data de Nascimento"
                          value={formData.dataNascimento}
                          onChange={handleDateChange('dataNascimento')}
                          format="DD/MM/YYYY"
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              required: true
                            }
                          }}
                          maxDate={dayjs().subtract(18, 'year')}
                        />
                      </LocalizationProvider>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Estado Civil</InputLabel>
                        <Select
                          value={formData.estadoCivil}
                          onChange={handleInputChange('estadoCivil')}
                          label="Estado Civil"
                        >
                          <MenuItem value="solteiro">Solteiro(a)</MenuItem>
                          <MenuItem value="casado">Casado(a)</MenuItem>
                          <MenuItem value="divorciado">Divorciado(a)</MenuItem>
                          <MenuItem value="viuvo">Viúvo(a)</MenuItem>
                          <MenuItem value="uniao-estavel">União Estável</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Profissão"
                        value={formData.profissao}
                        onChange={handleInputChange('profissao')}
                        required
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Endereço */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <HomeIcon sx={{ mr: 1 }} />
                    Endereço
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="CEP"
                        value={formData.cep}
                        onChange={(e) => {
                          const formatted = formatCEP(e.target.value);
                          setFormData(prev => ({ ...prev, cep: formatted }));
                        }}
                        placeholder="00000-000"
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={8}>
                      <TextField
                        fullWidth
                        label="Endereço"
                        value={formData.endereco}
                        onChange={handleInputChange('endereco')}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Número"
                        value={formData.numero}
                        onChange={handleInputChange('numero')}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={8}>
                      <TextField
                        fullWidth
                        label="Complemento"
                        value={formData.complemento}
                        onChange={handleInputChange('complemento')}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Bairro"
                        value={formData.bairro}
                        onChange={handleInputChange('bairro')}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Cidade"
                        value={formData.cidade}
                        onChange={handleInputChange('cidade')}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth required>
                        <InputLabel>Estado</InputLabel>
                        <Select
                          value={formData.estado}
                          onChange={handleInputChange('estado')}
                          label="Estado"
                        >
                          <MenuItem value="AC">Acre</MenuItem>
                          <MenuItem value="AL">Alagoas</MenuItem>
                          <MenuItem value="AP">Amapá</MenuItem>
                          <MenuItem value="AM">Amazonas</MenuItem>
                          <MenuItem value="BA">Bahia</MenuItem>
                          <MenuItem value="CE">Ceará</MenuItem>
                          <MenuItem value="DF">Distrito Federal</MenuItem>
                          <MenuItem value="ES">Espírito Santo</MenuItem>
                          <MenuItem value="GO">Goiás</MenuItem>
                          <MenuItem value="MA">Maranhão</MenuItem>
                          <MenuItem value="MT">Mato Grosso</MenuItem>
                          <MenuItem value="MS">Mato Grosso do Sul</MenuItem>
                          <MenuItem value="MG">Minas Gerais</MenuItem>
                          <MenuItem value="PA">Pará</MenuItem>
                          <MenuItem value="PB">Paraíba</MenuItem>
                          <MenuItem value="PR">Paraná</MenuItem>
                          <MenuItem value="PE">Pernambuco</MenuItem>
                          <MenuItem value="PI">Piauí</MenuItem>
                          <MenuItem value="RJ">Rio de Janeiro</MenuItem>
                          <MenuItem value="RN">Rio Grande do Norte</MenuItem>
                          <MenuItem value="RS">Rio Grande do Sul</MenuItem>
                          <MenuItem value="RO">Rondônia</MenuItem>
                          <MenuItem value="RR">Roraima</MenuItem>
                          <MenuItem value="SC">Santa Catarina</MenuItem>
                          <MenuItem value="SP">São Paulo</MenuItem>
                          <MenuItem value="SE">Sergipe</MenuItem>
                          <MenuItem value="TO">Tocantins</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>

                {/* Contato de Emergência */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Contato de Emergência
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Nome do Contato"
                        value={formData.nomeEmergencia}
                        onChange={handleInputChange('nomeEmergencia')}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Telefone do Contato"
                        value={formData.telefoneEmergencia}
                        onChange={(e) => {
                          const formatted = formatTelefone(e.target.value);
                          setFormData(prev => ({ ...prev, telefoneEmergencia: formatted }));
                        }}
                        placeholder="(11) 99999-9999"
                        required
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Upload de Documento */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Documento de Identificação
                  </Typography>
                  
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    sx={{ width: '100%', py: 2 }}
                    color={documento ? 'success' : 'primary'}
                  >
                    {documento ? documento.name : 'Upload de Documento (RG, CNH ou Passaporte)'}
                    <input
                      type="file"
                      hidden
                      onChange={handleDocumentoChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </Button>
                  
                  {documento && (
                    <Chip 
                      label={`Arquivo: ${documento.name} (${(documento.size / 1024 / 1024).toFixed(2)} MB)`}
                      color="success"
                      sx={{ mt: 1 }}
                    />
                  )}
                </Box>

                {/* Observações */}
                <Box sx={{ mb: 4 }}>
                  <TextField
                    fullWidth
                    label="Observações (opcional)"
                    value={formData.observacoes}
                    onChange={handleInputChange('observacoes')}
                    multiline
                    rows={3}
                    placeholder="Alguma informação adicional que gostaria de compartilhar..."
                  />
                </Box>

                {/* Botão de Envio */}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading || success}
                  sx={{ py: 2 }}
                  startIcon={loading ? <CircularProgress size={20} /> : <AttachMoney />}
                >
                  {loading ? 'Processando...' : success ? 'Reserva Enviada!' : `Solicitar Reserva - R$ ${valorTotal.toFixed(2)}`}
                </Button>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Aluguel;