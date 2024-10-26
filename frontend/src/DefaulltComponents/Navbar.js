import { Container, Button, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthorized } from "../store/authSlice";


const NavbarComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthorized = useSelector((state) => state.auth.isAuthorized);
    // console.log(`isAuthorized= ${isAuthorized}`);
    const token = localStorage.getItem('token');
    console.log(`token= ${token}`);

    const handleLogout = () => {
        // Логика выхода из системы 
        dispatch(setAuthorized(false));
        localStorage.clear(); // Remove all data
        navigate('/login');
    };
    
    const handleBrandClick = () => {
        if (token) {
            navigate('/');
        } else {
            navigate('/login');
        }
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary" bg="light" data-bs-theme="light" style={{ boxShadow: '0 1px 5px rgba(0, 0, 0, 0.3)' }}>
            <Container>
                <Navbar.Brand 
                    onClick={handleBrandClick}
                    style={{ cursor: 'pointer' }}
                >
                    Hexlet Chat
                </Navbar.Brand>
                {isAuthorized ? (<Button variant="primary" onClick={handleLogout}>Выйти</Button>) : null}
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;