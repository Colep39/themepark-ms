import PropTypes from "prop-types";

export default function Ride ({name, src }) {
    return (
        <div className="ride">
            <h2>{name}</h2>
            <img src={src} alt={name} className="ride-img"></img>
        </div>
    )
}

Ride.propTypes = {
    name: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired
}