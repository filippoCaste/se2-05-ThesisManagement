

import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import dayjs from 'dayjs';
export default function AlertDialog({ open, handleClose, item, handleApply, loading }) {
  // Filter the supervisors based on the supervisor_id
  const mainSupervisor = item?.supervisorsInfo?.find(supervisor => supervisor.id === item.supervisor_id);
  const coSupervisors = item?.supervisorsInfo?.filter(supervisor => supervisor.id !== item.supervisor_id);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{fontWeight: 'bold' }}>{item?.title}</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          Description: {item?.description}
        </Typography>
        <Typography gutterBottom>
          Notes: {item?.notes}
        </Typography>
        <Typography gutterBottom>
          Expiration Date: {dayjs(item?.expiration_date).format("YYYY-MM-DD")}
        </Typography>
        <Typography gutterBottom>
          Level: {item?.level}
        </Typography>
        <Typography gutterBottom>
          Degree Code: {item?.cod_degree}
        </Typography>
        

        {mainSupervisor && (
          <>
            <Typography>
              Supervisor: {mainSupervisor.name} {mainSupervisor.surname} ({mainSupervisor.email})
            </Typography>
          </>
        )}

        {/* Display co-supervisors */}
        {coSupervisors?.map((supervisor, index) => (
            <>
            <Typography key={index}>
              Co-Supervisor: {supervisor.name} {supervisor.surname} ({supervisor.email})
            </Typography>

            </>
        ))}

        <Typography gutterBottom>
          Group Code: {item?.cod_group}
        </Typography>
        <Typography gutterBottom>
          Required Knowledge: {item?.required_knowledge}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        {loading ? <CircularProgress /> : <Button onClick={handleApply} autoFocus>Apply</Button>}
      </DialogActions>
    </Dialog>
  );
}
