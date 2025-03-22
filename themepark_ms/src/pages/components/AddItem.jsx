import PropTypes from 'prop-types';

export default function AddItem(props){
    return(
        <>
            <tr>
                <td>{props.item}</td>
                <td>{props.shop}</td>
                <td>{props.price}</td>
                <td>{props.image}</td>
                <td>{props.status}</td>
                <td>
                    <button id="edit-shop-btn">Edit</button>
                    <button id="delete-shop-btn">Delete</button>
                </td>
            </tr>
        </>
    )
}

AddItem.propTypes = {
    item: PropTypes.string.isRequired,
    shop: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired
}