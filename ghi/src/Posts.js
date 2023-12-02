import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { useEffect, useState } from 'react';

import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutIcon from '@mui/icons-material/Logout';
import {mainListItems, secondaryListItems} from './VerticalNav';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';


function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="/">
        Audio Aesthetics
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

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

export default function Posts() {
    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
      setOpen(!open);
    };

    const [ posts, setPosts ] = useState([]);
    const [ loggedInUser, setLoggedInUser ] = useState(null);
    const [ username, setUsername ] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            const userResponse = await fetch('http://localhost:8000/token', {
                credentials: "include",
            });

            if (userResponse.ok) {
                const userData = await userResponse.json();
                console.log(userData)
                setLoggedInUser(userData.account.id);
                setUsername(userData.account.username);

                const postsResponse = await fetch(`http://localhost:8000/api/posts/`, {
                    credentials: "include",
                });

                if (postsResponse.ok) {
                    const postsData = await postsResponse.json();
                    setPosts(postsData.filter(post => post.created_by === userData.account.id));
                }
            }
        };

        fetchUserData();
    }, []);


  const postsItems = posts.map((post) => (
    <Grid item key={post.id} xs={12} sm={6} md={4}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CardMedia
          component="div"
          sx={{
            pt: '56.25%',
          }}
          image={post.img_url || `https://source.unsplash.com/random?music/${post.id}`}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="h2">
            {post.created_datetime}
          </Typography>
          <Typography>
            {post.caption}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">View</Button>
          <Button size="small">Delete</Button>
        </CardActions>
      </Card>
    </Grid>
  ));

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
                  alightItems: 'center',
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
                  height: '20px', // Adjust the height as needed
                  fontWeight: 'bold', // You can adjust the styling as needed
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
            marginTop: 12
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              My Posts
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button variant="contained">Make a new post</Button>
            </Stack>
          </Container>
        <Toolbar />
        <Container sx={{ py: 8, mt: 4}} maxWidth="md">
          <Grid container spacing={3}>
            {postsItems}
          </Grid>
        </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

{/* <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
          <Typography variant="h6" align="center" gutterBottom>
            Footer
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            component="p"
          >
            Something here to give the footer a purpose!
          </Typography>
          <Copyright />
        </Box> */}
