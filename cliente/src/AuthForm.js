import React from 'react';
import LogIn from './LogIn';
import SignUp from './SignUp';
import { Button } from 'react-bootstrap';

class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogIn: true
    };
  }

  toggleForm = () => {
    this.setState(prevState => ({
      isLogIn: !prevState.isLogIn
    }));
  }

  render() {
    return (
      <div>
        {this.state.isLogIn ? <LogIn /> : <SignUp />}
        <Button onClick={this.toggleForm}>
          Switch to {this.state.isLogIn ? 'Sign Up' : 'Log In'}
        </Button>
      </div>
    );
  }
}

export default AuthForm;
