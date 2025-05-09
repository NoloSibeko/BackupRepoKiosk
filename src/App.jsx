import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Wallet from './pages/Wallet';
import Transactions from './pages/Transactions';
import Products from './components/Products';
import Logout from './pages/Logout';

function App() {
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