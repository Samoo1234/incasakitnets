import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Box, CircularProgress } from '@mui/material'

// Lazy load components for better performance
const Login = React.lazy(() => import('./pages/Login'))
const Register = React.lazy(() => import('./pages/Register'))
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const Layout = React.lazy(() => import('./components/Layout'))
const Home = React.lazy(() => import('./pages/Home'))

const PrivateRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth)

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  return user ? children : <Navigate to="/login" />
}

const App = () => {
  return (
    <React.Suspense
      fallback={
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      }
    >
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        {/* Add more protected routes here */}
      </Routes>
    </React.Suspense>
  )
}

export default App