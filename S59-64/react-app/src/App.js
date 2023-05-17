// import { Fragment } from 'react'
import { Container } from 'react-bootstrap'
import { BrowserRouter as Router } from 'react-router-dom'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import SpecificProduct from './pages/SpecificProduct'
import AppNavBar from './components/AppNavBar'
import Register from './pages/Register'
import Login from "./pages/Login" 
import Logout from "./pages/Logout" 
import Profile from "./pages/Profile" 
import Dashboard from './pages/Dashboard';
// import Undefined from "./pages/Undefined" 
import React from 'react'
import { useState, useEffect } from 'react';
import './App.css';
import { UserProvider } from './UserContext';



function App() {

  const [user, setUser] = useState({
    // email: localStorage.getItem('email')
    id: null,
    isAdmin: null
  });

  // Function for clearing storage on logout

  const unsetUser = () => {
    localStorage.clear()
  }

  // Used to check if the user information is properly stored upon login
useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    return;
  }
  fetch("https://capstone-2-lansangan-edward.onrender.com/users/details", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      setUser({
        id: data._id,
        isAdmin: data.isAdmin
      });
    })
    .catch(err => {
      console.error("Error retrieving user details:", err);
    });
}, []);


  return (

    <UserProvider value = {{user, setUser, unsetUser}}>
     <Router>
       <React.Fragment>
         <Container fluid>
           <AppNavBar />
           <Routes>
               <Route path="/register" element={<Register/>} />
               <Route path="/login" element={<Login/>} />
               <Route path="/logout" element={<Logout/>} />
               <Route path="/products" element={<Products/>} />
               <Route path="/home" element={<Home/>} />
               <Route path="/profile" element={<Profile/>} />
               <Route path="/admin" element={<Dashboard/>}/>   
               <Route path="/products/:productId" element={<SpecificProduct/>}/>   


           </Routes>
         </Container>
       </React.Fragment>
      </Router> 
     </UserProvider> 



  );
}

export default App;
