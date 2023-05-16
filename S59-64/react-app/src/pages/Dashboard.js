import { useContext, useState, useEffect } from 'react';
import { Table, Row, Form, Button, Modal, Container } from 'react-bootstrap';
import {Navigate} from 'react-router-dom';
import UserContext from '../UserContext';
import Swal from 'sweetalert2';
import AddProduct from '../components/AddProduct';

export default function Dashboard(){

	const {user} = useContext(UserContext);

	const [allProducts, setAllProducts] = useState([]);

	const [editId, setEditId] = useState('');
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState(0);
	const [productImg, setProductImg] = useState('');
	const [previewImg, setPreviewImg] = useState('');

	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => {
	  setShow(true);
	};
	const productImgHandler = (e) => {
		const file = e.target.files[0];
		transformFile(file);

		if(e.target.files && e.target.files[0]) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setProductImg(e.target.result);
			};
			reader.readAsDataURL(e.target.files[0]);
		}
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

// [ALL PRODUCTS LIST]
	const fetchData = () =>{

		fetch(`http://localhost:4000/products/all-products`,{
			headers:{
				"Authorization": `Bearer ${localStorage.getItem("token")}`
			}
		})
		.then(res => res.json())
		.then(data => {

			setAllProducts(data.map((product, index) => {
				let count = index + 1;
				return(
					<tr key={product._id}>
					<td>{count}</td>
					<td>{product.name}</td>
					<td style={{width: "50%"}}>{product.description.slice(0, 85)}{product.description.length > 85 ? "..." : ""}</td>
					<td>{product.price}</td>
					<td>{product.isActive ? "Active" : "Inactive"}</td>
					<td className="d-flex align-items-center justify-content-center">
					{product.isActive
					?
					<>
					<Button variant="danger" size="sm" style={{width: "70px"}} onClick ={() => archive(product._id, product.name)}>Hide</Button>
					<Button variant="secondary" size="sm" className="mx-2" style={{width: "70px"}} onClick ={() => {productPreview(product._id); handleShow();}} disabled>Edit</Button>
					</>
					:
					<>
					<Button variant="success" size="sm" style={{width: "70px"}} onClick ={() => unarchive(product._id, product.name)}>Unhide</Button>
					<Button variant="warning" size="sm" className="mx-2" style={{width: "70px"}} onClick ={() => {productPreview(product._id); handleShow();}}>Edit</Button>
					</>
					}
					</td>
					</tr>
					)
				}))
			})
		}

// [HIDE PRODUCT]
	const archive = (productId, productName) => {

		fetch(`http://localhost:4000/products/hide/${productId}`,{
			method: "PUT",
			headers:{
				"Content-Type": "application/json",
				"Authorization": `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({
				isActive: false
			})
		})
		.then(res => res.json())
		.then(data =>{
			if(data){
				Swal.fire({
					title: "PRODUCT ARCHIVED",
					icon: "success",
					text: `${productName} is now hidden.`
				})
				fetchData();
			}
			else{
				Swal.fire({
					title: "ARCHIVING FAILED",
					icon: "error",
					text: `Something went wrong. Please try again later!`
				})
			}
		})
	}

// [ACTIVATE PRODUCT]
			const unarchive = (productId, productName) =>{

				fetch(`http://localhost:4000/products/activate/${productId}`,{
					method: "PUT",
					headers:{
						"Content-Type": "application/json",
						"Authorization": `Bearer ${localStorage.getItem('token')}`
					},
					body: JSON.stringify({
						isActive: true
					})
				})
				.then(res => res.json())
				.then(data =>{
					console.log(data);

					if(data){
						Swal.fire({
							title: "PRODUCT ACTIVATED",
							icon: "success",
							text: `${productName} is now active.`
						})
						fetchData();
					}
					else{
						Swal.fire({
							title: "ACTIVATION FAILED",
							icon: "error",
							text: `Something went wrong. Please try again later!`
						})
					}
				})
			}

			useEffect(()=>{

				fetchData();
			})



// [EDIT PRODUCT]
			function editProduct(productId) {
				const body = {
					name: name,
					description: description,
					price: price,
					image: productImg,
				};

				if (productImg) {
					body.image = productImg
				} else {
					body.image = null;
				};

				fetch(`http://localhost:4000/products/${productId}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${localStorage.getItem('token')}`
					},
					body: JSON.stringify(body),
				})
				.then(res => res.json())
				.then(data => {

					if(data){
						Swal.fire({
							title: "PRODUCT SUCCESFULLY UPDATED",
							icon: "success",
							text: `${name} is now updated`
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
				setName('');
				setDescription('');
				setPrice(0);
				setProductImg('');
			};

			const productPreview = (productId) => {
				fetch(`http://localhost:4000/products/${productId}`) .then(res => res.json())
				.then(data => {
					setEditId(productId)
					setName(data.name);
					setDescription(data.description);
					setPrice(data.price);
					setPreviewImg(data.image.secure_url);
				});
			}
			

			useEffect(() => {
				if(name !== "" && description !== "" && price > 0 ){
					setIsActive(true);
				} else {
					setIsActive(false);
				}
			}, [name, description, price]);

// [PRODUCT DASHBOARD]
			return(
				(user.isAdmin)
				?
				<>
				<Container className="product-dash">
				<div className='pt-5 pb-3 text-center'>
				<h1>Product Dashboard</h1>
				<div className='pb-3 mx-auto' style={{width: '10rem'}}>
				<AddProduct />
				</div>
				</div>
				
					<Table striped hover responsive className="product-dash-table">

				      <thead>
				        <tr>
				          <th>#</th>
				          <th>Name</th>
				          <th>Description</th>
				          <th>Price</th>
				          <th>Status</th>
				          <th className="d-flex align-items-center justify-content-center">Actions</th>

				        </tr>
				      </thead>
				      <tbody>
				        {allProducts}
				      </tbody>

				    </Table>
				    </Container>

{/* [EDIT PRODUCT]*/}
				<Modal  show={show} onHide={handleClose} size="lg">
				<Modal.Header closeButton>
					<Modal.Title>Edit Product</Modal.Title>
				</Modal.Header>
				<Modal.Body>
				<Row className="edit-product-card">
							<div style={{ display: "flex", flexDirection: "row", width: "100%"}}>
							<div className="edit-form-container">
							<Form onSubmit={(e) => editProduct(e)}>
							<Form.Group controlId="imgfile" className="mb-3">
							<Form.Label>Product Photo</Form.Label>
							<Form.Control
								type="file"
								accept="image/"
								onChange={productImgHandler}
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
							{productImg ? (
								<img src={productImg} alt={name} className="product-preview" />
								):(previewImg ?
									<img src={previewImg} alt={name} className="product-preview" />
									:
									<span style={{color: "#6c757d"}}>No Image Selected</span>
							)}
							</div>
							</div>			
						</div>	
				</Row>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>Cancel</Button>
					<Button variant="warning" onClick={(e) => {e.preventDefault(); editProduct(editId);}} disabled={!isActive}>Save Changes</Button>
				</Modal.Footer>
				</Modal>
			</>
				:
				<Navigate to="/products" />
				)
		}
