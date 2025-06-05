import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Avatar,
  IconButton,
  Divider,
  Chip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Edit, 
  Delete, 
  Close, 
  Logout, 
  Search,
  AccountBalanceWallet
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserId, logout, getCurrentUserRole } from '../api/auth';

// User Profile Section Component
const UserProfileSection = ({ onClose }) => {
  const [user, setUser] = useState(null);
 const [loading, setLoading] = useState(true);
 
  const [editMode, setEditMode] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    contactNumber: '',
    accountStatus: '',
    role: '',
    password: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const userId = getCurrentUserId();
  const navigate = useNavigate();

 useEffect(() => {
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://localhost:7273/api/Users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });

      console.log('API Response:', response.data); // Debug log

      if (response.data) {
        setUser(response.data);
        setFormData({
          name: response.data.name || '',
          surname: response.data.surname || '',
          email: response.data.email || '',
          contactNumber: response.data.contactNumber || '',
          accountStatus: response.data.accountStatus || 'Active',
          role: response.data.role || 'User',
          password: ''
        });
        
        console.log('FormData after set:', response.data); // Debug log
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load user data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  fetchUserData();
}, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSave = async () => {
  if (!userId) {
    setSnackbar({
      open: true,
      message: 'Invalid user ID. Cannot update profile.',
      severity: 'error',
    });
    return;
  }

  // Prepare payload with all required fields
  const payload = {
    name: formData.name.trim(),
    surname: formData.surname.trim(),
    email: formData.email.trim(), // Include email
    contactNumber: formData.contactNumber.trim(),
    accountStatus: formData.accountStatus, // Include accountStatus
    userRole: formData.role, // Include role (note the API might expect "userRole" instead of "role")
    // Only include password if it's not empty
    ...(formData.password.length > 0 && { password: formData.password }),
  };

  // Validation for required fields
  if (!payload.name) {
    setSnackbar({
      open: true,
      message: 'Name is a required field',
      severity: 'error'
    });
    return;
  }

  try {
    const response = await axios.put(`https://localhost:7273/api/Users/${userId}`, payload, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      }
    });

    setSnackbar({
      open: true,
      message: 'Profile updated successfully',
      severity: 'success'
    });

    // Refresh user data
    const userResponse = await axios.get(`https://localhost:7273/api/Users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      }
    });
    setUser(userResponse.data);
    setEditMode(false);
  } catch (error) {
    console.error('Error updating profile:', error.response?.data || error.message);
    
    let errorMessage = 'Failed to update profile. Please check your information.';
    if (error.response?.data?.errors) {
      // Extract the first error message from each field
      const errorMessages = Object.entries(error.response.data.errors)
        .map(([field, errors]) => `${field}: ${errors.join(', ')}`);
      errorMessage = errorMessages.join('\n');
    }

    setSnackbar({
      open: true,
      message: errorMessage,
      severity: 'error'
    });
  }
};

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`https://localhost:7273/api/Users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });
      onClose();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Error deleting account:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete account',
        severity: 'error'
      });
    }
  };

  const handleLogout = () => {
    onClose();
    logout();
    navigate('/login');
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Typography color="error">Failed to load user data</Typography>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      {editMode ? (
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="First Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Last Name"
            name="surname"
            value={formData.surname}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            margin="normal"
            type="email"
            required
            disabled
          />
          <TextField
            fullWidth
            label="Phone Number"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            margin="normal"
            placeholder="e.g., 0123456789"
          />
          <TextField
            fullWidth
            label="New Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            margin="normal"
            placeholder="Leave blank to keep current"
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Account Status"
              name="accountStatus"
              value={formData.accountStatus}
              onChange={handleInputChange}
              margin="normal"
              disabled
            />
            <TextField
              fullWidth
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              margin="normal"
              disabled
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button 
              variant="contained" 
              onClick={handleSave}
              color="primary"
            >
              Save Changes
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => setEditMode(false)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Avatar sx={{ 
              width: 80, 
              height: 80, 
              fontSize: '2rem',
              bgcolor: 'primary.main'
            }}>
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1">Name:</Typography>
              <Typography>{user.name} {user.surname}</Typography>
            </Box>
            <Divider />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1">Email:</Typography>
              <Typography>{user.email}</Typography>
            </Box>
            <Divider />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1">Phone:</Typography>
              <Typography>{user.contactNumber || 'Not provided'}</Typography>
            </Box>
            <Divider />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1">Status:</Typography>
              <Chip 
                label={user.accountStatus} 
                color={user.accountStatus === 'Active' ? 'success' : 'error'} 
                size="small" 
              />
            </Box>
            <Divider />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1">Role:</Typography>
              <Typography>{user.role}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={() => setOpenDeleteDialog(true)}
            >
              Delete Account
            </Button>
            <Button
              variant="contained"
              startIcon={<Logout />}
              onClick={handleLogout}
              color="secondary"
            >
              Logout
            </Button>
          </Box>
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete your account? This action cannot be undone.
            All your data will be erased immediately.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteAccount} 
            color="error"
            variant="contained"
            startIcon={<Delete />}
          >
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Superuser Management Component
const SuperuserManagement = ({ isSuperuser }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUserDialog, setEditUserDialog] = useState(false);
  const [fundDialog, setFundDialog] = useState(false);
  const [fundAmount, setFundAmount] = useState(0);
  const [loading, setLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (isSuperuser) {
      fetchAllUsers();
    }
  }, [isSuperuser]);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('https://localhost:7273/api/Users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });
      
      if (response.data && Array.isArray(response.data)) {
        const mappedUsers = response.data.map((user, index) => ({
          ...user,
          userID: user.userID,
          contactNumber: user.contactNumber || '', // Ensure contactNumber is handled consistently
        }));
        setUsers(mappedUsers);
      } else {
        setError('Invalid data format received from server');
        setSnackbar({
          open: true,
          message: 'Invalid user data format',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
      setSnackbar({
        open: true,
        message: 'Failed to load users',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredUsers = users.filter(user => 
    (user.name && user.name.toLowerCase().includes(searchTerm)) || 
    (user.email && user.email.toLowerCase().includes(searchTerm)) ||
    (user.contactNumber && user.contactNumber.toLowerCase().includes(searchTerm))
  );

  const handleEditUser = (user) => {
    setSelectedUser({
      ...user,
      userID: user.userID,
      password: '',
      contactNumber: user.contactNumber || '' // Ensure contactNumber is properly initialized
    });
    setEditUserDialog(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser?.userID) {
      setSnackbar({
        open: true,
        message: 'Invalid user ID. Cannot update user.',
        severity: 'error',
      });
      return;
    }

    const payload = {
      name: selectedUser.name?.trim() || '',
      surname: selectedUser.surname?.trim() || '',
      email: selectedUser.email?.trim() || '',
      contactNumber: selectedUser.contactNumber?.trim() || '',
      userRole: selectedUser.userRole || 'User',
      accountStatus: selectedUser.accountStatus || 'Active',
      ...(selectedUser.password?.length > 0 && { password: selectedUser.password }),
    };

    if (!payload.name || !payload.email || !payload.userRole || !payload.accountStatus) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields.',
        severity: 'error',
      });
      return;
    }

    try {
      await axios.put(`https://localhost:7273/api/Users/${selectedUser.userID}`, payload, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });

      setSnackbar({
        open: true,
        message: 'User updated successfully',
        severity: 'success'
      });

      fetchAllUsers();
      setEditUserDialog(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user:', error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: 'Failed to update user. Please check required fields.',
        severity: 'error'
      });
    }
  };

  const handleFundUser = (user) => {
    setSelectedUser({
      ...user,
      userID: user.userID,
    });
    setFundDialog(true);
  };

const transferFunds = async () => {
  if (!selectedUser?.userID) {
    setSnackbar({
      open: true,
      message: 'Invalid user ID. Cannot add funds.',
      severity: 'error'
    });
    return;
  }

  setSnackbar({ open: false }); // Clear any previous snackbar messages
  setLoading(true); // Set loading state - changed from setIsLoading to setLoading

  try {
    const token = localStorage.getItem('jwtToken');
    const response = await axios.post(
      `https://localhost:7273/api/Wallet/${selectedUser.userID}/AddFunds`,
      {
        userId: Number(selectedUser.userID), // Ensure userID is a number
        amount: Number(fundAmount), // Ensure amount is a number
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    setFundDialog(false); // Close the dialog
    setFundAmount(0); // Reset the fund amount
    fetchAllUsers(); // Refresh the user list
    setSnackbar({
      open: true,
      message: `Successfully added R${Number(fundAmount).toFixed(2)} to the user's wallet!`,
      severity: 'success'
    });
    
  } catch (error) {
    console.error('Error transferring funds:', error);
    setSnackbar({
      open: true,
      message: error.response?.data?.message || error.message || 'Failed to add funds',
      severity: 'error'
    });
  } finally {
    setLoading(false); // Reset loading state - changed from setIsLoading to setLoading
  }
};;

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (!isSuperuser) return null;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">{error}</Typography>
        <Button onClick={fetchAllUsers} variant="outlined" sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>User Management</Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search users..."
          InputProps={{
            startAdornment: <Search sx={{ mr: 1 }} />
          }}
          onChange={handleSearch}
          sx={{ width: 300 }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow key={user.userID || `fallback-${index}`}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {user.name?.charAt(0) || 'U'}
                    </Avatar>
                    {user.name} {user.surname}
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.contactNumber || '-'}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.role} 
                    color={user.role === 'Superuser' ? 'primary' : 'default'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.accountStatus} 
                    color={user.accountStatus === 'Active' ? 'success' : 'error'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>R{user.walletBalance?.toFixed(2) || '0.00'}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => handleEditUser(user)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    startIcon={<AccountBalanceWallet />}
                    onClick={() => handleFundUser(user)}
                    color="secondary"
                    sx={{ mr: 1 }}
                  >
                    Fund
                  </Button>
                  <Button
                    size="small"
                    startIcon={<Delete />}
                    onClick={() => handleDeleteUser(user.userID)}
                    color="error"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit User Dialog */}
      <Dialog open={editUserDialog} onClose={() => setEditUserDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent dividers>
          {selectedUser && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Name"
                value={selectedUser.name || ''}
                onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Surname"
                value={selectedUser.surname || ''}
                onChange={(e) => setSelectedUser({...selectedUser, surname: e.target.value})}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                value={selectedUser.email || ''}
                onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                margin="normal"
                type="email"
                required
              />
              <TextField
                fullWidth
                label="Phone Number"
                value={selectedUser.contactNumber || ''}
                onChange={(e) => setSelectedUser({...selectedUser, contactNumber: e.target.value})}
                margin="normal"
                placeholder="e.g., 0123456789"
              />
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={selectedUser.password || ''}
                onChange={(e) => setSelectedUser({...selectedUser, password: e.target.value})}
                margin="normal"
                placeholder="Leave blank to keep current"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                  value={selectedUser.userRole || 'User'}
                  onChange={(e) => setSelectedUser({...selectedUser, userRole: e.target.value})}
                  label="Role"
                >
                  <MenuItem value="User">User</MenuItem>
                  <MenuItem value="Superuser">Superuser</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedUser.accountStatus || 'Active'}
                  onChange={(e) => setSelectedUser({...selectedUser, accountStatus: e.target.value})}
                  label="Status"
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUserDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateUser} 
            variant="contained"
            color="primary"
            disabled={!selectedUser?.userID}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Fund User Dialog */}
      <Dialog open={fundDialog} onClose={() => setFundDialog(false)}>
        <DialogTitle>Fund User Account</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Add funds to {selectedUser?.name}'s account 
          </Typography>
          <TextField
            fullWidth
            type="number"
            label="Amount"
            value={fundAmount}
            onChange={(e) => setFundAmount(parseFloat(e.target.value) || 0)}
            margin="normal"
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1 }}>R</Typography>
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFundDialog(false)}>Cancel</Button>
          <Button 
            onClick={transferFunds} 
            variant="contained"
            color="primary"
            disabled={fundAmount <= 0 || !selectedUser?.userID}
          >
            Add Funds
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Main ProfileModal Component
const ProfileModal = ({ open, onClose }) => {
  const [tabValue, setTabValue] = useState(0);
  const userRole = getCurrentUserRole();
  const isSuperuser = userRole === 'Superuser';

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>User Profile</span>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="My Profile" />
          {isSuperuser && <Tab label="User Management" />}
        </Tabs>
      </Box>

      <DialogContent dividers>
        {tabValue === 0 ? (
          <UserProfileSection onClose={onClose} />
        ) : (
          <SuperuserManagement isSuperuser={isSuperuser} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;