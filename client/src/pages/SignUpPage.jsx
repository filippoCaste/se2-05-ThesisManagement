import { useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Avatar,
  Box,
  Button,
  Container,
  Typography,
  TextField,
  Link,
} from "@mui/material";
import CustomSnackBar from "../components/CustomSnackbar";
import { useState } from "react";

function SignUpPage(props) {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (
      data.get("username") === "" ||
      data.get("email") === "" ||
      data.get("password") === "" ||
      data.get("confirmPassword") === ""
    ) {
      setMessage({ text: "Please fill in all fields", type: "error" });
      return;
    }
    if (data.get("password") !== data.get("confirmPassword")) {
      setMessage({ text: "Passwords do not match", type: "error" });
      return;
    }
    props.signup({
      username: data.get("username"),
      email: data.get("email"),
      password: data.get("password"),
    });
    setMessage({ text: data.get("username"), type: "success" });
  };

  return (
    <Box sx={{ height: "90vh", width: "98vw" }}>
      <CustomSnackBar message={message}></CustomSnackBar>
      <Container component="main" maxWidth="xs" disableGutters>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Link
              variant="body2"
              href="#"
              onClick={() => {
                navigate(-1);
              }}
            >
              Already have an account? Log in
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default SignUpPage;
