import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: "#003049", //prussian blue
    },
    secondary: {
      main: "#F77F00",  //orange
    },
    danger: {
      main: "#D62828", //fire engine red
    },
    info: {
      main: "#FCBF49", //xantous
    },
    success: {
      main: "#35682D",  //green
    }
  },
  // Other theme configuration options here, if needed
});

export default theme;
