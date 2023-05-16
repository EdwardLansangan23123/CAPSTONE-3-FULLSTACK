import {useState, useEffect, useContext} from 'react'
import {Form, Button} from 'react-bootstrap'
import { Row, Col , Card} from 'react-bootstrap';
import { Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import UserContext from '../UserContext';

export default function Register () {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [mobileNo, setMobileNo] = useState('')
  const [email, setEmail] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  // state to determine whether submit button is enabled or not
  const [isActive, setIsActive] = useState('')
  const { user } = useContext(UserContext);
  const navigate = useNavigate()

  console.log(email)
  console.log(password1)
  console.log(password2)

  // function to simulate user registration
  function registerUser (e) {
    // prevents page redirection via form submission
    e.preventDefault()

    fetch('http://localhost:4000/users/checkEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email })
    })
    .then(res => res.json())
    .then(data => {
      if(data === true) {
        Swal.fire({
          title: "Duplicate email found",
          icon: "error",
          text: "Please provide a different email."
        });
        
      } else {
      fetch('http://localhost:4000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          mobileNo: mobileNo,
          email: email,
          password: password1
        })
      })
      .then(res => res.json())
      .then(data => {
        console.log(data); 
        Swal.fire({
          title: "Registration successful",
          icon: "success",
          text: "Welcome to MEAT KING!"
        }); 
      });

      navigate('/login')
    }
    })





    // clear input fields
    setEmail('')
    setPassword1('')
    setPassword2('')

    alert('Thank you for registering')
  }

  useEffect(() => {
    // validation to enable submit button when all fields are populated and both passwords match
    if (
         email !== '' &&
         password1 !== '' &&
         password2 !== '' &&
         firstName !== '' &&
         lastName !== '' &&
         mobileNo !== '' &&
         password1 === password2
       ) {
      setIsActive(true)
    } else {
      setIsActive(false)
    }
  }, [firstName, lastName, mobileNo, email, password1, password2])

  return (
    (user.id !== null) ?
    <Navigate to="/products"/>
    :
    <Row className="justify-content-center">
    <Col xs={12} md={4}>
      <Card className="cardCourseCard p-3 m-3">
          <h2>Registration form</h2>
        <Form onSubmit={(e) => registerUser(e)}>

        <Form.Group controlId="myFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control 
                type="text" 
                placeholder="Given Name" 
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
            />
        </Form.Group>

        <Form.Group controlId="myLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control 
                type="text" 
                placeholder="Surname" 
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
            />
        </Form.Group>

        <Form.Group controlId="myMobileNumber">
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control 
                type="Number" 
                placeholder="Enter your 11 digit phone number" 
                value={mobileNo}
                onChange={e => {
                     const input = e.target.value;
                     if (input.length <= 11 ) {
                       setMobileNo(input);
                     }
                   }}
                required
            />
        </Form.Group>

          <Form.Group controlId="userEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control 
                  type="email" 
                  placeholder="Enter email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
              />
              <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
              </Form.Text>
          </Form.Group>

          <Form.Group controlId="password1">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                  type="password" 
                  placeholder="Password" 
                  value={password1}
                  onChange={e => setPassword1(e.target.value)}
                  required
              />
          </Form.Group>

          <Form.Group controlId="password2">
              <Form.Label>Verify Password</Form.Label>
              <Form.Control 
                  type="password" 
                  placeholder="Verify Password" 
                  value={password2}
                  onChange={e => setPassword2(e.target.value)}
                  required
              />
          </Form.Group>

          {isActive ? 
            <Button variant="primary" type="submit" id="submitBtn" className="mt-2">
                Submit
            </Button>
            :
            <Button variant="primary" type="submit" id="submitBtn" disabled className="mt-2">
                Submit
            </Button>
          }
      </Form>

    </Card>
  </Col>
  </Row>
  )
}