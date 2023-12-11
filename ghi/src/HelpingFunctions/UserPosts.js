import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardMedia, Typography, Box } from '@mui/material';


import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {handleLike, handleUnlike} from '../HelpingFunctions/likeFunction';


const styles = {
  popupImage: {
    maxWidth: '200%',
    height: 'auto',
    width: '200%',
  },
};



const UserPosts = ({ userId }) => {
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [likedPosts, setLikedPosts] = useState([]);
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_HOST}/api/users/${userId}/posts`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response failed');
                }
                return response.json();
            })
            .then(data => setPosts(data))
            .catch(error => console.error('Error fetching posts:', error));
    }, [userId]);

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

    const handleCardClick = (post) => {
        setSelectedPost(post);
        if (!post.img_url) {
        post.img_url = `https://source.unsplash.com/random?music&${post.id}`;
        }
    };

    const postDetailsDialog = (
        <Dialog
        open={selectedPost !== null}
        onClose={() => setSelectedPost(null)}
        sx={{
            '& .MuiDialog-paper': {
            backgroundColor: '#47b4d2',
            },
        }}
        >
        <DialogContent
            sx={{
            backgroundColor: '#47b4d2',
            color: '#11111e',
            }}
        >
            <Grid item xs={12} sm={6}>
            <img
                src={selectedPost?.img_url}
                alt="Post"
                style={styles.popupImage}
            />
            <Typography gutterBottom variant="subtitle2" color="#11111e">
                {new Date(selectedPost?.created_datetime).toLocaleString('en-US', {
                timeZone: 'America/Los_Angeles',
                })}
            </Typography>
            <Typography color="#11111e">{selectedPost?.caption}</Typography>
            </Grid>
        </DialogContent>
        {selectedPost && (
            <DialogActions>
            <Button
                size="small"
                onClick={() => {
                handleLikePost(selectedPost["id"]);
                }}
            >
                {likedPosts.includes(selectedPost["id"]) ? (
                <FavoriteIcon style={{ color: '#fc00d2' }} />
                ) : (
                <FavoriteBorderIcon style={{ color: '#fc00d2' }} />
                )}
            </Button>
            </DialogActions>
        )}
        </Dialog>
    );

    return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box>
            <Grid container spacing={3}>
                {posts.sort((a, b) => new Date(b.created_datetime) - new Date(a.created_datetime)).map(post => (
                    <Grid item xs={12} sm={6} md={4} key={post.id}>
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
                ))}
            </Grid>
            {postDetailsDialog}
        </Box>
    </Container>
    );
};

export default UserPosts;
