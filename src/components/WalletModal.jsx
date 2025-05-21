import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';
import { getCurrentUserId } from '../api/auth';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const WalletModal = ({ open, onClose, onBalanceUpdate }) => {
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const userId = getCurrentUserId();

  useEffect(() => {
    if (open && userId) {
      fetchBalance();
    }
    // eslint-disable-next-line
  }, [open, userId]);

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get(
        `https://localhost:7273/api/Wallet/${userId}/Balance`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBalance(response.data.balance);
      if (onBalanceUpdate) {
        onBalanceUpdate(response.data.balance);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      setError('Failed to fetch wallet balance.');
    }
  };

  const handleAddFunds = async () => {
    if (!userId) {
      setError('User is not logged in. Please log in again.');
      return;
    }

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.post(
        `https://localhost:7273/api/Wallet/${userId}/AddFunds`,
        {
          userId: Number(userId),
          amount: Number(amount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setBalance(response.data.newBalance);
      setSuccess(
        `Successfully added R${Number(amount).toFixed(2)} to your wallet!`
      );
      setAmount('');
      // Update parent Dashboard's wallet balance in real time
      if (onBalanceUpdate) {
        onBalanceUpdate(response.data.newBalance);
      }
    } catch (error) {
      console.error('Error details:', error);
      setError(
        error.response?.data?.message ||
        error.message ||
        'Failed to add funds'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          Wallet Balance: R{typeof balance === 'number' ? balance.toFixed(2) : 'Loading...'}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <TextField
          fullWidth
          label="Amount to Add (R)"
          type="number"
          inputProps={{ min: "0.0", step: "10" }}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isLoading || success}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button
            onClick={onClose}
            disabled={isLoading}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddFunds}
            disabled={!amount || isLoading || success}
            variant="contained"
          >
            {isLoading ? <CircularProgress size={24} /> : 'Add Funds'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default WalletModal;