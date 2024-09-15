import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import NotFound from './NotFound';
import Home from './Home';
import { useSelector } from 'react-redux';

function App() {
  const token = useSelector((state) => state.auth.token);

  return (
      <Routes>
        <Route 
          path="/"
          element={token ? <Home /> : <Navigate to="/login" />}
        />
        <Route 
          path="/login"
          element={token ? <Navigate to="/" /> : <Login />}
        />
        <Route 
          path="*" 
          element={<NotFound />} // Страница 404
        />
      </Routes>
  );
}

export default App;
