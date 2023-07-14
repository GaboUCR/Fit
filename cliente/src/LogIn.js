import React from 'react';

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
      <form onSubmit={this.handleSubmit}>
        <label>
          Email:
          <input type="email" name="email" onChange={this.handleInputChange} />
        </label>
        <label>
          Password:
          <input type="password" name="password" onChange={this.handleInputChange} />
        </label>
        <input type="submit" value="Log In" />
      </form>
    );
  }
}

export default LogIn;
