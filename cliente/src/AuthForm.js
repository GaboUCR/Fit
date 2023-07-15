import React, { useState, useContext } from 'react';
import LogIn from './LogIn';
import SignUp from './SignUp';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './AuthForm.css';

const AuthForm = () => {
  const [isLogIn, setIsLogIn] = useState(true);

  const toggleForm = () => {
    setIsLogIn(prevIsLogIn => !prevIsLogIn);
  }

  return (
    <Container className="auth-container justify-content-center">
      <Row className="justify-content-center">
        <Col xs={16} md={12}>
          {isLogIn ? <LogIn /> : <SignUp />}
          <Button className="mt-3 btn-sm btn-custom" variant="primary" onClick={toggleForm}>
            Switch to {isLogIn ? 'Sign Up' : 'Log In'}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthForm;

