import React from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

class LogIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      uiMsg: ""
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
        if (response.status === 200) {
          console.log(response);
          // Aquí puedes manejar la respuesta del servidor cuando la autenticación es exitosa
        }
        
      })
      .catch(error => {
        if (error.response && error.response.status === 460) {

          this.setState({ uiMsg: 'No such user found'});
          return;

        } else if (error.response && error.response.status === 461) {

          this.setState({ uiMsg: 'Wrong password'});
          return;

        } else {
          console.error(error);
          // Aquí puedes manejar los demás errores
        }
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
          <p style={{ color: 'red' }}>{this.state.uiMsg}</p>
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
