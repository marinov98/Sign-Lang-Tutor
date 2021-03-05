import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { logout, UserContext } from './../../utils/auth'

const NavBar: React.FunctionComponent = () => {
    const history = useHistory()
    const { authenticated, checkAuth } = useContext(UserContext);

    if (!authenticated)
        history.replace('/login')

    const handleLogout = async (e: React.MouseEvent<HTMLElement>) => {
        await logout();
        checkAuth();
    }


    return (

        <div>
            <nav className="navbar navbar-dark bg-dark">
                <Link to={authenticated ? "/" : "/login"} className="navbar-brand mr-auto">Sign Language Tutor</Link>
                {authenticated ?
                    <div>
                         <Link to="/" className="navbar-brand navbar-text ml-auto">Home</Link>
                         <Link to="" className="navbar-brand navbar-text ml-auto">Account</Link>
                         <Link to="" className="navbar-brand navbar-text ml-auto" onClick={handleLogout}>Logout</Link>
                    </div> :
                    <div>
                        <Link to="/login" className="navbar-brand navbar-text">Login</Link>
                        <Link to="/register" className="navbar-brand navbar-text">Register</Link>
                    </div>
                }
            </nav>
        </div>
    );
}

export default NavBar;
