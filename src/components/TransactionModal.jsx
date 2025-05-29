import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  List,
  ListItem,
  Divider,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import axios from 'axios';

const TransactionModal = ({ open, onClose, userId }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`https://localhost:7273/api/Transaction/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
          }
        });
        setTransactions(res.data);
        setError('');
      } catch (err) {
        setError('Failed to load transactions.');
      } finally {
        setLoading(false);
      }
    };

    if (open && userId) {
      setLoading(true);
      fetchTransactions();
    }
  }, [open, userId]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ style: { maxHeight: '80vh' } }}
    >
      <DialogTitle>Transaction History</DialogTitle>
      <DialogContent dividers style={{ overflowY: 'auto' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : transactions.length === 0 ? (
          <Typography>No transactions found.</Typography>
        ) : (
          <List>
            {transactions.map((tx, index) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start" disableGutters>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      Amount: R{tx.amount.toFixed(2)} | Remaining Balance: R{tx.resultingBalance.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(tx.transactionDate).toLocaleString()}
                    </Typography>
                    <Typography variant="body1">
                      {tx.description}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                     User Name {tx.walletId} | Cart ID: {tx.cartId}
                    </Typography>
                  </Box>
                </ListItem>
                {index < transactions.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionModal;
