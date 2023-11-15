import React from 'react';
import Typography from '@mui/material/Typography';
import theme from '../theme';
import { ThemeProvider } from '@mui/material/styles';

function InitialPage()
{
 
    return(
      <ThemeProvider theme={theme}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center' }}>
          <Typography variant="h5" color="primary.main" style={{ fontFamily: 'cursive', fontWeight: 'bold', padding: '20px', border: `2px solid ${theme.palette.primary.main}`, borderRadius: '10px' }}>
            Welcome! Please click the button in the top right to log in.
          </Typography>
        </div>
      </ThemeProvider>


    );

}


export default InitialPage;