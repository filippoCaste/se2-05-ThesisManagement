import { Fragment, useEffect, useState } from "react";
import { Snackbar, IconButton, Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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
    <Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Fragment>
  );
  return !props.message.text ? null : (
    <Snackbar
      open={open}
      autoHideDuration={6000}
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

export default CustomSnackBar;
