import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NavbarComponent = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      {/* El logo de la app que lleva al componente de rutina */}
      <Navbar.Brand as={Link} to="/routine">
        <img
          alt=""
          src="/logo.png" // Cambia esto por la ruta a tu imagen de logo
          width="30"
          height="30"
          className="d-inline-block align-top"
        />{' '}
        Workout 
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />

      {/* Sección de navegación a la derecha */}
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav>
          {/* Enlace a la cuenta del usuario */}
          <Nav.Link as={Link} to="/account">Account</Nav.Link>

          {/* Enlace a las rutinas del usuario */}
          <Nav.Link as={Link} to="/user-routines">User Routines</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarComponent;
