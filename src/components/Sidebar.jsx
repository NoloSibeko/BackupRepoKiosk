import React from 'react';
import {
  Box,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  Drawer,
  Badge,
} from '@mui/material';
import {
  ShoppingCart,
  AccountBalanceWallet,
  ReceiptLong,
  Person,
  Logout,
  Menu,
} from '@mui/icons-material';
import SingularImage from '../images/SingularSocialSharingImage.png';

const SIDEBAR_WIDTH = 64;
const SIDEBAR_EXPANDED_WIDTH = 220;

const Sidebar = ({
  expanded,
  onExpand,
  cartItemsCount,
  walletBalance,
  onCartClick,
  onWalletClick,
  onTransactionsClick,
  onProfileClick,
  onLogoutClick,
}) => (
  <Drawer
    variant="permanent"
    open={expanded}
    PaperProps={{
      sx: {
        width: expanded ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_WIDTH,
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        overflowX: 'hidden',
        bgcolor: '#fff',
        borderRight: '1px solid #e0e0e0',
        boxShadow: 3,
        zIndex: 1201,
      },
    }}
  >
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: expanded ? 'flex-start' : 'center',
        height: '100%',
        py: 2,
        px: expanded ? 2 : 0,
        transition: 'padding 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      {/* Hamburger menu */}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: expanded ? 'flex-end' : 'center', mb: 1 }}>
        <IconButton onClick={onExpand} size="small">
          <Menu />
        </IconButton>
      </Box>
      {/* Singular Image */}
      <Box
        component="img"
        src={SingularImage}
        alt="Singular"
        sx={{
          width: expanded ? 120 : 32,
          height: expanded ? 120 : 32,
          borderRadius: 2,
          mx: 'auto',
          mb: 2,
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      />
      <Divider sx={{ width: '100%', mb: 2 }} />
      {/* Sidebar Icons */}
      <Tooltip title="Cart" placement="right" arrow disableHoverListener={expanded}>
        <Box
          sx={{
            width: '100%',
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            px: expanded ? 1 : 0,
            py: 1,
            borderRadius: 2,
            transition: 'background 0.2s',
            '&:hover': { bgcolor: '#f5f5f5' },
          }}
          onClick={onCartClick}
        >
          <Badge badgeContent={cartItemsCount} color="error" sx={{ mx: expanded ? 0 : 'auto' }}>
            <ShoppingCart fontSize={expanded ? "medium" : "small"} />
          </Badge>
          {expanded && (
            <Typography sx={{ ml: 2, fontWeight: 500 }}>Cart</Typography>
          )}
        </Box>
      </Tooltip>
      <Tooltip title="Wallet" placement="right" arrow disableHoverListener={expanded}>
        <Box
          sx={{
            width: '100%',
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            px: expanded ? 1 : 0,
            py: 1,
            borderRadius: 2,
            transition: 'background 0.2s',
            '&:hover': { bgcolor: '#f5f5f5' },
          }}
          onClick={onWalletClick}
        >
          <AccountBalanceWallet fontSize={expanded ? "medium" : "small"} color="primary" />
          {expanded && (
            <Box sx={{ ml: 2 }}>
              <Typography sx={{ fontWeight: 500 }}>Wallet</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                R {typeof walletBalance === 'number' ? walletBalance.toFixed(2) : '0.00'}
              </Typography>
            </Box>
          )}
        </Box>
      </Tooltip>
      <Tooltip title="Transactions" placement="right" arrow disableHoverListener={expanded}>
        <Box
          sx={{
            width: '100%',
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            px: expanded ? 1 : 0,
            py: 1,
            borderRadius: 2,
            transition: 'background 0.2s',
            '&:hover': { bgcolor: '#f5f5f5' },
          }}
          onClick={onTransactionsClick}
        >
          <ReceiptLong fontSize={expanded ? "medium" : "small"} color="action" />
          {expanded && (
            <Typography sx={{ ml: 2, fontWeight: 500 }}>Transactions</Typography>
          )}
        </Box>
      </Tooltip>
      <Tooltip title="Profile" placement="right" arrow disableHoverListener={expanded}>
        <Box
          sx={{
            width: '100%',
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            px: expanded ? 1 : 0,
            py: 1,
            borderRadius: 2,
            transition: 'background 0.2s',
            '&:hover': { bgcolor: '#f5f5f5' },
          }}
          onClick={onProfileClick}
        >
          <Person fontSize={expanded ? "medium" : "small"} color="action" />
          {expanded && (
            <Typography sx={{ ml: 2, fontWeight: 500 }}>Profile</Typography>
          )}
        </Box>
      </Tooltip>
      <Divider sx={{ width: '100%', my: 2 }} />
      <Tooltip title="Logout" placement="right" arrow disableHoverListener={expanded}>
        <Box
          sx={{
            width: '100%',
            mt: 'auto',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            px: expanded ? 1 : 0,
            py: 1,
            borderRadius: 2,
            transition: 'background 0.2s',
            '&:hover': { bgcolor: '#ffeaea' },
          }}
          onClick={onLogoutClick}
        >
          <Logout fontSize={expanded ? "medium" : "small"} color="error" />
          {expanded && (
            <Typography sx={{ ml: 2, fontWeight: 500, color: 'error.main' }}>Logout</Typography>
          )}
        </Box>
      </Tooltip>
    </Box>
  </Drawer>
);

export default Sidebar;