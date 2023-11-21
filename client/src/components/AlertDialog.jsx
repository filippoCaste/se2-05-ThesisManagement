import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import dayjs from 'dayjs';

export default function AlertDialog({ open, handleClose, item, handleApply, loading }) {
  const mainSupervisor = item?.supervisorsInfo?.find(supervisor => supervisor.id === item.supervisor_id);
  const coSupervisors = item?.supervisorsInfo?.filter(supervisor => supervisor.id !== item.supervisor_id);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="md"
      sx={{
        borderRadius: 8,
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: '1px solid #ddd',
          color: '#333',
          paddingBottom: 2,
          marginBottom: 1,
        }}
      >
        <b>{item?.title}</b>
      </DialogTitle>
      <DialogContent sx={{ padding: '20px' }}>
        {renderField("Description", item?.description)}
        {renderField("Notes", item?.notes)}
        {renderField("Expiration Date", dayjs(item?.expiration_date).format("YYYY-MM-DD"))}
        {renderField("Level", item?.level)}
        {renderField("Degree", item?.title_degree)}

        {mainSupervisor && renderSupervisor("Supervisor", mainSupervisor)}
        {coSupervisors?.map((supervisor, index) => renderSupervisor("Co-Supervisor", supervisor, index))}

        {renderField("Group", item?.title_group)}
        {renderField("Required Knowledge", item?.required_knowledge)}
      </DialogContent>
      <DialogActions sx={{ padding: '20px', borderTop: '1px solid #ddd' }}>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
        {loading ? (
          <CircularProgress color="primary" size={24} />
        ) : (
          <Button onClick={handleApply} color="primary" autoFocus>
            Apply
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  function renderField(label, value) {
    return (
      <Typography variant="body1" gutterBottom>
        <strong>{label}:</strong> {value}
      </Typography>
    );
  }

  function renderSupervisor(label, supervisor, index) {
    return (
      <Typography key={index} variant="body1" gutterBottom>
        <strong>{label}:</strong> {`${supervisor.name} ${supervisor.surname} (${supervisor.email})`}
      </Typography>
    );
  }
}
