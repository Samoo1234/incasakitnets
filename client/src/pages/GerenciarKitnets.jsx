import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  Chip,
  Avatar,
  Alert,
  CircularProgress,
  Container
} from '@mui/material';
import { collection, getDocs, doc, updateDoc, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import dayjs from 'dayjs';

const GerenciarKitnets = () => {
  const [kitnets, setKitnets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    carregarKitnets();
  }, []);

  const carregarKitnets = async () => {
    try {
      setLoading(true);
      setError('');
      
      const q = query(
        collection(db, 'kitnets'),
        orderBy('criadoEm', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const kitnetsData = [];
      
      querySnapshot.forEach(doc => {
        kitnetsData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setKitnets(kitnetsData);
    } catch (error) {
      console.error('Erro ao carregar kitnets:', error);
      setError('Erro ao carregar kitnets. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const toggleDisponibilidade = async (kitnetId, novoStatus) => {
    try {
      setUpdating(prev => ({ ...prev, [kitnetId]: true }));
      
      const kitnetRef = doc(db, 'kitnets', kitnetId);
      await updateDoc(kitnetRef, {
        disponivel: novoStatus
      });
      
      // Atualizar o estado local
      setKitnets(prev => prev.map(kitnet => 
        kitnet.id === kitnetId 
          ? { ...kitnet, disponivel: novoStatus }
          : kitnet
      ));
      
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      setError('Erro ao atualizar status da kitnet. Tente novamente.');
    } finally {
      setUpdating(prev => ({ ...prev, [kitnetId]: false }));
    }
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
          Gerenciar Kitnets
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Imagem</TableCell>
                <TableCell>Título</TableCell>
                <TableCell>Endereço</TableCell>
                <TableCell>Valor Diária</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Criado em</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {kitnets.map((kitnet) => (
                <TableRow key={kitnet.id}>
                  <TableCell>
                    <Avatar
                      src={kitnet.imageUrl}
                      alt={kitnet.titulo}
                      variant="rounded"
                      sx={{ width: 60, height: 60 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {kitnet.titulo}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {kitnet.endereco}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" color="primary">
                      R$ {kitnet.valorDiaria}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={kitnet.disponivel ? 'Disponível' : 'Indisponível'}
                      color={kitnet.disponivel ? 'success' : 'error'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {kitnet.criadoEm ? dayjs(kitnet.criadoEm.toDate()).format('DD/MM/YYYY') : 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2">
                        {kitnet.disponivel ? 'Ativo' : 'Inativo'}
                      </Typography>
                      <Switch
                        checked={kitnet.disponivel}
                        onChange={(e) => toggleDisponibilidade(kitnet.id, e.target.checked)}
                        disabled={updating[kitnet.id]}
                      />
                      {updating[kitnet.id] && <CircularProgress size={20} />}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {kitnets.length === 0 && !loading && (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary">
              Nenhuma kitnet cadastrada ainda.
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default GerenciarKitnets; 