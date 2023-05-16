import { Fragment } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <Fragment>
      <div
        className="homepage"
        style={{
          backgroundPosition: 'center',
          minHeight: '100vh',
        }}
      >
        <h1>MEAT KING</h1>

        <div className="button-container">
          <Link to="/products">
            <button className="text-light bg-dark">ORDER NOW!</button>
          </Link>
        </div>

      </div>
    </Fragment>
  );
}
