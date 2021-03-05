import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { UserContext } from '../../UserContext';

const NavBar = () => {

    const { auth } = useContext(UserContext);

    return (

        <div>
            <nav className="navbar navbar-dark bg-dark">
                <Link to={auth ? "/" : "/login"} className="navbar-brand mr-auto">Sign Language Tutor</Link>
                {auth ?
                    <div>
                         <Link to="/" className="navbar-brand navbar-text ml-auto">Home</Link>
                         <Link to="" className="navbar-brand navbar-text ml-auto">Account</Link>
                         <Link to="" className="navbar-brand navbar-text ml-auto">Logout</Link>
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
