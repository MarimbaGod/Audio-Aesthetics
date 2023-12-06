import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography } from '@mui/material';


const UserPosts = ({ userId }) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:8000/api/users/${userId}/posts`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response failed');
                }
                return response.json();
            })
            .then(data => setPosts(data))
            .catch(error => console.error('Error fetching posts:', error));
    }, [userId]);

    return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                {posts.map(post => (
                    <Grid item xs={12} sm={6} md={4} key={post.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{post.caption}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Posted on: {new Date(post.created_datetime).toLocaleString()}
                                </Typography>
                            </CardContent>
                            {post.media && post.media.map(media => (
                                <CardMedia
                                    key={media.id}
                                    component="img"
                                    height="140"
                                    image={media.img_url}
                                    alt="Post Media"
                                />
                            ))}
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default UserPosts;
