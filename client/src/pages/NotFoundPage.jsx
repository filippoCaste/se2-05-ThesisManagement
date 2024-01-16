import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { UserContext } from '../Contexts';

const NotFoundPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const redirectTo = () => {
    if (user && user.role) {
      navigate(`/${user.role}`);
    } else {
      navigate('/');
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      minWidth="100vw"
    >
      <Typography variant="h1" component="h1" align="center" gutterBottom>
        404
      </Typography>
      <Typography variant="h4" component="h2" align="center" gutterBottom>
        Oops! Page not found
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        The page you are looking for does not exist.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={redirectTo}
        size="large"
      >
        Go back to Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
