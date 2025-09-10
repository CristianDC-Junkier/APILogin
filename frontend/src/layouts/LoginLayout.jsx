import React from 'react';

const LoginLayout = ({ children }) => {
  return (
    <div className="login-layout">
      <header className="login-header">
        <h1>Iniciar sesión</h1>
      </header>
      <main className="login-content">
        {children}
      </main>
      <footer className="login-footer">
        <small>&copy; {new Date().getFullYear()} Tu Empresa</small>
      </footer>
    </div>
  );
};

export default LoginLayout;