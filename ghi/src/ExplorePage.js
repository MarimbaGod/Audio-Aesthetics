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
import CardMedia from '@mui/material/CardMedia';

//card icons
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Avatar from '@mui/material/Avatar';
import FavoriteIcon from '@mui/icons-material/Favorite';

//other js imports
import PostDetails from './PostDetails';
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

export default function ExplorePage() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [likedPosts, setLikedPosts] = useState(() => {
    // Initialize likedPosts from local storage or an empty array
    const storedLikedPosts = localStorage.getItem('likedPosts');
    return storedLikedPosts ? JSON.parse(storedLikedPosts) : [];
  });



  useEffect(() => {
    const fetchData = async () => {
      // const userUrl =`${process.env.REACT_APP_API_HOST}/api/users`;
      const userUrl = `http://localhost:8000/api/users/`
      const userResponse = await fetch(userUrl);
      if (userResponse.ok) {
        const data = await userResponse.json();
        setUsers(data);
      }
      const postsUrl = "http://localhost:8000/api/posts/"
      const postResponse = await fetch(postsUrl);
      if (postResponse.ok) {
        const data = await postResponse.json();
        setPosts(data);
      }
      const storedLikedPosts = localStorage.getItem('likedPosts');
      const initialLikedPosts = storedLikedPosts ? JSON.parse(storedLikedPosts) : [];
      setLikedPosts(initialLikedPosts);
    };

    fetchData();
  }, []);

    const handleLikePost = async (postId) => {
      try {
        const response = await fetch(`http://localhost:8000/api/posts/${postId}/check_like`, {
          credentials: 'include',
        });
      if (response.ok) {
      const data = await response.json();
      if (!data) {
        handleLike(postId);
        setLikedPosts((prevLikedPosts) => {
          const newLikedPosts = [...prevLikedPosts, postId];
          console.log('Liked Posts:', newLikedPosts); // Add this log
          localStorage.setItem('likedPosts', JSON.stringify(newLikedPosts));
          return newLikedPosts;
        });

      } else {
        handleUnlike(postId);
        setLikedPosts((prevLikedPosts) => {
          const newLikedPosts = prevLikedPosts.filter((id) => id !== postId);
          console.log('Liked Posts:', newLikedPosts); // Add this log
          localStorage.setItem('likedPosts', JSON.stringify(newLikedPosts));
          return newLikedPosts;
        });
      }
    } else {
        const errorData = await response.json();
        console.error('Failed to check if the post is liked:', errorData.message);
        // Handle the error, display a message, etc.
      }
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
    }
    catch (error) {
      console.error('Error while checking if the post is liked:', error);
      // Handle the error, display a message, etc.
    }
  };

  useEffect(() => {
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
  }, [likedPosts]);

  const [selectedPost, setSelectedPost] = useState(null);

  const handleView = (post) => {
    setSelectedPost(post);
  };
  const handleCloseModal = () => {
    setSelectedPost(null);
  };

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
        {/* This holds the grid system  */}
        <Container sx={{ py: 8, mt: 4}} maxWidth="md">
          <Grid container spacing={3}>
            {posts.map((post) => (
            <Grid item key={post.id} xs={12} sm={6} md={4}>
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
                  <Stack direction="row" alignItems="center" spacing={1} >
                    <Avatar
                      src={users.find((user) => user.id === post.created_by).img_url}
                      alt="Profile"
                      />
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
                  <Button size="small" onClick={() => handleView(post)}>
                    View
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
          </Grid>
        </Container>
        <PostDetails post={selectedPost} users={users} open={selectedPost !== null} onClose={handleCloseModal} />
        </Box>
      </Box>
    </ThemeProvider>

    );
}
