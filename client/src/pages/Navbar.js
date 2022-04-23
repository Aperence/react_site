import React from "react";
import {Navbar, Container, Nav, NavDropdown} from "react-bootstrap"
import { Outlet } from "react-router-dom";
import axios from "axios";

function NavBar(props){
    return (
        <>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
            <Navbar.Brand href="/">Home</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                <Nav.Link href="/Blog">Blog</Nav.Link>
                </Nav>
                <Nav>
                {props.name ? 
                (<NavDropdown title="Account" id="collasible-nav-dropdown">
                    <NavDropdown.Item href="/users/profile">Profile</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/" onClick={() => {axios.get("/users/logout")}}>Log out</NavDropdown.Item>
                </NavDropdown>)
                :
                (<Nav.Link href="/users/login">Log in</Nav.Link>)
                }
                
                </Nav>
            </Navbar.Collapse>
            </Container>
        </Navbar>
        <Outlet/>
        </>
    )
}

export default NavBar