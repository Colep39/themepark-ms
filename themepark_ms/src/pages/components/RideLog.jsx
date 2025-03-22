import PropTypes from 'prop-types';

export default function RideLog(props){
    return(
        <>
            <tr>
                <td>{props.name}</td>
                <td>{props.date}</td>
                <td>{props.count}</td>
            </tr>
        </>
    )
}

RideLog.propTypes = {
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired
}