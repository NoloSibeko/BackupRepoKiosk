import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <Drawer variant="permanent" anchor="left">
      <List>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/products">
          <ListItemText primary="Manage Products" />
        </ListItem>
        <ListItem button component={Link} to="/users">
          <ListItemText primary="Manage Users" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
