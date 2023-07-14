import React from 'react';

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
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" onChange={this.handleInputChange} />
        </label>
        <label>
          Email:
          <input type="email" name="email" onChange={this.handleInputChange} />
        </label>
        <label>
          Password:
          <input type="password" name="password" onChange={this.handleInputChange} />
        </label>
        <input type="submit" value="Sign Up" />
      </form>
    );
  }
}

export default SignUp;
