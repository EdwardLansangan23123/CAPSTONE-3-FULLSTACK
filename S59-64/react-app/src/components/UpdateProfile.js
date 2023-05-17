import { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';
import { Form, Button, Modal } from 'react-bootstrap';

export default function UpdateProfile() {

  const { user } = useContext(UserContext);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [userId, setUserId] = useState('');

  const [isActive, setIsActive] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (userId) => {
    setUserId(userId);
    setShow(true);
  };

  const setId = (userId) => {
    fetch(`https://capstone-2-lansangan-edward.onrender.com/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        mobileNo: mobileNo
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      if (data) {
        Swal.fire({
          title: 'PROFILE SUCCESSFULLY UPDATED',
          icon: 'success',
          text: `You have made changes to your profile`,
        });
        handleClose();
      } else {
        Swal.fire({
          title: 'UPDATE FAILED',
          icon: 'error',
          text: `Something went wrong. Please try again later!`,
        });
      }
    });
  };
  useEffect(() => {
    if (firstName !== '' && lastName !== '' && email !== '' && mobileNo !== '') {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [firstName, lastName, email, mobileNo]);

  useEffect(() => {
    fetch(`https://capstone-2-lansangan-edward.onrender.com/users/details`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then((res) => res.json())
    .then(({ firstName, lastName, email, mobileNo }) => {
      setFirstName(firstName);
      setLastName(lastName);
      setEmail(email);
      setMobileNo(mobileNo);
    });
  }, [user]);

  return (
    <>
    <div className="d-flex justify-content-center">
    <Button className="mt-3" variant="primary" style={{ width: '100%' }} onClick={() => handleShow(user.id)}>Update Profile</Button>
    </div>
    <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
    <Modal.Title>Update Profile</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <Form>
    <Form.Group controlId="formFirstName">
    <Form.Label>First Name</Form.Label>
    <Form.Control type="text" placeholder="Enter First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
    </Form.Group>
    <Form.Group controlId="formLastName">
    <Form.Label>Last Name</Form.Label>
    <Form.Control type="text" placeholder="Enter Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
    </Form.Group>
    <Form.Group controlId="formEmail">
    <Form.Label>Email</Form.Label>
    <Form.Control type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
    </Form.Group>
    <Form.Group controlId="formMobileNo">
    <Form.Label>Mobile Number</Form.Label>
    <Form.Control type="text" placeholder="Enter Mobile Number" value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} />
    </Form.Group>
    </Form>
    </Modal.Body>
    <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>Close</Button>
    <Button variant="warning" onClick={() => setId(userId)} disabled={!isActive}>Save Changes</Button>
    </Modal.Footer>
    </Modal>
    </>
    );
}
