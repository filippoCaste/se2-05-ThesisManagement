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

  async function deleteProposal(index) {
    const acceptDelete = confirm('Are you sure to delete this proposal?');
    if (!acceptDelete) {
      return;
    }
    await API_Proposal.deleteProposal(listProposals[index].p.id);
    setListProposals(listProposals.filter((_, i) => i !== index));
    handleMessage("Deleted proposal", "success");
  }
  async function archiveProposal(index) {
    const acceptArchive = confirm('Are you sure to archive this proposal?');
    if (!acceptArchive) {
      return;
    }
    await API_Proposal.archivedProposal(listProposals[index].p.id);
    setListProposals(listProposals.filter((_, i) => i !== index));
    handleMessage("Archived proposal", "success");
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
