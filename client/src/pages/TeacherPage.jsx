import React from 'react';
import { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { Grid, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import API_Proposal from '../services/proposals.api';
import API_Applications from '../services/applications.api';
import { UserContext } from '../Contexts';
import CollapsibleTable from '../components/CollapsibleTable';
import AlertDialog from '../components/AlertDialog';


function TeacherPage(props)
{
   const navigate = useNavigate();
   const { user } = useContext(UserContext);
   const [errorMsgAPI, setErrorMsgAPI] = useState('');
   const [listProposals, setListProposals]=useState([]);
   const [filterStatus,setFilterStatus]=useState('posted');
   const [openDialog, setOpenDialog] = useState(false);
   const [selectedItem, setSelectedItem] = useState(null);
   const [loading, setLoading] = useState(false);

   function handleError(err) {
      let errMsgAPI = 'ERRORE SCONOSCIUTO';
      if (err.errors) 
      {
         if (err.errors[0])
            if (err.errors[0].msg)
            errMsgAPI = err.errors[0].msg;
      } 
      else if (err.error) 
      {
         errMsgAPI = err.error;
      }
      setErrorMsgAPI(errMsgAPI);
   }

   async function createRow(p) {
      const students = await API_Applications.getApplicationStudentsByProposalId(p.id);
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
  
   useEffect(() => { 
      const fetchData = async () => {
         if (user) {
            const proposals = await API_Proposal.getProposalsByTeacherId(user.id);
            const data = await createData(proposals);
            const filteredProposal = data.filter(row => row.p.status === filterStatus);
            setListProposals(filteredProposal);
         }
      }

      fetchData();
   }, [user, filterStatus]);

   

   return(
      <>
      <br />  <br />  <br />  <br /> <br />

      <Grid  container spacing={2}>
         <Grid item xs={4}>
            <Button variant="contained" color="primary" 
            onClick={()=>navigate("/teacher/addProposal")} > INSERT NEW THESIS PROPOSAL </Button>  <br/> <br/>
         </Grid> 
         
         {/*<Grid item xs={4} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <FormControl fullWidth>
               <Typography variant="subtitle1" fontWeight="bold">  Thesis Status  </Typography>
               <RadioGroup row value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)}>
                  <FormControlLabel value="posted" control={<Radio />} label="Posted" />
                  {/*<FormControlLabel value="archived" control={<Radio />} label="Archived" />}
               </RadioGroup>
            </FormControl>
         </Grid>*/}

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

   
}

export default TeacherPage;