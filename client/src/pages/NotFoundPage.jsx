import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
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
        component={Link}
        to="/"
        size="large"
      >
        Go back to Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
