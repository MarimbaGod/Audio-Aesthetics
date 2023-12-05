import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddCommentIcon from '@mui/icons-material/AddComment';
import Avatar from '@mui/material/Avatar';
const PostDetails = ({ post, users, open, onClose }) => {
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
