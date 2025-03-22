import PropTypes from 'prop-types';

export default function AddBreakdown(props){
    return(
        <>
            <tr>
                <td>{props.name}</td>
                <td>{props.date}</td>
                <td id="maintenance-description" style={{
                    wordBreak: 'break-word',
                    whiteSpace: 'normal',
                    maxWidth: '200px'
                }}>{props.description}</td>
                <td>{props.status}</td>
                <td>
                    <button id="edit-shop-btn">Edit</button>
                    <button id="delete-shop-btn">Delete</button>
                </td>
            </tr>
        </>
    )
}

AddBreakdown.propTypes = {
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired
}