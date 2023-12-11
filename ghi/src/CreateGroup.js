import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useToken from "@galvanize-inc/jwtdown-for-react";
import { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import Avatar from "@mui/material/Avatar";
import GroupIcon from "@mui/icons-material/Group";
import NavBar from "./NavBar";

const defaultTheme = createTheme();

export default function GroupForm({ user }) {
  const [open, setOpen] = useState(true);
  const { token } = useToken();
  const [name, setName] = useState("");
  const [created_by, setCreatedBy] = useState("");
  const [img_url, setImgUrl] = useState("");
  const [is_public, setIsPublic] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleCreatedByChange = (e) => {
    setCreatedBy(e.target.value);
  };
  const handleImgUrlChange = (e) => {
    setImgUrl(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      return;
    }

    const data = {
      name,
      created_by,
      img_url,
      is_public,
    };

    const url = `${process.env.REACT_APP_API_HOST}/api/groups`;
    const fetchConfig = {
      method: "post",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(url, fetchConfig);

      console.log("Response Status:", response.status);

      if (response.ok) {
        // Access the form and reset it
        const form = e.target;
        form.reset();

        // Reset the state variables
        setName("");
        setCreatedBy("");
        setImgUrl("");
        setIsPublic(true);

        console.log("Form Reset Successful");
      } else {
        const errorMessage = await response.text(); // Get the error message from the response
        console.error(
          "Error submitting data:",
          response.statusText,
          errorMessage
        );
      }
    } catch (error) {
      console.error("Error submitting data:", error.message);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <NavBar open={open} toggleDrawer={toggleDrawer} />
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(https://source.unsplash.com/random?music)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <GroupIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Create Group
            </Typography>
            {token ? (
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  autoComplete="name"
                  onChange={handleNameChange}
                  autoFocus
                  placeholder="Group Name" // Placeholder text
                  InputLabelProps={{
                    shrink: true, // This will make the label shrink when the user starts typing
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="created_by"
                  label="CreatedBy"
                  id="created_by"
                  autoComplete="created_by"
                  onChange={handleCreatedByChange}
                  placeholder="Enter your username" // Placeholder text
                  InputLabelProps={{
                    shrink: true, // This will make the label shrink when the user starts typing
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="Img Url"
                  label="Image Url"
                  id="img_url"
                  autoComplete="Image Url"
                  onChange={handleImgUrlChange}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Create
                </Button>
              </Box>
            ) : (
              // If user is not signed in, show a sign in link
              <Typography variant="body1" sx={{ mt: 3 }}>
                Please{" "}
                <Link to="/signin" style={{ color: "#1976D2" }}>
                  sign in
                </Link>{" "}
                to create a group.
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
