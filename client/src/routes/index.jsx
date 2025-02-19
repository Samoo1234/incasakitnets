import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Box, CircularProgress } from '@mui/material'

// Lazy load components
const Login = React.lazy(() => import('../pages/Login'))
const Register = React.lazy(() => import('../pages/Register'))
const Dashboard = React.lazy(() => import('../pages/Dashboard'))
const Layout = React.lazy(() => import('../components/Layout'))
const Home = React.lazy(() => import('../pages/Home'))
const CadastrarKitnet = React.lazy(() => import('../pages/CadastrarKitnet'))
const Profile = React.lazy(() => import('../pages/Profile'))

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

const AppRoutes = () => {
  return (
    <React.Suspense
      fallback={
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      }
    >
      <Routes future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/cadastrar-kitnet"
          element={
            <PrivateRoute>
              <Layout>
                <CadastrarKitnet />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </React.Suspense>
  )
}

export default AppRoutes