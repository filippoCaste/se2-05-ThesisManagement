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
import { UserContext } from '../Contexts';
import applicationsAPI from '../services/applications.api';

export default function AlertDialog({
  open,
  handleClose,
  item,
  handleApply,
  loading,
  isAppliedProposals,
}) {
  console.log(item);
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

  useEffect(() => {
    applicationsAPI.getApplicationStudentsByProposalId(item.id)
      .then((response) => {
        setIsAppliedProposal(response.filter((o) => o.student_id === user.id).length > 0);
      }).catch(
        (err) => {console.log(err);}
      )
  });

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
           (
            <Button onClick={handleApply} color="primary" variant="contained" disabled={isAppliedProposal}>
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
