import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

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
