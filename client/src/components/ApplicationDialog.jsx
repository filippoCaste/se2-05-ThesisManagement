import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  CircularProgress,
} from '@mui/material';
import dayjs from 'dayjs';
import theme from '../theme';
import { MessageContext } from '../Contexts';
import { useContext } from 'react';
import applicationsAPI from '../services/applications.api';


export default function ApplicationDialog(props) {
const {open, handleClose, item, loading} = props;
const handleMessage = useContext(MessageContext);
const [statusChangeLoading, setStatusChangeLoading] = React.useState(false);
const {
    student_name,
    student_surname,
    student_email,
    student_enrollment_year,
    student_id,
    student_nationality,
    student_title_degree,
    student_submission_date,
    status,
  } = item || {};  

  const changeStatusOfApplication = async (studentsRow, status) => {
    try {
      setStatusChangeLoading(true);

      const response = await applicationsAPI.changeStatusOfApplication(studentsRow.application_id, status);

      if (response) {
        studentsRow.status = status;
      }
    } catch (error) {
      handleMessage("Error changing status:"+ error,"warning");
    } finally {
      setStatusChangeLoading(false);
    }
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 8,
        },
      }}
    >
      <DialogTitle sx={{ borderBottom: `1px solid ${theme.palette.secondary.main}`, color: theme.palette.primary.main }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        {student_name} {student_surname}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ padding: '20px', backgroundColor: theme.palette.background.default }}>
        {renderField("Id", student_id)}
        {renderField("Email", student_email)}
        {renderField("Title Degree", student_title_degree)}
        {renderField("Enrollment Year", student_enrollment_year)}
        {renderField("Nationality", student_nationality)}
        {renderField("Submission Date", dayjs(student_submission_date).format("DD/MM/YYYY"))}
        {renderField("Status", status)}
      </DialogContent>
      <DialogActions sx={{ padding: '20px', borderTop: `1px solid ${theme.palette.secondary.main}`, justifyContent: 'space-between' }}>
        {loading ? (
          <CircularProgress color="primary" size={24} />
        ) : 
         <Button disabled={status != "submitted"} onClick={() => {changeStatusOfApplication(item, 'accepted');handleClose();}} color="primary" variant="contained">
              <Typography variant="button" sx={{ color: 'white' }}>
                Accept
              </Typography>
            </Button>
        }
            <Button  disabled={status != "submitted"} onClick={() => {changeStatusOfApplication(item, 'refused');handleClose();}} color="warning" variant="contained">
               <Typography variant="button" sx={{ color: 'white' }}>
                  Refuse
               </Typography>
            </Button>
            <Button onClick={handleClose} color="secondary">
          <Typography variant="button" sx={{ color: theme.palette.secondary.main }}>
            Close
          </Typography>
        </Button> 
      </DialogActions>
    </Dialog>
  );

  function renderField(label, value) {
    if (label === "Level") {
      return (
        <Typography variant="body1" gutterBottom sx={{ color: theme.palette.text.primary }}>
          <strong>{label}:</strong> {value === "MSc" ? "Master of Science" : value === "BSc" ? "Bachelor of Science" : ""}
        </Typography>
      );
    }


    return (
      <Typography variant="body1" gutterBottom sx={{ color: theme.palette.text.primary }}>
        <strong>{label}:</strong> {value}
      </Typography>
    );
  }

}
