import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useToken from "@galvanize-inc/jwtdown-for-react";
import GroupIcon from "@mui/icons-material/Group";
import NavBar from "../Navbar/NavBar";
const defaultTheme = createTheme();

export default function Groups() {
  const [open, setOpen] = useState(true);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useToken();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_HOST}/api/groups/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setGroups(data);
          setLoading(false);
        } else {
          console.error("Error fetching groups:", response.statusText);
          setError("Error fetching groups. Please try again.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
        setError("Error fetching groups. Please try again.");
        setLoading(false);
      }
    };

    fetchGroups();
  }, [token]);

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
              mx: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center", // Center horizontally
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <GroupIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Groups
            </Typography>
            {loading && <CircularProgress />}
            {error && <p>{error}</p>}
            {!loading && !error && (
              <Paper
                elevation={3}
                style={{ padding: "20px", borderRadius: "8px" }}
              >
                <List>
                  {groups.map((group) => (
                    <ListItem key={group.id} style={{ marginBottom: "10px" }}>
                      <ListItemText
                        primary={group.name}
                        secondary={`Created by: ${group.created_by}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
