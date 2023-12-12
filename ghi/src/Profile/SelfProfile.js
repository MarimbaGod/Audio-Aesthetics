import * as React from 'react';
import CardMedia from '@mui/material/CardMedia';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import NavBar from '../Navbar/NavBar';
import { Container, Grid, Card, CardContent, Box, Avatar, Typography,Paper } from '@mui/material';


export default function SelfProfile() {
    const [open, setOpen] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [followers, setFollowers] = useState(0)
    const [following, setFollowing] = useState(0)

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleCardClick = (post) => {
    setSelectedPost(post);
    if (!post.img_url) {
      post.img_url = `https://source.unsplash.com/random?music&${post.id}`;
    }
  };

  const styles = {
  popupImage: {
    maxWidth: '100%',
    height: 'auto',
    width: '100%',
  },
};

  useEffect(() => {
    const fetchUserData = async () => {
      const userResponse = await fetch(`${process.env.REACT_APP_API_HOST}/token`, {
        credentials: 'include',
      });
      try{
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setLoggedInUser(userData.account);
        const postsResponse = await fetch(`${process.env.REACT_APP_API_HOST}/api/posts/`, {
          credentials: 'include',
        });

        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          setPosts(postsData.filter((post) => post.created_by === userData.account.id));
        }
        const followerUrl = `${process.env.REACT_APP_API_HOST}/api/users/${userData.account.id}/followers`
                const followingUrl = `${process.env.REACT_APP_API_HOST}/api/users/${userData.account.id}/following`
                const followerResponse = await fetch(followerUrl, {
                    credentials: 'include',
                })
                const followingResponse = await fetch(followingUrl, {
                    credentials: 'include',
                })
                if(followingResponse.ok){
                    const data = await followingResponse.json()
                    setFollowing(data.length)
                }
                if(followerResponse.ok){
                    const data = await followerResponse.json()
                    setFollowers(data.length)
                }
      }
      }
      catch{
        window.location.replace('/audio-aesthetics/signin');
      }
    };
    fetchUserData();
  }, []);

  const handleDelete = async (postId) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this post?');

    if (!isConfirmed) {
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_HOST}/api/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setSelectedPost(null);
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      } else {
        console.error('Error deleting post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };



    const postsItems = posts.sort((a, b) => new Date(b.created_datetime) - new Date(a.created_datetime)).map((post) => (
    <Grid item key={post.id} xs={12} sm={6} md={4}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
        }}
        onClick={() => handleCardClick(post)}
      >
        <CardMedia
          component="div"
          sx={{
            pt: '100%',
            position: 'relative',
            overflow: 'hidden',
            '& img': {
              objectFit: 'cover',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
            },
          }}
          image={post.img_url || `https://source.unsplash.com/random?music&${post.id}`}
        />
      </Card>
    </Grid>
  ));

  const postDetailsDialog = (
    <Dialog open={selectedPost !== null} onClose={() => setSelectedPost(null)}>
      <DialogContent>
        <Grid item xs={12} sm={6}>
          <img
            src={selectedPost?.img_url}
            alt="Post"
            style={styles.popupImage}
          />
          <Typography gutterBottom variant="subtitle2">
            {new Date(selectedPost?.created_datetime).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}
          </Typography>
          <Typography>{selectedPost?.caption}</Typography>
        </Grid>
      </DialogContent>
      <DialogActions>
        <DeleteIcon
          color='error'
          sx={{
            '&:hover': {
              color: 'darkred', // Change color on hover
              cursor: 'pointer',
            },
            '&:active': {
              transform: 'scale(0.9)', // Add a slight scale down effect on click
            },
          }}
          onClick={() => handleDelete(selectedPost.id)}
        />
      </DialogActions>
    </Dialog>
  );

  return (
      <Box sx={{ display: 'flex' }}>
        <NavBar open={open} toggleDrawer={toggleDrawer} />
        <Container sx={{ py: 8, mt: 4 }} maxWidth="md">
            <Box>
            <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} sm={6} md={4}>
                    {loggedInUser && (
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Avatar
                                    sx={{ width: 128, height: 128, mb: 2 }}
                                    src={loggedInUser.img_url}
                                    alt="User Profile"
                                />
                                <Typography variant="h5">{loggedInUser.username}</Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {loggedInUser.email}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: 2 }}>
                                    <Paper elevation={3} sx={{ padding: 2, flexGrow: 1, marginRight: 1 }}>
                                        <Typography variant="body2" align="center" sx={{ marginBottom: 1 }}>
                                            Followers
                                        </Typography>
                                        <Typography variant="h6" align="center">
                                            {followers}
                                        </Typography>
                                    </Paper>
                                    <Paper elevation={3} sx={{ padding: 2, flexGrow: 1, marginLeft: 1 }}>
                                        <Typography variant="body2" align="center" sx={{ marginBottom: 1 }}>
                                            Following
                                        </Typography>
                                        <Typography variant="h6" align="center">
                                            {following}
                                        </Typography>
                                    </Paper>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                    )}
                </Grid>
            </Grid>
            </Box>
            <Grid container spacing={3}>
              {postsItems}

            </Grid>
            {postDetailsDialog}
        </Container>
    </Box>

  );
}
