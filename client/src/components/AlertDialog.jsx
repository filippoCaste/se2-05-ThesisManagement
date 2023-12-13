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
import {useState, useContext, useEffect } from 'react';
import { UserContext, MessageContext } from '../Contexts';
import applicationsAPI from '../services/applications.api';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


export default function AlertDialog({
  open,
  handleClose,
  item,
  handleApply,
  loading,
  isAppliedProposals,
}) {
  const {
    supervisorsInfo,
    supervisor_id,
    title,
    description,
    keyword_names,
    notes,
    expiration_date,
    level,
    title_degree,
    title_group,
    required_knowledge,
  } = item || {};
  const mainSupervisor = supervisorsInfo?.find(
    (supervisor) => supervisor.id === supervisor_id
  );
  const coSupervisors = supervisorsInfo?.filter(
    (supervisor) => supervisor.id !== supervisor_id
  );
  const [isAppliedProposal, setIsAppliedProposal] = useState(false);
  const { user } = useContext(UserContext);
  const handleMessage = useContext(MessageContext);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
        applicationsAPI.getStudentApplications().then((response) => {
          setIsAppliedProposal(response.filter((o) => o.status !== 'rejected').length > 0);
        })
      .catch(
        (err) => {console.log(err);}
      )
  });

  const handleFileChange = (files) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
  
      if (fileExtension === 'pdf') {
        setSelectedFile(selectedFile);
      } else {
        handleMessage('Please insert a pdf file!', 'warning');
        files = null;
      }
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
      <DialogTitle
        sx={{
          borderBottom: `1px solid ${theme.palette.secondary.main}`,
          color: theme.palette.primary.main,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          padding: '20px',
          backgroundColor: theme.palette.background.default,
        }}
      >
        {renderField('Description', description)}
        {renderField("Keywords", keyword_names)}
        {renderField('Notes', notes)}
        {renderField(
          'Expiration Date',
          dayjs(expiration_date).format('DD/MM/YYYY')
        )}
        {renderField('Level', level)}
        {renderField('Degree', title_degree)}

        {mainSupervisor && renderSupervisor('Supervisor', mainSupervisor)}
        {coSupervisors?.map((supervisor, index) =>
          renderSupervisor('Co-Supervisor', supervisor, index)
        )}

        {renderField('Group', title_group)}
        {renderField('Required Knowledge', required_knowledge)}
        {handleApply && !isAppliedProposals && 
          <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} disabled={isAppliedProposal}>
            Upload file
            <VisuallyHiddenInput type="file" accept=".pdf" onChange={(e) => handleFileChange(e.target.files)}/>
          </Button>
        }
        {!isAppliedProposals && selectedFile && (
          <Typography variant="body1" gutterBottom>
            <strong>Selected file:</strong> {selectedFile.name}
          </Typography>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          padding: '20px',
          borderTop: `1px solid ${theme.palette.secondary.main}`,
          justifyContent: 'space-between',
        }}
      >
        <Button onClick={handleClose} color="secondary">
          <Typography
            variant="button"
            sx={{ color: theme.palette.secondary.main }}
          >
            Close
          </Typography>
        </Button>
        {loading ? (
          <CircularProgress color="primary" size={24} />
        ) : (
          handleApply &&
          !isAppliedProposals &&
           (
            <Button onClick={() => handleApply(selectedFile)} color="primary" variant="contained" disabled={isAppliedProposal}>
              <Typography variant="button" sx={{ color: 'white' }}>
                Apply
              </Typography>
            </Button>
          )
        )}
      </DialogActions>
    </Dialog>
  );

  function renderField(label, value) {
    if (label === 'Level') {
      return (
        <Typography
          variant="body1"
          gutterBottom
          sx={{ color: theme.palette.text.primary }}
        >
          <strong>{label}:</strong>{' '}
          {value === 'MSc'
            ? 'Master of Science'
            : value === 'BSc'
            ? 'Bachelor of Science'
            : ''}
        </Typography>
      );
    }

    return (
      <Typography
        variant="body1"
        gutterBottom
        sx={{ color: theme.palette.text.primary }}
      >
        <strong>{label}:</strong> {value}
      </Typography>
    );
  }

  function renderSupervisor(label, supervisor, index) {
    const { name, surname, email } = supervisor;
    return (
      <Typography
        key={index}
        variant="body1"
        gutterBottom
        sx={{ color: theme.palette.text.primary }}
      >
        <strong>{label}:</strong> {`${name} ${surname} (${email})`}
      </Typography>
    );
  }
}
