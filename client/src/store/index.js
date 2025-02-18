import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'

const store = configureStore({
  reducer: {
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for Firebase user object
        ignoredActions: ['auth/setUser'],
        // Ignore these field paths in state
        ignoredPaths: ['auth.user']
      }
    })
})

export default store