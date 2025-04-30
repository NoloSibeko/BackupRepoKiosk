import React from 'react';
import { 
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Menu,
  MenuItem,
  Avatar
} from '@mui/material';
import {
  ShoppingCart,
  AccountBalanceWallet,
  Receipt,
  Store,
  Menu as MenuIcon,
  AccountCircle
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        {/* Logo/Brand Name */}
        <Typography 
          variant="h6" 
          component={Link} 
          to="/"
          sx={{ 
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          MyKiosk
        </Typography>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
          <IconButton 
            component={Link} 
            to="/products" 
            color="inherit"
            size="large"
            sx={{ mx: 1 }}
          >
            <Store />
            <Typography variant="body2" sx={{ ml: 1 }}>Products</Typography>
          </IconButton>

          <IconButton 
            component={Link} 
            to="/cart" 
            color="inherit"
            size="large"
            sx={{ mx: 1 }}
          >
            <Badge badgeContent={4} color="error">
              <ShoppingCart />
            </Badge>
            <Typography variant="body2" sx={{ ml: 1 }}>Cart</Typography>
          </IconButton>

          <IconButton 
            component={Link} 
            to="/wallet" 
            color="inherit"
            size="large"
            sx={{ mx: 1 }}
          >
            <AccountBalanceWallet />
            <Typography variant="body2" sx={{ ml: 1 }}>Wallet</Typography>
          </IconButton>

          <IconButton 
            component={Link} 
            to="/transactions" 
            color="inherit"
            size="large"
            sx={{ mx: 1 }}
          >
            <Receipt />
            <Typography variant="body2" sx={{ ml: 1 }}>Transactions</Typography>
          </IconButton>
        </Box>

        {/* Mobile Menu Button */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
          >
            <MenuItem component={Link} to="/products" onClick={handleClose}>
              <Store sx={{ mr: 1 }} /> Products
            </MenuItem>
            <MenuItem component={Link} to="/cart" onClick={handleClose}>
              <Badge badgeContent={4} color="error" sx={{ mr: 1 }}>
                <ShoppingCart />
              </Badge>
              Cart
            </MenuItem>
            <MenuItem component={Link} to="/wallet" onClick={handleClose}>
              <AccountBalanceWallet sx={{ mr: 1 }} /> Wallet
            </MenuItem>
            <MenuItem component={Link} to="/transactions" onClick={handleClose}>
              <Receipt sx={{ mr: 1 }} /> Transactions
            </MenuItem>
          </Menu>
        </Box>

        {/* User Profile */}
        <IconButton
          size="large"
          edge="end"
          aria-label="account of current user"
          color="inherit"
          component={Link}
          to="/profile"
        >
          <Avatar sx={{ width: 32, height: 32 }}>
            <AccountCircle />
          </Avatar>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;