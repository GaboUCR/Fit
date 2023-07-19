import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null); 
  const [activeExercises, setActiveExercises] = useState([]);

  // Recuperamos los ejercicios activos desde localStorage solo una vez al montar el componente
  useEffect(() => {
    let initialExercises = [];
    try {
      const storedExercises = localStorage.getItem('activeExercises');
      if (storedExercises) {
        initialExercises = JSON.parse(storedExercises);
      }
    } catch (error) {
      console.error("Error loading exercises from localStorage:", error);
    }

    setActiveExercises(initialExercises);
  }, []);  // Nota el array vacío aquí

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, username, setUsername, activeExercises, setActiveExercises}}>
      {children}
    </AuthContext.Provider>
  );
};
