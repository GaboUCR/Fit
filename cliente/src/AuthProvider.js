import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null); // Añadimos el estado para el nombre de usuario
  const [activeExercises, setActiveExercises] = useState({});
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, username, setUsername, activeExercises, setActiveExercises}}>
      {children}
    </AuthContext.Provider>
  );
};
