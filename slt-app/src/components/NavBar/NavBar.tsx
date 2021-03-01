import React, { useState } from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

const NavBar = () => {
    const [collapsed, setCollapsed] = useState<boolean | undefined>(true);

    const toggleNavbar = () => {
        setCollapsed(!collapsed)
    };

    return (
        <div>
            <Navbar light>
                <NavbarBrand href="/" className="mr-auto">Sign Language Tutor</NavbarBrand>
                <NavbarToggler onClick={toggleNavbar} className="mr-2" />
                <Collapse isOpen={!collapsed} navbar>
                    <Nav navbar>
                        <NavItem className="border-bottom">
                            <NavLink href="/">Home</NavLink>
                        </NavItem>
                        <NavItem className="border-bottom">
                            <NavLink href="/login">Login</NavLink>
                        </NavItem>
                        <NavItem className="border-bottom">
                            <NavLink href="/register">Register</NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    );
}

export default NavBar;
