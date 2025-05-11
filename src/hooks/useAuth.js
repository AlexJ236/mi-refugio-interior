import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider. Envuelve tu app con él, con cariño.');
  }
  return context;
};

export default useAuth;