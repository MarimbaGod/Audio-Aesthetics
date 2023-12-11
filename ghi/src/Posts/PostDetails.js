import React, {useEffect, useState} from 'react';

//page organizers
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

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

//pop up post
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

import {handleLike, handleUnlike} from '../likeFunction';




const PostDetails = ({ post, users, open, onClose }) => {
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
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
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        {post && (
          <Card
            sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  maxWidth: '500px',
                  margin: 'auto',
                }}
          >
            {post.created_by && (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Avatar src={users.find(user => user.id === post.created_by).img_url} alt="Profile" />
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                    {users.find(user => user.id === post.created_by).username}
                </Typography>
              </Stack>
            )}
            {post.img_url && (
              <CardMedia component="div" sx={{ pt: '100%' }} image={post.img_url} />
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
                  {new Date(post.created_datetime).toLocaleString('default', {
                    month: 'long',
                  }) +
                    ' ' +
                    new Date(post.created_datetime).getDate()}
                </Typography>
              )}
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PostDetails;
