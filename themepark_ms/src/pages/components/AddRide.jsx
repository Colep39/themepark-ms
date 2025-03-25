import PropTypes from 'prop-types';

export default function AddRide(props){
    return(
        <>
            <tr>
                <td>{props.name}</td>
                <td>{props.type}</td>
                <td>{props.capacity}</td>
                <td>{props.status}</td>
                <td>{props.thrill}</td>
                <td>Null</td>
                <td>
                    <button id="edit-ride-btn">Edit</button>
                    <button id="delete-ride-btn">Delete</button>
                </td>
            </tr>
        </>
    )
}


AddRide.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    capacity: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    thrill: PropTypes.number.isRequired
}