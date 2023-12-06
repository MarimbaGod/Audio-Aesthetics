import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import DeleteIcon from '@mui/icons-material/Delete';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
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


const defaultTheme = createTheme({
  palette: {
    background: {
      default: '#f0f0f0',
    },
  },
  typography:{
    fontFamily: [
      'Helvetica',
    ].join(',')
  },
});

const drawerWidth = 240;

// Left nav bar
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
    const [openDrawer, setOpenDrawer] = useState(true);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [ posts, setPosts ] = useState([]);
    const [ loggedInUser, setLoggedInUser ] = useState(null);
    const [ caption, setCaption ] = useState("");
    const [ imgUrl, setImgUrl ] = useState("");
    const [ songOrPlaylist, setSongOrPlaylist ] = useState("");

    const toggleDrawer = () => {
      setOpenDrawer(!openDrawer);
    };

    const handleClickOpen = () => {
      setDialogOpen(true);
    };

    const handleClose = () => {
      setDialogOpen(false);
      setCaption("");
      setImgUrl("");
      setSongOrPlaylist("");
    };

    // Create a new Post logic
    const handlePost = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/posts', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            created_datetime: new Date().toISOString(),
            caption,
            created_by: loggedInUser,
            img_url: imgUrl,
            song_or_playlist: songOrPlaylist,
          }),
        });

        if(response.ok) {
          const newPost = await response.json();
          setPosts((prevPosts) => [...prevPosts, newPost]);
          handleClose();
        } else {
          console.error('Error creating post:', response.statusText);
        }
      } catch (error) {
        console.error('Error creating post:', error);
      }
    };

    // Get Posts by signed in user only
    useEffect(() => {
        const fetchUserData = async () => {
            const userResponse = await fetch('http://localhost:8000/token', {
                credentials: "include",
            });

            if (userResponse.ok) {
                const userData = await userResponse.json();
                setLoggedInUser(userData.account.id);
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

  // Delete Post logic
  const handleDelete = async (postId) => {

    const isConfirmed = window.confirm('Are you sure you want to delete this post?');

    if (!isConfirmed) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/posts/${postId}`, {
        method: 'DELETE',
        credentials: "include",
      });

      if (response.ok) {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      } else {
        console.error('Error deleting post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  // Display Posts card format
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
            {new Date(post.created_datetime).toLocaleDateString('en-GB')}
          </Typography>
          <Typography>
            {post.caption}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">View</Button>
          <Chip
            label="Delete"
            size="small"
            color="error"
            onClick={() => handleDelete(post.id)}
            onDelete={() => handleDelete(post.id)}
            deleteIcon={<DeleteIcon />}
            variant="filled"
          />
        </CardActions>
      </Card>
    </Grid>
  ));

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={openDrawer}>
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
        <Drawer variant="permanent" open={openDrawer}>
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
              <React.Fragment>
                <Button variant="contained" onClick={handleClickOpen}>
                  Make a new post
                </Button>
                <Dialog open={isDialogOpen} onClose={handleClose}>
                  <DialogTitle>Create a new post</DialogTitle>
                  <DialogContent>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="caption"
                      label="Write your post here..."
                      type="text"
                      fullWidth
                      variant="standard"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                    />
                    <TextField
                      autoFocus
                      margin="dense"
                      id="imgUrl"
                      label="Image Url (Optional)"
                      type="text"
                      fullWidth
                      variant="standard"
                      value={imgUrl}
                      onChange={(e) => setImgUrl(e.target.value)}
                    />
                    <TextField
                      autoFocus
                      margin="dense"
                      id="songOrPlaylist"
                      label="Song or Playlist (Optional)"
                      type="text"
                      fullWidth
                      variant="standard"
                      value={songOrPlaylist}
                      onChange={(e) => setSongOrPlaylist(e.target.value)}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button variant="contained" onClick={handlePost}>Post</Button>
                    <Button variant="contained" color="error" onClick={handleClose}>Cancel</Button>
                  </DialogActions>
                </Dialog>
              </React.Fragment>
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
