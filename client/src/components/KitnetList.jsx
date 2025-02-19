import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const KitnetList = () => {
  const [kitnets, setKitnets] = useState([
    { id: 1, numero: '101', status: 'Disponível', diaria: 100.00, periodo: 'diario' },
    { id: 2, numero: '102', status: 'Ocupado', diaria: 120.00, periodo: 'mensal' },
  ]);

  const [open, setOpen] = useState(false);
  const [currentKitnet, setCurrentKitnet] = useState(null);
  const [formData, setFormData] = useState({
    numero: '',
    status: '',
    valorMensal: '',
    valorDiario: '',
    valorAnual: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'valorMensal') {
      const valorMensal = parseFloat(value) || 0;
      const valorDiario = (valorMensal / 30).toFixed(2);
      const valorAnual = (valorMensal * 12).toFixed(2);
      setFormData({
        ...formData,
        valorMensal: value,
        valorDiario,
        valorAnual
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleOpen = (kitnet = null) => {
    setCurrentKitnet(kitnet);
    if (kitnet) {
      setFormData({
        numero: kitnet.numero,
        status: kitnet.status,
        valorMensal: kitnet.diaria * 30,
        valorDiario: kitnet.diaria,
        valorAnual: kitnet.diaria * 365
      });
    } else {
      setFormData({
        numero: '',
        status: '',
        valorMensal: '',
        valorDiario: '',
        valorAnual: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentKitnet(null);
    setFormData({
      numero: '',
      status: '',
      valorMensal: '',
      valorDiario: '',
      valorAnual: ''
    });
  };

  const handleSubmit = () => {
    if (currentKitnet) {
      setKitnets(kitnets.map(k => k.id === currentKitnet.id ? { ...formData, id: k.id } : k));
    } else {
      setKitnets([...kitnets, { ...formData, id: kitnets.length + 1 }]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    setKitnets(kitnets.filter(k => k.id !== id));
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <Typography variant="h6">Gerenciamento de Kitnets</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Adicionar Kitnet
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Número</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Valor (R$)</TableCell>
              <TableCell>Período</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {kitnets.map((kitnet) => (
              <TableRow key={kitnet.id}>
                <TableCell>{kitnet.numero}</TableCell>
                <TableCell>{kitnet.status}</TableCell>
                <TableCell>{kitnet.diaria.toFixed(2)}</TableCell>
                <TableCell>{kitnet.periodo === 'diario' ? 'Diário' : kitnet.periodo === 'mensal' ? 'Mensal' : 'Anual'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(kitnet)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(kitnet.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentKitnet ? 'Editar Kitnet' : 'Nova Kitnet'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Número da Kitnet"
            name="numero"
            value={formData.numero}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Valor Mensal (R$)"
            name="valorMensal"
            type="number"
            value={formData.valorMensal}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Valor Diário (R$)"
            name="valorDiario"
            type="number"
            value={formData.valorDiario}
            disabled
          />
          <TextField
            fullWidth
            margin="dense"
            label="Valor Anual (R$)"
            name="valorAnual"
            type="number"
            value={formData.valorAnual}
            disabled
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} color="primary">
            {currentKitnet ? 'Atualizar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default KitnetList;