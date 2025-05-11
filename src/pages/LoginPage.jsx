import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import '../styles/pages/LoginPage.css';

const LoginPage = () => {
  return (
    <div className="login-page-container">
      <h1 className="page-title">Bienvenida a Tu Santuario</h1>
      <p className="page-subtitle">
        Aquí, cada paso es un acto de amor propio.
        Ingresa para reconectar con tu esencia y cultivar tu paz interior.
      </p>
      <LoginForm />
    </div>
  );
};

export default LoginPage;