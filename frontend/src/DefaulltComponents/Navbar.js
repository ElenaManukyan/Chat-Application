import { Container, Button, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setAuthorized } from '../store/authSlice';

const NavbarComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthorized = useSelector((state) => state.auth.isAuthorized);
  const token = localStorage.getItem('token');
  const { t } = useTranslation();

  useEffect(() => {
    if (token) {
      dispatch(setAuthorized(true));
    } else {
      dispatch(setAuthorized(false));
    }
  }, [dispatch, token]);

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
        <Navbar.Brand onClick={handleBrandClick} style={{ cursor: 'pointer' }}>
          {t('navbar.logo')}
        </Navbar.Brand>
        {isAuthorized ? (
          <Button variant="primary" onClick={handleLogout}>
            {t('navbar.logout')}
          </Button>
        ) : null}
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
