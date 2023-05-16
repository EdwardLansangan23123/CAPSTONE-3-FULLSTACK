import { useState, useEffect, useContext } from 'react';
import UserContext from '../UserContext';
import Swal from 'sweetalert2';
import { Form, Button, Modal } from 'react-bootstrap';

export default function ChangePassword() {

	const { user } = useContext(UserContext);

	const [password1, setPassword1] = useState('');
	const [password2, setPassword2] = useState('');
	const [userId, setUserId] = useState('');

	const [isActive, setIsActive] = useState(false);

	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = (userId) => {
		setUserId(userId);
		setShow(true);
	};

	const setId = (userId) => {
		fetch(`http://localhost:4000/users/changePassword/${userId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({
				password: password1
			})
		})
		.then(res => res.json())
		.then(data => {
			console.log(data);

			if(data){
				Swal.fire({
					title: "PASSWORD SUCCESFULLY CHANGED",
					icon: "success",
					text: `You have made changes to your profile`
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

		setPassword1('');
		setPassword2('');

	};

	useEffect(()=>{
		if((password1 !== "" && password2 !== "") && (password1 === password2)){
			setIsActive(true)
		}else{
			setIsActive(false)
		}

	},[password1, password2])

	return (
		<>	
		<div className="d-flex justify-content-center">
		<Button className="mt-3" variant="primary" style={{ width: '100%' }} onClick={() => handleShow(user.id)}>Change Password</Button>
		</div>
		<Modal show={show} onHide={handleClose}>
		<Modal.Header closeButton>
		<Modal.Title>Change Password</Modal.Title>
		</Modal.Header>
		<Modal.Body>
		<Form>
		<Form.Group controlId="password1">
		<Form.Label>New Password</Form.Label>
		<Form.Control 
		type="password" 
		placeholder="Enter New Password" 
		onChange={e => setPassword1(e.target.value)}
		required
		/>
		</Form.Group>
		<Form.Group controlId="password2">
		<Form.Label>Re-enter Password</Form.Label>
		<Form.Control 
		type="password" 
		placeholder="Re-enter Password" 
		onChange={e => setPassword2(e.target.value)}
		required
		/>
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
};
