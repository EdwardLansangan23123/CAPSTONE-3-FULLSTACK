import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';
import { Button, Modal, Card } from 'react-bootstrap';

export default function TotalSpent() {
  const { user } = useContext(UserContext);
  const [totalAmountSpent, setTotalAmountSpent] = useState(0);
  const [show, setShow] = useState(false);

  const showTotalSpent = () => {
    fetch('http://localhost:4000/users/totalAmount', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTotalAmountSpent(data.totalAmount);
      })
      .catch((error) => {
        console.error('Error:', error);
        Swal.fire({
          title: 'Error!',
          icon: 'error',
          text: 'Something went wrong. Please try again later!',
        });
      });
  };

  useEffect(() => {
    showTotalSpent();
  }, []);

  const handleButtonClick = () => {
    // Handle button click action here
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    !user.isAdmin ? (
      <>
        <div className="d-flex justify-content-center">
          <Button className="mt-3" variant="primary" style={{ width: '100%' }} onClick={handleShow}>SHOW AMOUNT SPENT</Button>
        </div>
        <Modal show={show} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Total Amount Spent</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card className="main-card p-3 mt-3">
              <Card.Subtitle>Total Amount Spent:</Card.Subtitle>
              <Card.Text>{"\u20B1"} {totalAmountSpent}</Card.Text>
            </Card>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      </>
    ) : (
      <Navigate to="/home" />
    )
  );
}
