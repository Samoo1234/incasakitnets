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
    { id: 1, numero: '101', status: 'Disponível', diaria: 100.00 },
    { id: 2, numero: '102', status: 'Ocupado', diaria: 120.00 },
  ]);

  const [open, setOpen] = useState(false);
  const [currentKitnet, setCurrentKitnet] = useState(null);
  const [formData, setFormData] = useState({
    numero: '',
    status: '',
    diaria: ''
  });

  const handleOpen = (kitnet = null) => {
    if (kitnet) {
      setFormData(kitnet);
      setCurrentKitnet(kitnet);
    } else {
      setFormData({ numero: '', status: 'Disponível', diaria: '' });
      setCurrentKitnet(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentKitnet(null);
    setFormData({ numero: '', status: '', diaria: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
              <TableCell>Diária (R$)</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {kitnets.map((kitnet) => (
              <TableRow key={kitnet.id}>
                <TableCell>{kitnet.numero}</TableCell>
                <TableCell>{kitnet.status}</TableCell>
                <TableCell>{kitnet.diaria.toFixed(2)}</TableCell>
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
            margin="dense"
            name="numero"
            label="Número"
            type="text"
            fullWidth
            value={formData.numero}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="status"
            label="Status"
            type="text"
            fullWidth
            value={formData.status}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="diaria"
            label="Diária"
            type="number"
            fullWidth
            value={formData.diaria}
            onChange={handleChange}
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