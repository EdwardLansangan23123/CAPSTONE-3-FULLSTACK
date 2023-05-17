import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';
import { Row, Form, Button, Modal } from 'react-bootstrap';

export default function AddProduct() {

	const {user} = useContext(UserContext);

	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState(0);
	const [productImg, setProductImg] = useState('');

	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => {
	  setShow(true);
	};

	const productImgHandler = (e) => {
		const file = e.target.files[0];

		transformFile(file);
	};

	const transformFile = (file) => {
		const reader = new FileReader();

		if(file) {
			reader.readAsDataURL(file);
			reader.onloadend = () => {
				setProductImg(reader.result);
			};
		} else {
			setProductImg('');
		}; 
	};

	const [isActive, setIsActive] = useState(false);

	function addProduct(e) {

		fetch(`https://capstone-2-lansangan-edward.onrender.com/products/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({
				name: name,
				description: description,
				price: price,
				image: productImg
			})
		})
		.then(res => res.json())
		.then(data => {
			console.log(data);

			if(data){
				Swal.fire({
					title: "PRODUCT SUCCESFULLY ADDED",
					icon: "success",
					text: `${name} is now added`
				});
				handleClose();
			}
			else{
				Swal.fire({
					title: "ERROR!",
					icon: "error",
					text: `Something went wrong. Please try again later!`
				});
			}

		})

		setName('');
		setDescription('');
		setPrice(0);
		setProductImg('');

	}

	useEffect(() => {

		if(name !== "" && description !== "" && price > 0){
			setIsActive(true);
		} else {
			setIsActive(false);
		}

	}, [name, description, price]);

	return (
		user.isAdmin
		?
		<>
			<div className="d-flex justify-content-center">
				<Button className="mt-3" variant="primary" style={{ width: '100%' }} onClick={() => handleShow()}>Add Product</Button>
			</div>
			<Modal show={show} onHide={handleClose} size="lg">
				<Modal.Header closeButton>
					<Modal.Title>Add a Product</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Row className="edit-product-card">
						<div style={{ display: "flex", flexDirection: "row", width: "100%"}}>
							<div className="edit-form-container">
								<Form onSubmit={(e) => addProduct()}>
									<Form.Group controlId="imgfile" className="mb-3">
										<Form.Label>Product Photo</Form.Label>
										<Form.Control
										type="file"
										accept="image/"
										onChange={productImgHandler}
										required
										/>
									</Form.Group>

									<Form.Group controlId="name" className="mb-3">
										<Form.Label>Product Name</Form.Label>
										<Form.Control 
										type="text" 
										placeholder="Enter Product Name" 
										value = {name}
										onChange={e => setName(e.target.value)}
										required
										/>
									</Form.Group>

									<Form.Group controlId="description" className="mb-3">
										<Form.Label>Product Description</Form.Label>
										<Form.Control
										as="textarea"
										rows={3}
										placeholder="Enter Product Description" 
										value = {description}
										onChange={e => setDescription(e.target.value)}
										required
										/>
									</Form.Group>

									<Form.Group controlId="price" className="mb-3">
										<Form.Label>Product Price</Form.Label>
										<Form.Control 
										type="number" 
										placeholder="Enter Product Price" 
										value = {price}
										onChange={e => setPrice(e.target.value)}
										required
										/>
									</Form.Group>
								</Form>
								</div>	
								<div className="product-preview-container">
									<div className="product-preview-box">
										{productImg ?
										<img src={productImg} alt={name} className="product-preview" />
										:
										<span style={{color: "#6c757d"}}>No Image Selected</span>
										}
									</div>
								</div>
							
						</div>
					</Row>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>Cancel</Button>
					<Button variant="warning" onClick={(e) => {e.preventDefault(); addProduct();}} disabled={!isActive}>Add Now</Button>
				</Modal.Footer>
			</Modal>
		</>
		:
		<Navigate to="/products" />

	)

}
