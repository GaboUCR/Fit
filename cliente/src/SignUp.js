import React, { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import {AuthContext} from './AuthProvider';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);

  const { setIsAuthenticated, setUsername: setContextUsername } = useContext(AuthContext);

  const handleInputChange = (event) => {
    if (event.target.name === 'name') setUsername(event.target.value);
    if (event.target.name === 'password') setPassword(event.target.value);
    if (event.target.name === 'confirmPassword') setConfirmPassword(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError(true);
      setUsernameExists(false);
      return;
    }

    setPasswordError(false);
    const user = { username, password };

    axios.post('http://localhost:3001/signup', user)
      .then(response => {
        if (response.status === 200) {
          localStorage.setItem('token', response.data.token);
          setIsAuthenticated(true);
          setContextUsername(response.data.username);
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 409) {
          setPasswordError(false);
          setUsernameExists(true);
        } else {
          console.error(error);
        }
      });
  }

  return (
  <Form onSubmit={handleSubmit}>
    <Form.Group>
      <Form.Label>Name:</Form.Label>
      <Form.Control type="text" name="name" onChange={handleInputChange} />
    </Form.Group>
    <Form.Group>
      <Form.Label>Password:</Form.Label>
      <Form.Control type="password" name="password" onChange={handleInputChange} />
    </Form.Group>
    <Form.Group>
      <Form.Label>Confirm Password:</Form.Label>
      <Form.Control type="password" name="confirmPassword" onChange={handleInputChange} />
      {passwordError && <p style={{ color: 'red' }}>Passwords do not match.</p>}
      {usernameExists && <p style={{ color: 'red' }}>Username already in use</p>}
    </Form.Group>
    <div className="d-flex mt-3 justify-content-center btn-custom">
      <Button type="submit" className="btn-sm">
        Sign Up
      </Button>
    </div>
  </Form>
  );
};

export default SignUp;