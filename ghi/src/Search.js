import React from 'react';

//actually useful react imports
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

//navbar buttons
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutIcon from '@mui/icons-material/Logout';
import {mainListItems, secondaryListItems} from './VerticalNav';

//page organizers
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { TextField } from '@mui/material';

//card
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';

const defaultTheme = createTheme({
  palette: {
    background: {
      default: '#f0f0f0', // Set your desired background color
    },
  },
  typography:{
    fontFamily: [
      'Helvetica',
    ].join(',')
  },
});

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

export default function Homepage() {
    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
    const fetchData = async () => {
      const credentialsResponse = await fetch(`${process.env.REACT_APP_API_HOST}/token`, {
          credentials: 'include',
        });
      const userUrl = `${process.env.REACT_APP_API_HOST}/api/users/`
      const groupUrl = `${process.env.REACT_APP_API_HOST}/api/groups/`
      const userResponse = await fetch(userUrl);
      const groupResponse = await fetch(groupUrl);
      if (userResponse.ok) {
        const data = await userResponse.json();
        setUsers(data);
      }
      if (groupResponse.ok) {
        const data = await groupResponse.json();
        setGroups(data);
      }
      if (credentialsResponse.ok) {
          const credentialsData = await credentialsResponse.json();
          setLoggedInUser(credentialsData.account);

      }
    };

    fetchData();
  }, []);

const handleSearch = async (event) => {
            const value = event.target.value;
            const filteredUsers = value.length > 0 ? users.filter(user => user.username.toLowerCase().startsWith(value.toLowerCase())&& user.id !== loggedInUser.id) : [];
            setFilteredUsers(filteredUsers);
            const filteredGroups = value.length > 0 ? groups.filter(group => group.name.toLowerCase().startsWith(value.toLowerCase()) || group.created_by.toLowerCase().startsWith(value.toLowerCase())) : [];
            setFilteredGroups(filteredGroups);
        };


return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px',
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h4"
              color="inherit"
              noWrap
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent:'center',
              }}
            >
              Audio Aesthetics
            </Typography>
            <IconButton color="inherit" component={Link} to="/logout">
                <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '20px',
                  fontWeight: 'bold',
                }}
              >
                Audio Aesthetics
              </Typography>
            <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
            <Container sx={{ py: 8 }} maxWidth="md">
                <TextField id="standard-basic" label="Search for users, groups, songs" variant="standard" onChange={handleSearch} sx={{ width: '890px' }} />
            <Grid container spacing={4}>
            <Grid container spacing={4} sx={{py: 10}}>
            {/* Users code */}
            {filteredUsers.length > 0 && (
                <>
                    <Typography variant="h4" gutterBottom>
                        Users
                    </Typography>
                    <Grid container spacing={4}>
                    {filteredUsers.map((user) => (
                        <Grid item key={user.id} xs={12} sm={6} md={4} lg={3}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    alt={user.username}
                                    height="200"
                                    image={user.img_url}
                                />
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        {user.username}
                                    </Typography>
                                    <Link to={`/profile/${user.id}`}>
                                    <Button size="small">
                                      View
                                    </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                    </Grid>
                </>
            )}
            </Grid>
            {/* Groups code */}
            <Grid container spacing={4} sx={{ py: 8 }}>
            {filteredGroups.length > 0 &&(
                <>
                <Typography variant="h4" gutterBottom>
                    Groups
                </Typography>
                <Grid container spacing={4}>
                {filteredGroups.map((group) => (
                    <Grid item key={group.id} xs={12} sm={6} md={4} lg={3}>
                        <Card>
                            <CardMedia
                                component="img"
                                alt={group.name}
                                height="200"
                                image={group.img_url}
                            />
                            <CardContent>
                                    <Typography variant="h5" component="div">
                                    {group.name}
                                    </Typography>
                                <Typography variant="h6" component="div">
                                Created by: {group.created_by}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    ))}
                    </Grid>
                </>
            )}
            </Grid>
          </Grid>
        </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
