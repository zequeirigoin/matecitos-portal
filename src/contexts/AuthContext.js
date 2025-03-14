import React, { useState, useContext } from 'react';

// Agregar export aquí
export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (email, password) => {
    /* USUARIOS VÁLIDOS... */
    const isValidUser = (
      (email === 'administracion@matecitos.ar' && password === 'Contador2025') ||
      (password === 'sociosX4' && [
        'ezequiel.i@matecitos.ar',
        'agustin.l@matecitos.ar',
        'juan.f@matecitos.ar',
        'esteban.r@matecitos.ar'
      ].includes(email))
    );

    if (isValidUser) {
      const user = { email };
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);  // This should trigger re-render
      return true;
    }
    throw new Error('Credenciales inválidas');
  };

  // Add logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};