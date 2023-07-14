import React from 'react';
import { Form, Button } from 'react-bootstrap';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
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
    // Aquí puedes manejar la lógica de registro 
    // (como enviar una solicitud HTTP a tu API de registro)
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group>
          <Form.Label>Name:</Form.Label>
          <Form.Control type="text" name="name" onChange={this.handleInputChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Email:</Form.Label>
          <Form.Control type="email" name="email" onChange={this.handleInputChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password:</Form.Label>
          <Form.Control type="password" name="password" onChange={this.handleInputChange} />
        </Form.Group>
        <div className="d-flex mt-3 justify-content-center btn-custom">
          <Button type="submit" className="btn-sm">
            Sign Up
          </Button>
        </div>
      </Form>
    );
  }
}

export default SignUp;
