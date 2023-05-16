import { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/products/all-products')
      .then(res => res.json())
      .then(data => {
        setOrders(data);
      })
      .catch(error => console.error(error));
  }, []);

  console.log(orders);

  return (
    <Card className="main-card mt-3 p-3">
      <Card.Title>List of Product Orders</Card.Title>
      {orders.length > 0 ? (
        orders.map(product => (
          <Card className="secondary-card mt-3 p-3" key={product.name}>
            <Card.Body>
              <Card.Subtitle>Product Name:</Card.Subtitle>
              <Card.Text>{product.name}</Card.Text>
              <Card.Subtitle>Price:</Card.Subtitle>
              <Card.Text>{"\u20B1"} {product.price}</Card.Text>
              <Card.Subtitle>Orders from this Product:</Card.Subtitle>
              {product.userOrders.map((order) => (
                <Card className="tertiary-card mt-3 p-3" key={order._id}>
                  <Card.Subtitle>Order ID:</Card.Subtitle>
                  <Card.Text>{order.orderId}</Card.Text>
                  <Card.Subtitle>User ID:</Card.Subtitle>
                  <Card.Text>{order.userId}</Card.Text>
                  <Card.Subtitle>Status:</Card.Subtitle>
                  <Card.Text>{order.isCancelled ? "Cancelled" : "Processing"}</Card.Text>
                  <Card.Subtitle>Quantity:</Card.Subtitle>
                  <Card.Text>{order.quantity}</Card.Text>
                  <Card.Subtitle>Ordered On:</Card.Subtitle>
                  <Card.Text>{order.purchasedOn}</Card.Text>
                </Card>
              ))}
            </Card.Body>
          </Card>
        ))
      ) : (
        <Card.Text>No orders found.</Card.Text>
      )}
    </Card>
  );
}
