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
} from '@mui/icons-material';

const SideMenu = ({ mobileOpen, handleDrawerToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if the screen is mobile

  return (
    <div>
      <Divider />
      <List>
        <ListItem button="true" component={Link} href="/admin/create_institute" sx={{ color: 'inherit' }}>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <SchoolIcon />
          </ListItemIcon>
          <ListItemText primary="Create Institute" />
        </ListItem>
        <ListItem button="true" component={Link} href="/admin/create_student" sx={{ color: 'inherit' }}>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Create Student" />
        </ListItem>
        <ListItem button="true" component={Link} href="/admin/create_course" sx={{ color: 'inherit' }}>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <BookIcon />
          </ListItemIcon>
          <ListItemText primary="Create Course" />
        </ListItem>
        <ListItem button="true" component={Link} href="/admin/create_instructor" sx={{ color: 'inherit' }}>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <GroupIcon />
          </ListItemIcon>
          <ListItemText primary="Create Instructor" />
        </ListItem>
      </List>
    </div>
  );
};

export default SideMenu;
