import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null); // Añadimos el estado para el nombre de usuario
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, username, setUsername }}>
      {children}
    </AuthContext.Provider>
  );
};
