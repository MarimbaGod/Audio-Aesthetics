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
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';

//card
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

//card icons
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddCommentIcon from '@mui/icons-material/AddComment';
import Avatar from '@mui/material/Avatar';
import FavoriteIcon from '@mui/icons-material/Favorite';

import {handleLike, handleUnlike} from './likeFunction';

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

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
  const fetchData = async () => {
    const userUrl = `${process.env.REACT_APP_API_HOST}/api/users/`
    const userResponse = await fetch(userUrl);
    const homepageResponse = await fetch(`${process.env.REACT_APP_API_HOST}/api/homepage/`,{
      credentials: "include",
    });
    if (homepageResponse.ok) {
      const data = await homepageResponse.json();
      setPosts(data);
    }
    if (userResponse.ok) {
      const data = await userResponse.json();
      setUsers(data);
    }
    const likedPostsUrl = `${process.env.REACT_APP_API_HOST}/api/post`;
      const likedPostsResponse = await fetch(likedPostsUrl, {
        credentials: 'include',
      });

      if (likedPostsResponse.ok) {
        const likedPostsData = await likedPostsResponse.json();
        //this will essentially take likedPostsData and only return the id of the posts that are liked
        const likedPostIds = likedPostsData.map((post) => post.id);
        setLikedPosts(likedPostIds);
      }
  };

  fetchData();
}, []);

  const handleLikePost = async (postId) => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_HOST}/api/posts/${postId}/check_like`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          if (!data) {
            handleLike(postId);
            setLikedPosts((prevLikedPosts) => [...prevLikedPosts, postId]);
          }
          else {
            handleUnlike(postId);
            setLikedPosts((prevLikedPosts) =>
              prevLikedPosts.filter((id) => id !== postId)
            );
          }
        }
        else {
          const errorData = await response.json();
          console.error('Failed to check if the post is liked:', errorData.message);
          }
      }
      catch (error) {
        console.error('Error while checking if the post is liked:', error);
      }
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
                  <Button size="small" onClick={() => handleLikePost(post.id)}>
                      {likedPosts.includes(post.id) ? (
                        <FavoriteIcon color="primary" />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
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
