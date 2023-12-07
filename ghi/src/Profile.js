import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, Box, Avatar, Typography } from '@mui/material';
import UserPosts from './UserPosts';
import NavBar from './NavBar';

const Profile = ({ userId }) => {
    const [profileData, setProfileData] = useState(null);
    const [open, setOpen] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:8000/api/users/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setProfileData(data))
            .catch(error => console.error('Error fetching user data:', error));
    }, [userId]);

    const toggleDrawer = () => {
        setOpen(!open)
    }

    if (!profileData) {
        return <div>Loading...</div>
    }

    return (
        <Box sx={{ dsiplay: 'flex' }}>
            <NavBar open={open} toggleDrawer={toggleDrawer} />
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3} justifyContent="center">
                    {/* User Profile Section */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Avatar
                                        sx={{ width: 128, height: 128, mb: 2 }}
                                        src={profileData.img_url}
                                        alt="User Profile"
                                    />
                                    <Typography variant="h5">{profileData.username}</Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {profileData.email}
                                    </Typography>
                                    {/* Add other user details here */}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* User Posts Section */}
                    <Grid item xs={12}>
                        <UserPosts userId={userId} />
                        {/* {console.log(userId)} */}
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Profile;
