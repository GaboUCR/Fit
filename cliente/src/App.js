import './App.css';
import AuthForm from './AuthForm';
import UserExercises from './UserExercises';
import Workout from './Workout';
import NavbarComponent from './NavbarComponent';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, AuthContext } from './AuthProvider';
import { useContext } from 'react';
import { useEffect, useState } from 'react';
import Routines from './Routines';

const LoadingComponent = () => {
  return (
    <div className="loading">
      <div className="loading-spinner"></div>
    </div>
  );
};

function App() {
  const { isAuthenticated, setIsAuthenticated, username, setUsername } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    if (token) {
      fetch('http://localhost:3001/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })
      .then(response => {
        if (response.ok) {         
          return response.json();
        } else {
          throw new Error('Authentication failed');
        }
      })
      .then(data => {
        setIsAuthenticated(true);
        setUsername(data.username);
      })
      .catch(error => {
        console.error('Error:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []); 
  
  if (isLoading) {
    return <LoadingComponent />; // Puedes reemplazar esto con tu propio componente de carga
  } else if (!isAuthenticated) {
    return <AuthForm />;
  } else {
    return (
      <Router>
        <NavbarComponent />
        <Routes>
          <Route path="/account" element={<UserExercises />}/>
          <Route path="/user-routines" element={<Routines />}/>
          <Route path="/workout" element={<Workout />} />
        </Routes>
      </Router>
    );
  }
  
}

function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}

export default AppWrapper;