import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useState } from "react";

export default function ConfirmationDialog({ open, onClose, onConfirm, message, operation }) {
    // operation: 'Delete', 'Update', 'Apply', 'Send', ...

    const handleConfirm = () => {
        onConfirm(true);
        onClose();
    };

    const handleCancel = () => {
        onConfirm(false);
        onClose();
    };

    return (
        <Dialog 
            open={open}
            onClose={handleCancel}
            >
            <DialogTitle id="responsive-dialog-title">
                {"Confirm operation"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} variant="outlined" color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleConfirm} variant="contained" color="primary">
                    {operation}
                </Button>
            </DialogActions>
        </Dialog>
    );
}




/*
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function ResponsiveDialog() {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


  return (
    <React.Fragment>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >

      </Dialog>
    </React.Fragment>
  );
}
*/