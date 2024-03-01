import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, Box, Avatar, Typography, Paper, useTheme } from '@mui/material';
import UserPosts from '../HelpingFunctions/UserPosts';
import NavBar from '../Navbar/NavBar';
import Button from '@mui/material/Button';
import {handleFollow, handleUnfollow} from '../HelpingFunctions/followFunction';

const Profile = () => {
    const currentUrl = window.location.href;
    const userIdAsString = Number(currentUrl.match(/\/(\d+)$/)[1])
    const userId = userIdAsString
    const theme = useTheme();
    const [profileData, setProfileData] = useState(null);
    const [open, setOpen] = useState(true);
    const [isFollowed, setIsFollowed] = useState(false)
    const [followers, setFollowers] = useState(0)
    const [following, setFollowing] = useState(0)

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_HOST}/api/users/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setProfileData(data)
                fetch(`${process.env.REACT_APP_API_HOST}/api/users/following/${userId}`, {
                    credentials: 'include',
                })
                .then(response => response.json())
                .then(isFollowing => {
                    setIsFollowed(isFollowing);
                })
                .catch(error => console.error('Error checking following status:', error));
            })
            .catch(error => console.error('Error fetching user data:', error));

            const followCount = async () => {
                const followerUrl = `${process.env.REACT_APP_API_HOST}/api/users/${userId}/followers`
                const followingUrl = `${process.env.REACT_APP_API_HOST}/api/users/${userId}/following`
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
            };

            followCount();
    }, [userId]);

    const toggleDrawer = () => {
        setOpen(!open)
    }

    if (!profileData) {
        return <div>Loading...</div>
    }

    const handleFollowToggle = async (userId) =>{
        const updateFollowerCount = async () => {
            const followerUrl = `${process.env.REACT_APP_API_HOST}/api/users/${userId}/followers`;
            const followerResponse = await fetch(followerUrl, {
            credentials: 'include',
            });

            if (followerResponse.ok) {
            const followerData = await followerResponse.json();
            setFollowers(followerData.length);
            }
        };
        setIsFollowed(prevState => !prevState);
        const checkFollowingResponse = await fetch(`${process.env.REACT_APP_API_HOST}/api/users/following/${userId}`,{
            credentials: 'include',
        });
        if(checkFollowingResponse.ok){
            const data = await checkFollowingResponse.json()

            if(!data){
                handleFollow(userId, updateFollowerCount)
            }
            else{
                handleUnfollow(userId, updateFollowerCount)
            }
        }


    }



    return (
        <Box sx={{ dsiplay: 'flex' }}>
            <NavBar open={open} toggleDrawer={toggleDrawer} />
            <Container maxWidth="lg" sx={{ mt: 3, mb: 3, flexGrow: 1, transition: 'margin-left 0.3s', marginLeft: open ? `240px` : `${theme.spacing(9)}` }}>
                <Grid container spacing={3} justifyContent="center">
                    {/* User Profile Section */}
                    <Grid item xs={12} sm={6} md={4}>
                        {/* Top Profile Card*/}
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
                                    <Button variant="contained" onClick={() => handleFollowToggle(userId)}>
                                        {isFollowed ? 'Unfollow' : 'Follow'}
                                    </Button>

                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* User Posts Section */}
                    <Grid item xs={12}>
                        <UserPosts userId={userId} />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};



export default Profile;
