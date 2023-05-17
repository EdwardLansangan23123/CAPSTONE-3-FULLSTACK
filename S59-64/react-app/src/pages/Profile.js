// [DEPENDENCIES]
import { useState, useEffect, useContext } from 'react';
import { Container, Card, Button, Modal, Form } from 'react-bootstrap';
import Orders from '../components/Orders';
import UserContext from '../UserContext';
import Swal from 'sweetalert2';
import UpdateProfile from '../components/UpdateProfile';
import ChangePassword from '../components/ChangePassword';
import TotalSpent from '../components/TotalSpent';

export default function Profile() {

// [FOR ALL]
	const [reload, setReload] = useState(false);

// [MY PROFILE]
	// const [user, setUser] = useState({});
	const { user, setUser } = useContext(UserContext);

// [FOR USER'S DASH: ADMIN ONLY]
	const [allUsers, setAllUsers] = useState([]);
	const currentUserEmail = localStorage.getItem('email');

// [FOR CHANGE QUANTITY MODAL]
	const [newQuantity, setNewQuantity] = useState('');
	const [quantityState, setQuantityState] = useState({});
	const {productId, orderId, productName, currentQuantity, totalAmount} = quantityState;
	const [isActive, setIsActive] = useState(false);
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = (orderId, productId, productName, currentQuantity, totalAmount) => {
		setQuantityState({
			...quantityState,
			orderId,
			productId,
			productName,
			currentQuantity,
			totalAmount
		});
		setShow(true);
	};
	const changeQuantity = (e) => {
		setNewQuantity(e.target.value);
	};

// [GET USER PROFILE]
	useEffect(() => {
		fetch(`https://capstone-2-lansangan-edward.onrender.com/users/details`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		})
		.then((res) => res.json())
		.then((data) => {
			setUser({
				...user,
				_id: data._id,
				isAdmin: data.isAdmin,
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				mobileNo: data.mobileNo,
				orderedProduct: data.orderedProduct
			});

			// Calculate total amount
		

		});
	},[]);//user

	useEffect(() => {
		fetch('https://capstone-2-lansangan-edward.onrender.com/users/all', {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		})
		.then(res => res.json())
		.then(data => {
			console.log(data)
			const filteredUsers = data.filter(user => user.email !== currentUserEmail);
			setAllUsers(filteredUsers);
		});
	}, [currentUserEmail, reload]);


// [SET AS ADMIN]
	const setAsAdmin = (userId, userName) => {
		fetch(`https://capstone-2-lansangan-edward.onrender.com/users/change-to-admin/${userId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({
				isAdmin: true
			})
		})
		.then(res => res.json())
		.then(data => {
			if(data){
				Swal.fire({
					title: "ADMIN PRIVILEGES INSTALLED",
					icon: "success",
					text: `${userName} is now an Admin.`
				});
				setReload(!reload);
			}
			else{
				Swal.fire({
					title: "SETTING FAILED",
					icon: "error",
					text: `Something went wrong. Please try again later!`
				})
			}
		})
	}



// [REMOVE AS ADMIN]
	const removeAsAdmin = (userId, userName) => {
		fetch(`https://capstone-2-lansangan-edward.onrender.com/users/remove-as-admin/${userId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({
				isAdmin: false
			})
		})
		.then(res => res.json())
		.then(data => {
			if(data){
				Swal.fire({
					title: "ADMIN PRIVILEGES REMOVED",
					icon: "success",
					text: `${userName} is no longer an Admin.`
				});
				setReload(!reload);
			}
			else{
				Swal.fire({
					title: "SETTING FAILED",
					icon: "error",
					text: `Something went wrong. Please try again later!`
				})
			}
		})
	}



// [CANCEL ORDER]
const cancelOrder = (userId, orderId) => {
  fetch(`https://capstone-2-lansangan-edward.onrender.com/users/cancel-order/${userId}/${orderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },  body: JSON.stringify({
      isCancelled: true,
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data) {
        Swal.fire({
          title: "ORDER SUCCESSFULLY CANCELLED",
          icon: "success",
          text: `You have cancelled your order.`
        });
        setReload(!reload);
      } else {
        Swal.fire({
          title: "SETTING FAILED",
          icon: "error",
          text: `Something went wrong. Please try again later!`
        });
      }
    })
    .catch(error => {
      console.log('Error cancelling order:', error);
      Swal.fire({
        title: "REQUEST FAILED",
        icon: "error",
        text: `Something went wrong. Please try again later!`
      });
    });
};




// [CHANGE QUANTITY]
	const setId = (userId) => {
		fetch(`https://capstone-2-lansangan-edward.onrender.com/users/change-quantity/${userId}/${orderId}/${productId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({
				quantity: newQuantity
			})
		})
		.then(res => res.json())
		.then(data => {
			if(data){
				Swal.fire({
					title: "QUANTITY SUCCESFULLY UPDATED",
					icon: "success",
					text: `You have made changes to your order`
				});
				handleClose();
			}
			else{
				Swal.fire({
					title: "UPDATE FAILED",
					icon: "error",
					text: `Something went wrong. Please try again later!`
				});
			}
		})
		setNewQuantity('');
	}

	useEffect(()=>{
		if(newQuantity !== '') {
			setIsActive(true)
		} else {
			setIsActive(false)
		}
	},[newQuantity])

	return (

// [USER'S DASHBOARD: ADMIN]

		user.isAdmin
		?
		<Container className="pt-3">
		<h1>User's Dashboard</h1>
		<Card className="main-card p-3">
		<Card.Title>My Profile</Card.Title>
		<Card.Subtitle>Name:</Card.Subtitle>
		<Card.Text>{user.firstName} {user.lastName}</Card.Text>
		<Card.Subtitle>Email:</Card.Subtitle>
		<Card.Text>{user.email}</Card.Text>
		<Card.Subtitle>Mobile No:</Card.Subtitle>
		<Card.Text>{user.mobileNo}</Card.Text>
		<UpdateProfile />
		<ChangePassword />
		</Card>
		<Card className="main-card mt-3 p-3">
		<Card.Title>List of Users</Card.Title>
		{allUsers.map(user => (
			<Card className="secondary-card m-3 p-3" key={user.email}>
			<Card.Subtitle>Name:</Card.Subtitle>
			<Card.Text>{user.firstName} {user.lastName}</Card.Text>
			<Card.Subtitle>Email:</Card.Subtitle>
			<Card.Text>{user.email}</Card.Text>
			<Card.Subtitle>Admin Status:</Card.Subtitle>
			<Card.Text>{user.isAdmin ? "Yes" : "No"}</Card.Text>
			{user.isAdmin ?
			<Button variant="danger" size="sm" onClick ={() => removeAsAdmin(user._id, user.firstName)}>Remove Admin Privileges</Button>			
			:
			<Button variant="success" size="sm" onClick ={() => setAsAdmin(user._id, user.firstName)}>Set As Admin</Button>
			}
		</Card>
		))}
		</Card>
		<Orders />
		</Container>
		:

// [PROFILE: USERS]
		<>
		<div className="profile-card">
		<Container className="profile-container p-3">
		<Card className="main-card p-3">
		<Card.Title>My Profile</Card.Title>
		<Card.Subtitle>Name:</Card.Subtitle>
		<Card.Text>{user.firstName} {user.lastName}</Card.Text>
		<Card.Subtitle>Email:</Card.Subtitle>
		<Card.Text>{user.email}</Card.Text>
		<Card.Subtitle>Mobile No:</Card.Subtitle>
		<Card.Text>{user.mobileNo}</Card.Text>
		<UpdateProfile />
		<ChangePassword />	
		<TotalSpent />	
		</Card>

{/*[USER'S ORDERS]*/}
		<Card className="main-card p-3 mt-3">
		<Card.Title>My Orders</Card.Title>
		{user.orderedProduct && user.orderedProduct.map((order) => (
		<Card className="secondary-card mb-3" key={order.orderId}>
		<Card.Body>
		<Card.Subtitle>Order No:</Card.Subtitle>
		<Card.Text>{order.orderId}</Card.Text>
		<Card.Subtitle>Product Name:</Card.Subtitle>
		{Object.keys(order.products).map((orderId) => (
		<Card.Text key={orderId}>
		{`${order.products[orderId].name}`}
		</Card.Text>
		))}
		<Card.Subtitle>Quantity:</Card.Subtitle>
		{Object.keys(order.products).map((orderId) => (
		<Card.Text key={orderId}>
		{`${order.products[orderId].quantity}`}
		</Card.Text>
		))}   
		<Card.Subtitle>Total Amount:</Card.Subtitle>
		<Card.Text>{"\u20B1"} {order.totalAmount}</Card.Text>
		<Card.Subtitle>Purchase Date:</Card.Subtitle>
		<Card.Text>{order.purchasedOn}</Card.Text>
		<Card.Subtitle>Order Status:</Card.Subtitle>
		<Card.Text>{order.isCancelled ? "Cancelled" : "Processing"}</Card.Text>

		{order.isCancelled ?
		<>
		{/*<Button className="m-2" variant="success" size="sm" onClick ={() => reOrder(user._id, order._id)}>Order Again</Button>*/}
		</>
		:
		<>
		<Button className="m-2" variant="danger" size="sm" onClick ={() => cancelOrder(user._id, order.orderId)}>Cancel Order</Button>
		{Object.keys(order.products).map((orderId) => (
		<Button key={orderId} size="sm" className="m-2" variant="primary" onClick={() => handleShow(order._id, order.products[orderId].productId, order.products[orderId].name, order.products[orderId].quantity, order.totalAmount)}>
		Change Quantity
		</Button>
		))} 
		</>
		}

		</Card.Body>
		</Card>
		))}
		</Card>
		</Container>
		</div>

{/* [CHANGE QUANTITY]*/}
		{user.orderedProduct && user.orderedProduct.map((order) => (
		<Modal show={show} onHide={handleClose} key={order.orderId}>
		<Modal.Header closeButton>
		<Modal.Title>Change Quantity</Modal.Title>
		</Modal.Header>
		<Modal.Body>
		<h5>Order No:</h5>
		<p>{order.orderId}</p>
		{Object.keys(order.products).map((productId) => (
		<div key={productId._id}>
		<h5>Product Name:</h5>           	
		<p>{productName}</p>
		<h5>Quantity:</h5>           	
		<p>{currentQuantity}</p>
		<h5>Total Amount:</h5>
		<p>{"\u20B1"} {totalAmount}</p>
		<Form>
		<Form.Group controlId="quantity" className="mb-3" style={{ width: '6rem' }}>
		<h5>Quantity</h5>
		<Form.Select type="number" value={newQuantity} onChange={changeQuantity}>
		<option>{currentQuantity}</option>
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
		</Form>
		</div>
		))} 
		</Modal.Body>
		<Modal.Footer>
		{
			isActive
			?
			<>
			<Button variant="secondary" onClick={handleClose}>
			Close
			</Button>
			{Object.keys(order.products).map((orderId) => (
			<Button key={orderId._id} variant="warning" onClick={(e) => { e.preventDefault(); setId(user._id);} }>
			Change
			</Button>
			))}
			</>
			: 
			<>
			<Button variant="secondary" onClick={handleClose}>
			Close
			</Button>
			<Button variant="warning" type="submit" id="submitBtn" disabled>
			Change
			</Button>
			</>
		}
		</Modal.Footer>
		</Modal>
		))}
		</>


	);

};
