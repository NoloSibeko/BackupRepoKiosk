import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Wallet from './pages/Wallet';
import Transactions from './pages/Transactions';
import Products from './components/Products';
import Logout from './pages/Logout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/*" element={
          <>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/product" element={<Product />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/products" element={<Products />} />
              <Route path="/logout" element={<Logout />} />
            </Routes>
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;