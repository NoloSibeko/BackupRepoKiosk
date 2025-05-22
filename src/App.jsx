import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Wallet from './pages/Wallet';
import Transactions from './pages/Transactions';
import Products from './components/Products';
import Logout from './pages/Logout';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const getUserIdFromToken = () => {
  const token = localStorage.getItem('jwtToken');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId; // Adjust according to your token structure
  } catch (e) {
    console.error('Failed to decode token', e);
    return null;
  }
};

function App() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const id = getUserIdFromToken(); // Now this function is defined
    setUserId(id);
  }, []);

  const isAuthenticated = !!localStorage.getItem('authToken'); // Check if the user is logged in

  return (
    <Router>
      <Routes>
        {/* Default route: Redirect to Login if not authenticated */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/product"
          element={isAuthenticated ? <Product /> : <Navigate to="/login" />}
        />
        <Route
          path="/cart"
          element={isAuthenticated ? <Cart /> : <Navigate to="/login" />}
        />
        <Route
          path="/wallet"
          element={isAuthenticated ? <Wallet /> : <Navigate to="/login" />}
        />
        <Route
          path="/transactions"
          element={isAuthenticated ? <Transactions /> : <Navigate to="/login" />}
        />
        <Route
          path="/products"
          element={isAuthenticated ? <Products /> : <Navigate to="/login" />}
        />
        <Route
          path="/logout"
          element={isAuthenticated ? <Logout /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;