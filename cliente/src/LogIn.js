import React, { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import {AuthContext} from './AuthProvider';

const LogIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [uiMsg, setUiMsg] = useState('');

  const { setIsAuthenticated, setUsername: setContextUsername } = useContext(AuthContext);

  const handleInputChange = (event) => {
    if (event.target.name === 'username') setUsername(event.target.value);
    if (event.target.name === 'password') setPassword(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3001/login', { username, password })
      .then(response => {
        if (response.status === 200) {
          localStorage.setItem('token', response.data.token);
          setIsAuthenticated(true);
          setContextUsername(response.data.username);
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 460) {
          setUiMsg('No such user found');
        } else if (error.response && error.response.status === 461) {
          setUiMsg('Wrong password');
        } else {
          console.error(error);
        }
      });
  }

  return (
  <Form onSubmit={handleSubmit}>
    <Form.Group>
      <Form.Label>name:</Form.Label>
      <Form.Control type="text" name="username" onChange={handleInputChange} />
    </Form.Group>
    <Form.Group>
      <Form.Label>Password:</Form.Label>
      <Form.Control type="password" name="password" onChange={handleInputChange} />
      <p style={{ color: 'red' }}>{uiMsg}</p>
    </Form.Group>
    <div className="d-flex mt-3 justify-content-center btn-custom">
      <Button type="submit" className="btn-sm">
        Log In
      </Button>
    </div>
  </Form>
  );
};

export default LogIn;
