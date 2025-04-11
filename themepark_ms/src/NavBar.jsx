import PropTypes from 'prop-types';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import {useState, useEffect} from "react";
import { UserContext } from './UserContext';
import { useContext } from 'react';

export default function NavBar() {

    const { role } = useContext(UserContext);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    /* const [role, setRole] = useState(null); */
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    }

    /*
    useEffect(() => {
        // Get the role from localStorage when component loads
        const storedRole = localStorage.getItem('role');
        setRole(storedRole);
    }, []);
    */

    const toggleDropDown = (dropdown) => {
        setDropdownOpen(dropdownOpen === dropdown ? null : dropdown);
    }

    

  return (
    <>
        <nav className="nav">
            <HomeLink to="/home" className="site-title">Ian Hawke Land</HomeLink>
            <ul>
                <CustomLink to="/visit">Visit</CustomLink>
                <CustomLink to="/rides">Rides</CustomLink>
                {/*Shop Dropdown */}
                <div className="dropdown">
                    <CustomLink to="/shops" className="dropdown-anchor" 
                    onClick={(e) => 
                        {e.preventDefault(); 
                        toggleDropDown("shop"); 
                    }}>Shop⏷</CustomLink>
                    {dropdownOpen === "shop" && (
                    <div className="dropdown-menu">
                        <Link to="/adventuregear" className="dropdown-item">Adventure Gear</Link>
                        <Link to="/gourmetbites" className="dropdown-item">Gourmet Bites</Link>
                        <Link to="/candykingdom" className="dropdown-item">Candy Kingdom</Link>
                    </div>
                    )}
                </div>

                {/*Employee Dropdown - only visible to the Admin and Staff*/}
                {(role == "Staff" || role == "Admin") && (
                    <div className="dropdown">
                        <CustomLink to="/information" className="dropdown-anchor2" 
                        onClick={(e) => 
                            {e.preventDefault(); 
                            toggleDropDown("employee"); 
                        }}>Employee⏷</CustomLink>
                        {dropdownOpen === "employee" && (
                        <div className="dropdown-menu2">
                            <Link to="/managerides" className="dropdown-item">Manage Rides</Link>
                            <Link to="/manageshops" className="dropdown-item">Manage Shops</Link>
                            <Link to="/managebreakdowns" className="dropdown-item">Manage Breakdowns</Link>
                            {/*<Link to="/ridelogs" className="dropdown-item">Ride Logs</Link> */}
                            <Link to="/recordweather" className="dropdown-item">Record Weather</Link>
                            <Link to="/ticketreport" className="dropdown-item">Ticket Report</Link>
                            <Link to="/weatherreport" className="dropdown-item">Weather Report</Link>
                            <Link to="/maintenancereport" className="dropdown-item">Maintenance Report</Link>

                            {/*Admin Only Pages*/}
                            {role == "Admin" && (
                                <Link to="/manageusers" className="dropdown-item">Manage Users</Link>,
                                <Link to="/adminpage" className="dropdown-item">Admin</Link>
                            )}
                        </div>
                        )}
                    </div>
                )}
    
                <CustomLink to="/buytickets">Buy Tickets</CustomLink>
                <CustomLink to="/mytickets">My Tickets</CustomLink>
                <CustomLink to="/profile">Profile</CustomLink>
                <li>
                    <div className="logout-btn-container">
                        <button className="beautiful-button" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
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
            <Link to="/home" {...props}>Gojo Land</Link>
        </>
    )
}