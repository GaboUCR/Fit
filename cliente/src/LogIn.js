import React from 'react';
import { Form, Button } from 'react-bootstrap';

class LogIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
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
    // Aquí puedes manejar la lógica de inicio de sesión 
    // (como enviar una solicitud HTTP a tu API de inicio de sesión)
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
