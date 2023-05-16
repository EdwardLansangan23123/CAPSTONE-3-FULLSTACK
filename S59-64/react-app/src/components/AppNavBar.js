import React, { useContext } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import UserContext from '../UserContext';

export default function AppNavBar() {
  const { user } = useContext(UserContext);

  return (
    <Navbar className="navbar" expand="lg">
      <Navbar.Brand className="brand">ONLINE STORE</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mt-2">
          <Nav.Link as={NavLink} to="/home">
            HOME
          </Nav.Link>
           
           
       

          <React.Fragment>
            <Nav.Link as={NavLink} to="/products">
              PRODUCTS
            </Nav.Link>

            <Nav.Link as={NavLink} to="/profile">
              PROFILE
            </Nav.Link>
          </React.Fragment>
          
          
          {user.id !== null ? (
            <Nav.Link as={NavLink} to="/logout">
              LOGOUT
            </Nav.Link>
          ) : (
            <React.Fragment>
              <Nav.Link as={NavLink} to="/register">
                REGISTER
              </Nav.Link>
              <Nav.Link as={NavLink} to="/login">
                LOGIN
              </Nav.Link>
            </React.Fragment>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
