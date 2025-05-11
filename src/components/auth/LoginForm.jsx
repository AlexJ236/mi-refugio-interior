import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import InputField from '../common/InputField';
import Button from '../common/Button';
import { InlineSpinner } from '../common/LoadingSpinner';
import '../../styles/components/Auth.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, authError, setAuthError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null); // Limpia errores previos con cada intento
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard'); // Redirige al dashboard en un abrazo de bienvenida
    } 
    catch (error) {
      console.error("Fallo en el login desde el formulario:", error);
    } 
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-form-container">
      <h2>Tu Refugio Te Espera</h2>
      <p className="form-subtitle">Ingresa con amor para continuar tu viaje interior.</p>
      {authError && <p className="auth-error-message">{authError}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <InputField
          id="email"
          label="Tu Correo Electrónico:"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ejemplo@corazonenpaz.com"
          required
        />
        <InputField
          id="password"
          label="Tu Contraseña Secreta:"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Un secreto entre tú y la app"
          required
        />
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? <>Entrando <InlineSpinner /></> : 'Abrir Mi Espacio Seguro'}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;