import React, { useEffect, useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../UserContext';
import { Container, Row, Col } from 'react-bootstrap';
import ProductView from '../components/ProductView';

export default function Products() {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);

useEffect(() => {
  fetch('https://capstone-2-lansangan-edward.onrender.com/products/all-products')
    .then(res => res.json())
    .then(data => {
      // Filter the products array based on isActive property
      const activeProducts = data.filter(product => product.isActive === true);
      setProducts(activeProducts);
      console.log(data);
    });
}, []);


  if (user.isAdmin === true) {
    return <Navigate to="/admin" />;
  }

  return (
    <Container fluid>
      <h1 className="p-auto">Products</h1>
      <Row>
        {products.map(product => (
          <Col key={product._id} sm={12} md={6} lg={4}>
            <ProductView product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
