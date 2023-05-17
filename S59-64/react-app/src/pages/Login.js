import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';
import Swal from 'sweetalert2';

export default function Login() {
  const { user, setUser } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Validation to enable the submit button when all fields are populated
    if (email !== '' && password !== '') {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [email, password]);

  function authenticate(e) {
    e.preventDefault();

    fetch('https://capstone-2-lansangan-edward.onrender.com/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);

        if (typeof data.access !== 'undefined') {
          localStorage.setItem('token', data.access);
          localStorage.setItem('email', email);
          retrieveUserDetails(data.access);
          Swal.fire({
            title: 'Login Successful',
            icon: 'success',
            text: 'Welcome to MEAT KING',
          });
          navigate('/home');
        } else {
          Swal.fire({
            title: 'Authentication failed',
            icon: 'error',
            text: 'Check your login details and try again',
          });
        }
      })
      .catch(err => {
        console.error('Error authenticating user:', err);
        Swal.fire({
          title: 'Authentication failed',
          icon: 'error',
          text: 'An error occurred while authenticating your account. Please try again later.',
        });
      });
  }

  const retrieveUserDetails = token => {
    return fetch('https://capstone-2-lansangan-edward.onrender.com/users/details', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data.isAdmin);
        console.log(data._id);
        setUser({
          id: data._id,
          isAdmin: data.isAdmin,
        });
      })
      .catch(err => {
        console.error('Error retrieving user details:', err);
      });
  };

  if (user.id && user.isAdmin) {
    return <Navigate to="/register" />;
  }

  return (
    <Row className="justify-content-center m-3 p-3">
      <Col xs={12} md={4}>
        <Card className="cardCourseCard p-3 m-3">
          <h2>Login</h2>
          <Form onSubmit={e => authenticate(e)}>
            <Form.Group controlId="userEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="password1" className="mb-2">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            {isActive ? (
              <Button variant="success" type="submit" id="submitBtn">
                Submit
              </Button>
            ) :

              <Button variant="success" type="submit" id="submitBtn" disabled>
                  Submit
              </Button>
            }
        </Form>

      </Card>
    </Col>
    </Row>
  )
}