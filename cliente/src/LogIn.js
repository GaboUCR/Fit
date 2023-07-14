import React from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

class LogIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3001/login', this.state)
      .then(response => {
        console.log(response);
        // Aquí puedes manejar la respuesta del servidor
      })
      .catch(error => {
        console.error(error);
        // Aquí puedes manejar los errores
      });
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group>
          <Form.Label>name:</Form.Label>
          <Form.Control type="text" name="username" onChange={this.handleInputChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password:</Form.Label>
          <Form.Control type="password" name="password" onChange={this.handleInputChange} />
        </Form.Group>
        <div className="d-flex mt-3 justify-content-center btn-custom">
          <Button type="submit" className="btn-sm">
            Log In
          </Button>
        </div>
      </Form>
    );
  }
}

export default LogIn;
