import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null); 

  // Intentamos recuperar los ejercicios activos desde localStorage
  let initialExercises = {};
  try {
    const storedExercises = localStorage.getItem('activeExercises');
    if (storedExercises) {
      initialExercises = JSON.parse(storedExercises);
    }
  } catch (error) {
    console.error("Error loading exercises from localStorage:", error);
  }
  
  const [activeExercises, setActiveExercises] = useState(initialExercises);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, username, setUsername, activeExercises, setActiveExercises}}>
      {children}
    </AuthContext.Provider>
  );
};
