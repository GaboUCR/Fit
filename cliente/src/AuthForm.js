import React from 'react';
import LogIn from './LogIn';
import SignUp from './SignUp';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './AuthForm.css';

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
      <Container className="auth-container justify-content-center">
        <Row className="justify-content-center">
          <Col xs={12} md={8}>
            {this.state.isLogIn ? <LogIn /> : <SignUp />}
            <Button className="mt-3 btn-sm btn-custom" variant="primary" onClick={this.toggleForm}>
              Switch to {this.state.isLogIn ? 'Sign Up' : 'Log In'}
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default AuthForm;
