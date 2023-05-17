import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Card, Button, Container, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link, useParams, useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';
import Swal from 'sweetalert2';

export default function ProductView({ product }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { productId } = useParams();

  const [quantity, setQuantity] = useState(0);
  const { name, description, price, _id } = product;

  const checkout = (productId, quantity) => {
    fetch('https://capstone-2-lansangan-edward.onrender.com/users/order-a-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        productId: productId,
        quantity: quantity,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data === true) {
          Swal.fire({
            title: 'SUCCESSFULLY ORDERED',
            icon: 'success',
            text: 'Thank you for ordering',
          });

          navigate('/products');
        } else {
          Swal.fire({
            title: 'ERROR OCCURRED',
            icon: 'error',
            text: 'Please try again',
          });
        }
      });
  };

  useEffect(() => {
    console.log(_id);

    fetch(`https://capstone-2-lansangan-edward.onrender.com/products/${_id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setQuantity(data.quantity);
      });
  }, [_id]);

  

  return (
    <Container fluid>
      <Row className="mt-3 mb-3">
        <Col xs={12} md={12}>
          <Card className="cardCourseCard ">
            <Card.Body>
          	  {/* Add the image template here */}
              <div className="image-template">
              <img src={product.image} alt={name} />
              </div>
              <Card.Title>{name}</Card.Title>
              <Card.Subtitle>Description:</Card.Subtitle>
              <Card.Text>{description}</Card.Text>
              <Card.Subtitle>Price:</Card.Subtitle>
              <Card.Text>{"\u20B1"} {price}</Card.Text>
         {/*     <Card.Text>
                Orders: {product.count}
              </Card.Text>
              </Row>*/}
              <Row className="justify-content-center align-items-center fixed-buttom">
              <Form.Group controlId="quantity" className="mb-3" style={{width: "6rem"}}>
              <Form.Label>Quantity</Form.Label>
              <Form.Select type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)}>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              </Form.Select>
              </Form.Group>
              </Row>
              <Card.Text>
                <Link as={Link} to={`/products/${_id}`}>
                  Details
                </Link>
              </Card.Text>

              {user.id !== null ? (
                <Row className="justify-content-center align-items-center fixed-buttom">
                  <Button
                    style={{ width: '15rem' }}
                    variant="primary"
                    onClick={() => checkout(_id, quantity)}
                  >
                    Checkout
                  </Button>
                </Row>
              ) : (
                <Row className="justify-content-center align-items-center fixed-buttom">
                  <Link style={{ width: '15rem' }} className="btn btn-danger" to="/login">
                    Login to Checkout
                  </Link>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

// ProductView.propTypes = {
//   // The shape method is used to check if a prop object conforms to a specific shape
//   product: PropTypes.shape({
//     // Define the properties and their expected types
//     name: PropTypes.string.isRequired,
//     description: PropTypes.string.isRequired,
//     price: PropTypes.number.isRequired,
//     quantity: PropTypes.number.isRequired,
// 	})
// }
