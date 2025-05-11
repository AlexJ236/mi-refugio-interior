import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { currentUser, isLoadingAuth } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) {
    // Muestra un spinner mientras se verifica la autenticación
    // Esto evita el parpadeo de redirigir a login y luego a la ruta protegida
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 70px)', flexDirection: 'column' }}>
            <LoadingSpinner /> {/* Usamos el spinner completo aquí */}
        </div>
    );
  }

  if (!currentUser) {
    // Si no hay usuario y la carga ha terminado, redirige al login
    // Guarda la ubicación actual para que podamos redirigir de nuevo después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si hay usuario y la carga ha terminado, renderiza el componente hijo
  return children;
};

export default ProtectedRoute;