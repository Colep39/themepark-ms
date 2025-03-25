import PropTypes from 'prop-types';

export default function AddUser(props){
    return (
        <>
            <tr>
                <td>{props.firstname}</td>
                <td>{props.lastname}</td>
                <td>{props.username}</td>
                <td>{props.email}</td>
                <td>{props.role}</td>
                <td>{props.status}</td>
                <td>
                    <button id="edit-user-btn">Edit</button>
                    <button id="delete-user-btn">Delete</button>
                </td>
            </tr>
        </>
    )
}

AddUser.propTypes = {
    firstname: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired
}