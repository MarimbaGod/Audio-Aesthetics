import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import useToken from "@galvanize-inc/jwtdown-for-react";
import NavBar from "../Navbar/NavBar";

export default function UpdateProfile() {
  const [open, setOpen] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newImgUrl, setNewImgUrl] = useState("");
  const {token} = useToken();


    useEffect(()=>{
      const fetchData = async () => {
      const userResponse = await fetch(`${process.env.REACT_APP_API_HOST}/token`,{
        credentials:'include',
      });
      if(userResponse.ok){
        const userData = await userResponse.json()
        setLoggedInUser(userData.account);
      }
    };
    fetchData();
    })
  const handleUpdateProfile = async () => {

      const requestBody = {
        username: newUsername,
        email: newEmail !== "" ? newEmail : null,
        img_url: newImgUrl !== "" ? newImgUrl : null,
      };
      const response = await fetch(`${process.env.REACT_APP_API_HOST}/api/users/${loggedInUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        const data = await response.json()
        console.log(data)
      } else {
        console.error('Error creating post:', response.statusText);
      }
    };

  return (
    <Box
      sx={{
        backgroundImage: 'url("https://source.unsplash.com/random?music")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
      }}
    >
      <NavBar open={open} toggleDrawer={() => setOpen(!open)} />
      <Container
        component="main"
        maxWidth="md"
        sx={{
          backgroundColor: "white",
          padding: 4,
          borderRadius: 8,
          mt: 8,
          flexGrow: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{ m: 1, bgcolor: "secondary.main", width: 64, height: 64 }}
            src={loggedInUser?.img_url}
            alt="User Profile"
          />
          <Typography component="h1" variant="h5">
            Update Profile
          </Typography>
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateProfile();
            }}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="newUsername"
                  autoComplete="username"
                  fullWidth
                  id="newUsername"
                  label="New Username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="newEmail"
                  fullWidth
                  id="newEmail"
                  label="New Email Address"
                  autoComplete="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="newImgUrl"
                  fullWidth
                  id="newImgUrl"
                  label="New Profile Pic URL"
                  value={newImgUrl}
                  onChange={(e) => setNewImgUrl(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "common.black",
                color: "white",
              }}
            >
              Update Profile
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
