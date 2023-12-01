import React from 'react';
import {mainListItems, secondaryListItems} from './VerticalNav';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';

import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddCommentIcon from '@mui/icons-material/AddComment';
import Avatar from '@mui/material/Avatar';

import { useEffect, useState } from 'react';


const defaultTheme = createTheme({
   palette: {
    background: {
      default: '#f0f0f0', // Set your desired background color
    },
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

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);


  useEffect(() => {
    // Fetch user data from your backend API
    const fetchData = async () => {
      // const userUrl =`${process.env.REACT_APP_API_HOST}/api/users`;
      const userUrl = `http://localhost:8000/api/users/`
      const userResponse = await fetch(userUrl);
      if (userResponse.ok) {
        const data = await userResponse.json();
        setUsers(data);
        console.log(data)
      }
      const postsUrl = "http://localhost:8000/api/posts/"
      const postResponse = await fetch(postsUrl);
      if (postResponse.ok) {
        const data = await postResponse.json();
        setPosts(data);
        console.log(data)
      }
    };

    fetchData();
  }, []);

return (

<ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
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
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Audio Aesthetics
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={12} color="secondary">
                <NotificationsIcon />
              </Badge>
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
                  height: '64px', // Adjust the height as needed
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
          }}
        >
          <Toolbar />

          <Container sx={{ py: 8 }} maxWidth="md">
          <Grid container spacing={4}>
            {posts.map((post) => (
            <Grid item key={post.id} xs={12} sm={12} md={12} lg={12}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  maxWidth: '500px',
                  margin: 'auto',
                }}
              >
                {users.find((user) => user.id === post.created_by) && (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar src={users.find((user) => user.id === post.created_by).img_url} alt="Profile" />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                      }}
                    >
                      {users.find((user) => user.id === post.created_by).username}
                    </Typography>
                  </Stack>
                )}
                {post.img_url && (
                  <CardMedia
                    component="div"
                    sx={{
                      // 16:9
                      pt: '100%',
                    }}
                    image={post.img_url}
                  />
                )}
                <CardActions>
                  <Button size="small">
                    <FavoriteBorderIcon />
                  </Button>
                  <Button size="small">
                    <AddCommentIcon />
                  </Button>
                </CardActions>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {post.caption}
                  </Typography>

                  {post.created_datetime && (
                    <Typography>
                      {new Date(post.created_datetime).toLocaleString('default', { month: 'long' }) + " " + new Date(post.created_datetime).getDate()}
                    </Typography>
                  )}
                </CardContent>

              </Card>
            </Grid>
          ))}
          </Grid>
        </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
