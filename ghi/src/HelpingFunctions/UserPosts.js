import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography } from '@mui/material';


const UserPosts = ({ userId }) => {
    const [posts, setPosts] = useState([]);

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

    return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                {posts.map(post => (
                    <Grid item xs={12} sm={6} md={4} key={post.id}>
                        <Card>
                            {post.img_url &&(
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={post.img_url}
                                    alt="Post Media"
                                />
                            )}
                            <CardContent>
                                <Typography variant="h6">{post.caption}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Posted on: {new Date(post.created_datetime).toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default UserPosts;
