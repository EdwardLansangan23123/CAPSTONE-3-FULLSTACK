import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Card, Button, Container, Form } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';
import Swal from 'sweetalert2';
import ProductView from '../components/ProductView';
import { Navigate } from 'react-router-dom';


export default function SpecificProduct() {
  const { user } = useContext(UserContext);
  const [product, setProduct] = useState(null);
  const { productId } = useParams();

  useEffect(() => {
    fetch(`http://localhost:4000/products/${productId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data) {
          setProduct(data);
        } else {
          setProduct(null);
        }
      })
      .catch(error => {
        console.log('Error fetching product:', error);
        setProduct(null);
      });
  }, [productId]);

  if (user.isAdmin === true) {
    return <Navigate to="/admin" />;
  }

  return (
    <Container fluid>
      <h1 className="p-auto">Product Details</h1>
      {product ? (
        <Row>
          <Col sm={12}>
            <ProductView product={product} />
          </Col>
        </Row>
      ) : (
        <p>Product not found.</p>
      )}
    </Container>
  );
}
