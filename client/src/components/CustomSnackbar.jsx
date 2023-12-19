import { useEffect, useState } from "react";
import { Snackbar, IconButton, Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";

function CustomSnackBar(props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, [props.message]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleClose}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );
  return !props.message.text ? null : (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={handleClose}
      action={action}
    >
      <Alert
        onClose={handleClose}
        severity={props.message.type}
        sx={{ width: "100%" }}
      >
        {props.message.text}
      </Alert>
    </Snackbar>
  );
}

CustomSnackBar.propTypes = {
  message: PropTypes.object.isRequired,
};

export default CustomSnackBar;
