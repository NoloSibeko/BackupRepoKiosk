// components/WalletModal.js
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

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

const WalletModal = ({ open, onClose, userId }) => {
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchBalance();
    }
  }, [open]);

  const fetchBalance = async () => {
    try {
      const response = await axios.get(`/api/wallet/${userId}/balance`);
      setBalance(response.data?.balance ?? 0);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch wallet balance');
      setBalance(0);
    }
  };

  const handleAddFunds = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await axios.post(`/api/wallet/${userId}/addFunds`, {
        amount: parseFloat(amount)
      });

      setBalance(response.data?.newBalance ?? 0);
      setSuccess(`Successfully added $${parseFloat(amount).toFixed(2)} to your wallet!`);
      setAmount('');
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add funds');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          Wallet Balance: ${typeof balance === 'number' ? balance.toFixed(2) : 'Loading...'}
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
