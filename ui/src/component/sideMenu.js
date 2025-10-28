// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';
import React from 'react';
import Link from 'next/link';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  School as SchoolIcon,
  Person as PersonIcon,
  Book as BookIcon,
  Group as GroupIcon,
  Home as HomeIcon,
} from '@mui/icons-material';

const SideMenu = ({ mobileOpen, handleDrawerToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if the screen is mobile

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'} // Responsive drawer
      open={isMobile ? mobileOpen : true}
      onClose={handleDrawerToggle}
      sx={{
        width: 240, // Fixed width for the drawer
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.default, // Use theme background
        },
      }}
    >
      <Toolbar /> {/* Add space for the Top_header */}
      <Divider />
      <List>
        <ListItem button component={Link} href="/" sx={{ color: 'inherit' }}>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} href="/admin/create_institute" sx={{ color: 'inherit' }}>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <SchoolIcon />
          </ListItemIcon>
          <ListItemText primary="Create Institute" />
        </ListItem>
        <ListItem button component={Link} href="/admin/create_student" sx={{ color: 'inherit' }}>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Create Student" />
        </ListItem>
        <ListItem button component={Link} href="/admin/create_course" sx={{ color: 'inherit' }}>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <BookIcon />
          </ListItemIcon>
          <ListItemText primary="Create Course" />
        </ListItem>
        <ListItem button component={Link} href="/admin/create_instructor" sx={{ color: 'inherit' }}>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <GroupIcon />
          </ListItemIcon>
          <ListItemText primary="Create Instructor" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default SideMenu;
