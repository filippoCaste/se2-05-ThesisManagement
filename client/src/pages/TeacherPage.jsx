import React from 'react';
import { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { Grid, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import API_Proposal from '../services/proposals.api';
import API_Applications from '../services/applications.api';
import { MessageContext, UserContext } from '../Contexts';
import CollapsibleTable from '../components/CollapsibleTable';
import AlertDialog from '../components/AlertDialog';
import dayjs from 'dayjs';
import ConfirmationDialog from '../components/ConfirmationDialog';

function TeacherPage(props)
{  
   const {currentDataAndTime} = props;
   const handleMessage = useContext(MessageContext);

   const navigate = useNavigate();
   const { user } = useContext(UserContext);
   const [errorMsgAPI, setErrorMsgAPI] = useState('');
   const [listProposals, setListProposals]=useState([]);
   const [filterStatus,setFilterStatus]=useState('posted');
   const [openDialog, setOpenDialog] = useState(false);
   const [openDialogApplication, setOpenDialogApplication] = useState(false);
   const [selectedItem, setSelectedItem] = useState(null);
   const [loading, setLoading] = useState(false);

   const [confirmation, setConfirmation] = useState(false);
   const [index, setIndex] = useState(null); // used for the confirmation procedure
   const [message, setMessage] = useState(null);
   const [operation, setOperation] = useState(null);
  
  async function createRow(p) {
    const students = await API_Applications.getApplicationStudentsByProposalId(
      p.id
    );
    return { p, students };
  }

  async function createData(proposals) {
    const rows = await Promise.all(proposals.map((p) => createRow(p)));
    return rows;
  }

   const handleClick = (datum) => {
      setSelectedItem(datum);
      setOpenDialog(true);
   };
  const handleClickApplication = (datum) => {
    setSelectedApplication(datum);
    setOpenDialogApplication(true);
  };  

  const fetchData = async () => {
    if (user) {
       const proposals = await API_Proposal.getProposalsByTeacherId(user.id);
       
       proposals?.forEach(item => {
         if (dayjs(item.expiration_date).isBefore(currentDataAndTime.subtract(1, 'day'))) {
           item.status = "archived";
         }
       });

        const filteredProposal = proposals?.filter(row => row?.status === filterStatus);

        //const notExpiredProposals = proposals.filter((p) => dayjs(p?.expiration_date).isAfter(currentDataAndTime));
        const data = await createData(filteredProposal);
        data?.forEach(item => {
          if (item.p.status === "archived") {
              item.students.forEach(student => {
                if (student.status === 'pending') {
                  student.status = 'rejected';
                }
              });
          }
        });

       setListProposals(data);
       }
    }


   useEffect(() => { 
      fetchData();
   }, [user, currentDataAndTime, filterStatus]);

  async function deleteProposal(ind) {
    setIndex(ind);
    setMessage("Are you sure you want to delete this thesis proposal?");
    setOperation('delete');
    setConfirmation(true);
  }
  async function archiveProposal(ind) {
    setIndex(ind);
    setMessage("Are you sure you want to archive this thesis proposal?");
    setOperation('archive');
  }

  const customConfirmation = (message, operation) => {
    return (
      operation.toLowerCase()==='delete' 
                          ? <ConfirmationDialog message={message} operation={operation} onClose={handleCloseDialog} open={confirmation} onConfirm={handleDeleteConfirmation} />
                          : <ConfirmationDialog message={message} operation={operation} onClose={handleCloseDialog} open={confirmation} onConfirm={handleArchiveConfirmation} />
    )
  }

  const handleCloseDialog = () => {
    setConfirmation(false);
  }

  const handleDeleteConfirmation = async (result) => {
    if (result) {
      try {
        await API_Proposal.deleteProposal(listProposals[index].p.id);
        setListProposals(listProposals.filter((_, i) => i !== index));
      } catch(err) {
        console.error('Error deleting proposal:', err);
        handleMessage("Error deleting proposal", "error");
      } finally {
        setIndex(null);
        setOperation(null);
        setMessage(null);
        handleMessage("Proposal successfully deleted", "success");
      }
    } else {
      setConfirmation(false);
    }
  }

  const handleArchiveConfirmation = async (result) => {
    if (result) {
      try {
        await API_Proposal.archivedProposal(listProposals[index].p.id);
        setListProposals(listProposals.filter((_, i) => i !== index));
      } catch(err) {
        console.error('Error archiving proposal:', err);
        handleMessage("Error archiving proposal", "error");
      } finally {
        setIndex(null);
        setOperation(null);
        setMessage(null);
        handleMessage("Proposal successfully archived", "success");
      }
    } else {
      setConfirmation(false);
    }
  }

  return (
    <>
      <br /> <br /> <br /> <br /> <br /> <br />
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/teacher/addProposal')}
          >
            {' '}
            INSERT NEW THESIS PROPOSAL{' '}
          </Button>{' '}
          <br /> <br />
        </Grid>
        
        
        <Grid item xs={4}>
            <FormControl fullWidth>
               <Typography variant="subtitle1" fontWeight="bold">  Thesis Status  </Typography>
               <RadioGroup row value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)}>
                  <FormControlLabel value="posted" control={<Radio />} label="Posted" />
                  <FormControlLabel value="archived" control={<Radio />} label="Archived" />
                  <FormControlLabel value="assigned" control={<Radio />} label="Assigned" />
               </RadioGroup>
            </FormControl>
        </Grid> 
        
        {confirmation && customConfirmation(message, operation)}
        
        <CollapsibleTable
          listProposals={ listProposals }
          fetchProposals={fetchData}
          onClick={handleClick}
          onClickApplication={handleClickApplication}
          deleteProposal={deleteProposal}
          archiveProposal={archiveProposal}
        />
        {openDialog && (
          <AlertDialog
            open={openDialog}
            handleClose={() => {
              setLoading(false);
              setOpenDialog(false);
            }}
            loading={loading}
            item={selectedItem}
          />
        )}
        {openDialogApplication && (
          <ApplicationDialog
            open={openDialogApplication}
            handleClose={() => {
              setLoading(false);
              setOpenDialogApplication(false);
            }}
            loading={loading}
            item={selectedApplication}
            fetchProposals={fetchData}
          />
        )}
      </Grid>
    </>
  );
}

export default TeacherPage;
