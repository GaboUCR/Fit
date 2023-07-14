import React from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      password: '',
      confirmPassword:'',
      passwordError: false
    };
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({ passwordError: true });
      return;
    }
    this.setState({ passwordError: false });

    const user = {
      username: this.state.name,
      password: this.state.password
    };

    axios.post('http://localhost:3001/signup', user)
      .then(response => {
        console.log('Signup successful');
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
          <Form.Label>Name:</Form.Label>
          <Form.Control type="text" name="name" onChange={this.handleInputChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password:</Form.Label>
          <Form.Control type="password" name="password" onChange={this.handleInputChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Confirm Password:</Form.Label>
          <Form.Control type="password" name="confirmPassword" onChange={this.handleInputChange} />
          {this.state.passwordError && <p style={{ color: 'red' }}>Passwords do not match.</p>}
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
