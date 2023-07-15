import logo from './logo.svg';
import './App.css';
import AuthForm from './AuthForm';
import UserExercises from './UserExercises';
import NavbarComponent from './NavbarComponent';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <NavbarComponent />
      <Routes>
        <Route path="/account" element={ <UserExercises username="Gabriel" /> } />
      </Routes>
    </Router>
  );
}

//<Route path="/routine" element={ /* Colocar el componente de rutina aquí */ } />
//        <Route path="/user-routines" element={ /* Colocar el componente de rutinas de usuario aquí */ } />
export default App;
