import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Input,
  FormHelperText
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/pt-br';

const RentalForm = ({ onSubmit, kitnetData, initialDate, finalDate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    cpf: '',
    rg: '',
    birthDate: null,
    occupants: '',
    document: null
  });
  const [errors, setErrors] = useState({});

  const validateCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]/g, '');
    if (cpf.length !== 11) return false;
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(10))) return false;
    
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      document: file
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório';
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    if (!formData.rg.trim()) {
      newErrors.rg = 'RG é obrigatório';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Data de nascimento é obrigatória';
    }

    if (!formData.occupants || formData.occupants < 1) {
      newErrors.occupants = 'Número de ocupantes inválido';
    }

    if (!formData.document) {
      newErrors.document = 'Documento é obrigatório';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit({
        ...formData,
        initialDate,
        finalDate
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Formulário de Aluguel
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nome Completo"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              error={!!errors.fullName}
              helperText={errors.fullName}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="CPF"
              name="cpf"
              value={formData.cpf}
              onChange={handleInputChange}
              error={!!errors.cpf}
              helperText={errors.cpf}
              inputProps={{
                maxLength: 14,
                placeholder: '000.000.000-00'
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="RG"
              name="rg"
              value={formData.rg}
              onChange={handleInputChange}
              error={!!errors.rg}
              helperText={errors.rg}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
              <DatePicker
                label="Data de Nascimento"
                value={formData.birthDate}
                onChange={(newValue) => {
                  setFormData(prev => ({ ...prev, birthDate: newValue }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!errors.birthDate}
                    helperText={errors.birthDate}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Quantidade de Pessoas"
              name="occupants"
              type="number"
              value={formData.occupants}
              onChange={handleInputChange}
              error={!!errors.occupants}
              helperText={errors.occupants}
              inputProps={{ min: 1 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Input
              type="file"
              fullWidth
              onChange={handleFileChange}
              error={!!errors.document}
            />
            <FormHelperText error={!!errors.document}>
              {errors.document || 'Anexe um documento de identificação'}
            </FormHelperText>
          </Grid>
        </Grid>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Enviar
        </Button>
      </Box>
    </Container>
  );
};

export default RentalForm;