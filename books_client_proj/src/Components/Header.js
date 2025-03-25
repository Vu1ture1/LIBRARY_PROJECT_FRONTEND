import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { getUserRole } from '../CookieWork/DecryptCookieAndRetToken';

const Header = () => {

    //const role = getUserRole();

    const [role, setRole] = useState(getUserRole());

    useEffect(() => {
        const interval = setInterval(() => {
            setRole(getUserRole()); 
        }, 500); 
        return () => clearInterval(interval); 
    }, []);

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Navbar.Brand style={{marginLeft: "10px"}} href="/books">Список книг</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
                <Nav.Link href="/search">Поиск книги</Nav.Link>

                {(role === "Admin") && (
                    <NavDropdown title="Действия админа" id="basic-nav-dropdown">
                        <NavDropdown.Item href="/add_book">Добавить книгу</NavDropdown.Item>
                        <NavDropdown.Item href="/add_author">Добавить автора</NavDropdown.Item>
                    </NavDropdown>
                )}

                
            </Nav>
            
            {(role === "Admin" || role === "User") && (
                <Nav className="ms-auto">
                    <Nav.Link href="/account">Аккаунт</Nav.Link>
                    <Nav.Link href="/logout" replace>Выйти</Nav.Link>
                </Nav>
            )}

            {(role === null) && (
                <Nav className="ms-auto">
                    <Nav.Link href="/login">Войти</Nav.Link>
                    <Nav.Link href="/register">Регистрация</Nav.Link>
                </Nav>
            )}
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;
