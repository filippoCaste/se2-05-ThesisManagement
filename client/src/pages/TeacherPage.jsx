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

   const navigate = useNavigate();
   const { user } = useContext(UserContext);
   const [errorMsgAPI, setErrorMsgAPI] = useState('');
   const [listProposals, setListProposals]=useState([]);
   //const [filterStatus,setFilterStatus]=useState('posted');
   const [openDialog, setOpenDialog] = useState(false);
   const [selectedItem, setSelectedItem] = useState(null);
   const [loading, setLoading] = useState(false);

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
   useEffect(() => { 
      const fetchData = async () => {
         if (user) {
            const proposals = await API_Proposal.getProposalsByTeacherId(user.id);
            const notExpiredProposals = proposals.filter((p) => dayjs(p?.expiration_date).isAfter(currentDataAndTime));
            const data = await createData(notExpiredProposals);
            setListProposals(data);
         }
      }

      fetchData();
   }, [user,currentDataAndTime]);

   return(
      <>
      <br />  <br />  <br />  <br /> <br />

      {/*<Typography variant="h5" align="center"> PAGES STATUS {filterStatus}  </Typography> <br />*/}

      <Grid  container spacing={2}>
         <Grid item xs={4}>
            <Button variant="contained" color="primary" 
            onClick={()=>navigate("/teacher/addProposal", {state:{currentDataAndTime}})} > INSERT NEW THESIS PROPOSAL </Button>  <br/> <br/>
         </Grid> 
         {/*<Grid item xs={4}>
            <FormControl fullWidth>
               <Typography variant="subtitle1" fontWeight="bold">  FILTER BY STATUS  </Typography>
               <Select
                  labelId="word-label"
                  id="status-select"
                  onChange={(ev) => { setFilterStatus(ev.target.value) }}
               >
                  {
                     Array.from(["all", "posted", "active"]).map((status, index) => 
                     (<MenuItem key={index} value={status}> {status} </MenuItem> ))
                  }
               </Select>
            </FormControl>
               </Grid> */}
         

         <CollapsibleTable listProposals={listProposals} onClick={handleClick}/>
         {openDialog && (
            <AlertDialog 
               open={openDialog}
               handleClose={() => {setLoading(false); setOpenDialog(false);}}
               loading = {loading}
               item={selectedItem}
          />
         )}
      </Grid>
      
      </>

   );

   

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
      <br /> <br /> <br /> <br /> <br />
      {/*<Typography variant="h5" align="center"> PAGES STATUS {filterStatus}  </Typography> <br />*/}
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
               </RadioGroup>
            </FormControl>
        </Grid> 
        

        <CollapsibleTable
          listProposals={listProposals}
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
          />
        )}
      </Grid>
    </>
  );
}

export default TeacherPage;
