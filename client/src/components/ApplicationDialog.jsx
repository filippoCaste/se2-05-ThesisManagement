import React, { useState, useEffect, useContext } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  useMediaQuery
} from '@mui/material';
import dayjs from 'dayjs';
import theme from '../theme';
import StickyHeadTable from './GenericTable';
import careerAPI from '../services/career.api';
import { MessageContext } from '../Contexts';
import PropTypes from 'prop-types';

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

function StudentInformation(student_id, student_email, student_title_degree, student_enrollment_year, student_nationality, submission_date, status,isSecretary) {
  return (
    <>
      {renderField("Id", student_id)}
      {renderField("Email", student_email)}
      {renderField("Title Degree", student_title_degree)}
      {renderField("Enrollment Year", student_enrollment_year)}
      {renderField("Nationality", student_nationality)}
      {renderField("Submission Date", dayjs(submission_date).format("DD/MM/YYYY"))}
      {!isSecretary && renderField("Status", status)}
    </>
  );
};

export default function ApplicationDialog(props) {
const {open, handleClose, item, studentExams,isSecretary} = props;
const isSM = useMediaQuery(theme.breakpoints.down('md'));
const columns = [
  { id: 'cod_course', label: 'Course Code', width: '25%' },
  { id: 'title_course', label: 'Course Title', width: '50%' },
  { id: 'cfu', label: 'Cfu', width: '5%' },
  { id: 'grade', label: 'Grade', width: '5%' },
  { id: 'date', label: 'Date', width: '15%', format: (value) => dayjs(value).format('DD/MM/YYYY') },
];
const {
    student_name,
    student_surname,
    student_email,
    student_enrollment_year,
    student_id,
    student_nationality,
    student_title_degree,
    submission_date,
    status,
  } = item || {}; 
  console.log(studentExams)
  const [isStudentInformation, setIsStudentInformation] = useState(true);
  const [pdf, setPdf] = useState(null);
  const [fileExists, setFileExists] = useState(false);
  const handleMessage = useContext(MessageContext);

  useEffect(() => {
    if(!isSecretary){
    careerAPI.downloadFile(item.application_id, student_id).then((res) => {
      console.log(res);
      if(res.fileUrl) {
        setFileExists(true);
        setPdf(res.fileUrl);
      }
    })
    .catch((err) => handleMessage(err,"warning"));
  }
    }, [item.application_id, student_id]);

  const handleClick = () => {
    setIsStudentInformation(!isStudentInformation);
  };

  const handleShowCV = () => {
    console.log(pdf);
    window.open(pdf, '_blank');
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
        s{student_id} - {student_name} {student_surname}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ padding: '20px', backgroundColor: theme.palette.background.default }}>
      {
        !isSM && (
          <StickyHeadTable columns={columns} rows={studentExams} noDataMessage={'No exams passed'} />
        ) 
      }
      { isSM && (isStudentInformation ? (
          StudentInformation(student_id, student_email, student_title_degree, student_enrollment_year, student_nationality, submission_date, status,isSecretary)
        ) : (
          <StickyHeadTable columns={columns} rows={studentExams} noDataMessage={'No exams passed'} />
        ))
      } 
      </DialogContent>
      <DialogActions sx={{ padding: '20px', borderTop: `1px solid ${theme.palette.secondary.main}`, justifyContent: 'space-between' }}>
        {isSM ? 
        <Button color="secondary">
            <Typography onClick={handleClick} variant="button" sx={{ color: theme.palette.secondary.main }}>
              Student{isStudentInformation ? " Career     " : " Information"}
            </Typography>
        </Button>
        : <></> }
        {!isSecretary &&
        <Button onClick={handleShowCV} variant="contained" disabled={!fileExists}>
          <Typography variant="button">
            Show Student CV
          </Typography>
        </Button>
        }
        <Button onClick={handleClose} color="secondary">
          <Typography variant="button" sx={{ color: theme.palette.secondary.main }}>
            Close
          </Typography>
        </Button> 
      </DialogActions>
    </Dialog>
  );

}

ApplicationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  studentExams: PropTypes.array.isRequired,
};