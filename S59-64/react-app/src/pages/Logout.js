import { Navigate } from 'react-router-dom';
import UserContext from '../UserContext'
import { useContext, useEffect} from 'react';

export default function Logout() {

	// Consume the UserContext object and destructure it to access the user state and unsetUser function from the context provider
	const { unsetUser, setUser} = useContext(UserContext);
	// Clear the localStorage of the user's information
	unsetUser();

	// Placing the "setUser" setter function inside of a useEffect is necessary because of updates within React JS that a state of another component cannot be updated while trying to render a different component
	// By adding the useEffect, this will allow the Logout page to render first before triggering the useEffect which changes the stateof the user
	useEffect(() =>{
		// Set the user state back to it's original value
		setUser({id: null});
	})

	return (

		<Navigate to="/login" />

		)
}