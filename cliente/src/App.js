import './App.css';
import AuthForm from './AuthForm';
import UserExercises from './UserExercises';
import NavbarComponent from './NavbarComponent';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, AuthContext } from './AuthProvider';
import { useContext } from 'react';

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  return (
    <Router>
      <NavbarComponent />
      <Routes>
        <Route path="/account" element={ <UserExercises username="Gabriel" /> } />
      </Routes>
    </Router>
  );
}

function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}

export default AppWrapper;

//<Route path="/routine" element={ /* Colocar el componente de rutina aquí */ } />
//<Route path="/user-routines" element={ /* Colocar el componente de rutinas de usuario aquí */ } />