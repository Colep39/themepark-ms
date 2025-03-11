import PropTypes from 'prop-types';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';

export default function NavBar() {
  return (
    <>
        <nav className="nav">
            <HomeLink to="/home" className="site-title">UmaZooma Land</HomeLink>
            <ul>
                <CustomLink to="/visit">Visit</CustomLink>
                <CustomLink to="/rides">Rides</CustomLink>
                <CustomLink to="/shops">Shops</CustomLink>
                <CustomLink to="/information">Emp Info</CustomLink>
                <li>
                    <button>Buy Tickets</button>
                </li>
                <li>
                    <button>My Tickets</button>
                </li>
                <li>
                    <button>Profile</button>
                </li>
                <li>
                    <button>Logout</button>
                </li>
                <CustomLink to="/cart"><i className="fa fa-shopping-cart"></i></CustomLink>
            </ul>
        </nav>
    </>
  )
}

// Define prop types
CustomLink.propTypes = {
    to: PropTypes.string.isRequired, // Ensures href is a required string
    children: PropTypes.node.isRequired // Ensures children is required
};

// CustomLink component
function CustomLink({to, children, ...props}){
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({path: resolvedPath.pathname, end: true});
    return (
        <li className = {isActive ? "active" : ""}>
            <Link to={to} {...props}>{children}</Link>
        </li>
    )
}
function HomeLink({ ...props}){
    return (
        <>
            <Link to="/home" {...props}>UmaZooma Land</Link>
        </>
    )
}