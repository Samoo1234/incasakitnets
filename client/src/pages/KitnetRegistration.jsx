import React, { useState } from 'react'
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Grid,
  MenuItem,
  Alert,
  IconButton
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'

const KitnetRegistration = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    number: '',
    dailyRate: '',
    status: 'available',
    description: '',
    address: '',
    features: ''
  })
  const [photos, setPhotos] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files)
    const newPhotos = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))
    setPhotos(prevPhotos => [...prevPhotos, ...newPhotos])
  }

  const handleRemovePhoto = (index) => {
    setPhotos(prevPhotos => {
      const newPhotos = [...prevPhotos]
      URL.revokeObjectURL(newPhotos[index].preview)
      newPhotos.splice(index, 1)
      return newPhotos
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    try {
      // TODO: Implement Firebase integration for kitnet registration with photos
      console.log('Kitnet data:', { ...formData, photos })
      setSuccess(true)
      // Reset form after successful submission
      setFormData({
        number: '',
        dailyRate: '',
        status: 'available',
        description: '',
        address: '',
        features: ''
      })
      setPhotos([])
    } catch (error) {
      setError('Failed to register kitnet. Please try again.')
      console.error('Error registering kitnet:', error)
    }
  }

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Register New Kitnet
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Kitnet registered successfully!
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Kitnet Number"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Daily Rate (R$)"
                  name="dailyRate"
                  type="number"
                  value={formData.dailyRate}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  required
                  fullWidth
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <MenuItem value="available">Available</MenuItem>
                  <MenuItem value="occupied">Occupied</MenuItem>
                  <MenuItem value="maintenance">Under Maintenance</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Features"
                  name="features"
                  placeholder="e.g., Air conditioning, Furnished, Internet"
                  value={formData.features}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="photo-upload"
                  multiple
                  type="file"
                  onChange={handlePhotoUpload}
                />
                <label htmlFor="photo-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload Photos
                  </Button>
                </label>
              </Grid>
              {photos.length > 0 && (
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    {photos.map((photo, index) => (
                      <Grid item key={index} xs={6} sm={4} md={3}>
                        <Box
                          sx={{
                            position: 'relative',
                            paddingTop: '100%',
                            '& img': {
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }
                          }}
                        >
                          <img src={photo.preview} alt={`Kitnet photo ${index + 1}`} />
                          <IconButton
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              backgroundColor: 'rgba(255, 255, 255, 0.8)'
                            }}
                            size="small"
                            onClick={() => handleRemovePhoto(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              )}
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register Kitnet
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default KitnetRegistration