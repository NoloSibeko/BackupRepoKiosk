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
  TextField,
  MenuItem,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { Receipt as ReceiptIcon } from '@mui/icons-material';

const TransactionModal = ({ open, onClose, userId }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    period: 'all',
    startDate: null,
    endDate: null,
  });

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

  useEffect(() => {
    if (!transactions.length) return;

    let filtered = [...transactions];
    
    if (filter.period !== 'all') {
      const now = new Date();
      const startDate = new Date(now);
      
      switch (filter.period) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(tx => new Date(tx.transactionDate) >= startDate);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(tx => new Date(tx.transactionDate) >= startDate);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(tx => new Date(tx.transactionDate) >= startDate);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          filtered = filtered.filter(tx => new Date(tx.transactionDate) >= startDate);
          break;
        case 'custom':
          if (filter.startDate) {
            const start = new Date(filter.startDate);
            start.setHours(0, 0, 0, 0);
            filtered = filtered.filter(tx => new Date(tx.transactionDate) >= start);
          }
          if (filter.endDate) {
            const end = new Date(filter.endDate);
            end.setHours(23, 59, 59, 999);
            filtered = filtered.filter(tx => new Date(tx.transactionDate) <= end);
          }
          break;
        default:
          break;
      }
    }
    
    setFilteredTransactions(filtered);
  }, [transactions, filter]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'period' && value !== 'custom' ? { startDate: null, endDate: null } : {})
    }));
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(value);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{ style: { maxHeight: '80vh' } }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <ReceiptIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Transaction History</Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers style={{ overflowY: 'auto' }}>
        {/* Filter Controls */}
        <Box mb={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                fullWidth
                label="Filter by period"
                name="period"
                value={filter.period}
                onChange={handleFilterChange}
                variant="outlined"
                size="small"
              >
                <MenuItem value="all">All Transactions</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">Last 7 Days</MenuItem>
                <MenuItem value="month">Last 30 Days</MenuItem>
                <MenuItem value="year">Last Year</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </TextField>
            </Grid>
            
            {filter.period === 'custom' && (
              <>
                <Grid item xs={12} sm={6} md={4}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Start Date"
                      value={filter.startDate}
                      onChange={(date) => setFilter(prev => ({ ...prev, startDate: date }))}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth size="small" />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="End Date"
                      value={filter.endDate}
                      onChange={(date) => setFilter(prev => ({ ...prev, endDate: date }))}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth size="small" />
                      )}
                      minDate={filter.startDate}
                    />
                  </LocalizationProvider>
                </Grid>
              </>
            )}
          </Grid>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : filteredTransactions.length === 0 ? (
          <Alert severity="info">No transactions found {filter.period !== 'all' ? 'for the selected period' : ''}.</Alert>
        ) : (
          <List>
            {filteredTransactions.map((tx, index) => (
              <React.Fragment key={tx.transactionID || index}>
                <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6" color="primary">
                      Receipt #{tx.transactionID}
                    </Typography>
                    <Chip 
                      label={tx.description || 'Transaction'} 
                      color="secondary" 
                      size="small" 
                    />
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {formatDate(tx.transactionDate)}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body1" gutterBottom>
                        <strong>Total: {formatCurrency(tx.amount)}</strong>
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        New Balance: {formatCurrency(tx.resultingBalance)}
                      </Typography>
                      
                    </Box>
                  </Box>
                </Paper>
                
                {index < filteredTransactions.length - 1 && <Divider sx={{ my: 2 }} />}
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