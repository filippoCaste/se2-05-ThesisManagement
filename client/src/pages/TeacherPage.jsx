import React from 'react';
import { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
   Collapse, List, Container, Grid, Select, FormControl  } from '@mui/material';

import Box from '@mui/material/Box';

import theme from '../theme';

import { InputLabel, MenuItem, Input,  } from '@mui/material';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

import {
   Dialog,
   DialogActions,
   DialogContent,
   DialogTitle,
} from '@mui/material'

import API_Proposal from '../services/proposals.api';
import API_Applications from '../services/applications.api';
import { UserContext } from '../Contexts';


const styleModal = {
   position: 'absolute',
   top: '50%',
   left: '50%',
   transform: 'translate(-50%, -50%)',
   width: 1500,
   bgcolor: 'background.paper',
   border: '4px solid #000',
   boxShadow: 24,
   p: 4,
 };

function convertiData(dataString) 
{
    const data = new Date(dataString);
    
    const giorno = String(data.getDate()).padStart(2, '0');
    const mese = String(data.getMonth() + 1).padStart(2, '0'); // I mesi sono indicizzati da 0 a 11
    const anno = data.getFullYear();
  
    return `${giorno}/${mese}/${anno}`;
}

function renderField(label, value) {
   return (
     <Typography variant="body1" gutterBottom sx={{ color: theme.palette.text.primary }}>
       <strong>{label}:</strong> {value}
     </Typography>
   );
 }

function CustomDialog({ open, onClose, proposal }) 
{
   console.log(proposal);

   return (
     <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>

      <DialogTitle sx={{ borderBottom: `1px solid ${theme.palette.secondary.main}`, color: theme.palette.primary.main }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}> {proposal.title} </Typography>
      </DialogTitle>

      <DialogContent sx={{ padding: '20px', backgroundColor: theme.palette.background.default }}>
         {renderField("Description", proposal.description)}
         {renderField("Type", proposal.type)}
         {renderField("Level", proposal.level)}
         {renderField("Expiration Date", proposal.expiration_date)}
         {renderField("Notes", proposal.notes)}
         {renderField("Cod Degree", proposal.cod_degree)}
         {renderField("Cod Group", proposal.cod_group)}
         {renderField("Required Knowledge", proposal.required_knowledge)}
      </DialogContent>
      
       <DialogActions> 
         <Button onClick={onClose} style={{ backgroundColor: 'darkred', color: 'white' }}> Close </Button>
       </DialogActions>
     
     </Dialog>
   );
 }

function RigaProposal(props)
{

    const proposal= props.proposal;
    const number_proposal= props.number_proposal;  //numero proposte posted del teacher Loggatto

    const expirationDateFormattata = convertiData(proposal.expiration_date);

    // QUESTI SOLO GLI STUDENTI CHE HANNO FATTO RICHIESTA PER LA PROPOSTA "CORRENTE"
    // OVVIAMENTE QUESTI STUDENTI DOVRANNO ESSERE PRESI DAL DB TRAMITE OPPORTUNA API 
    const [openList, setOpenList] = useState(Array(number_proposal).fill(false)); 

    const handleButtonClick = (index) => 
    {
      const updatedOpenList = [...openList];
      updatedOpenList[index] = !updatedOpenList[index];
      setOpenList(updatedOpenList);
    };

    //LISTA DEGLI STUDENTI CHE HANNO FATTO RICHIESTA PER QUESTA PROPOSTA MOSTRATA SULLA RIGA
    const [studentList, setStudentList] = useState([]);
 
    
    useEffect(()=>
    {
            API_Applications.getApplicationStudentsByProposalId(proposal.id)
            .then((s)=>setStudentList(s))
            .catch((err) => console.error("Error fetching applications:", err));

    }, [proposal.id]);

    // converto livello in stringa
    // livello 1: Bachelor of Science
    // livello 2: Master of Science
    let livello_convertito= proposal.level;

    if(proposal.level==="BSc")
        livello_convertito= 'Bachelor of Science';
    if(proposal.level==="MSc")
        livello_convertito= 'Master of Science';


   const [open, setOpen] = useState(false);
   const handleOpen = () => {
      setOpen(true);
   };

   const handleClose = () => {
      setOpen(false);
   };

    return(
        <>

        <TableRow>
            <TableCell>{proposal.title}</TableCell>   
            <TableCell>{proposal.type}</TableCell>   
            <TableCell>{livello_convertito}</TableCell>   
            <TableCell>{expirationDateFormattata}</TableCell>   
            <TableCell>{proposal.title_degree}</TableCell>   
            <TableCell>{proposal.status}</TableCell>   
         </TableRow> 

         <TableRow>
         <TableCell>
         {studentList.length > 0 ?
            <td>
               <Button variant="contained" onClick={() => handleButtonClick(proposal.id)}>
                  {openList[proposal.id] ? 'Close List' : 'Students Request'}
               </Button>
            </td>

         :  <td> NO STUDENTS REQUEST </td> }
         </TableCell>

               
         { /*DIALOG SEE DETAILS */ }
            <TableCell>
               <div>
               <Button variant="outlined" onClick={handleOpen}> SEE DETAILS </Button>
               <CustomDialog
               open={open}
               onClose={handleClose}
               proposal={proposal} 
               />
               </div>
            </TableCell>


            <TableCell> 
               <Button variant="contained" startIcon={<EditIcon />}   
               style={{ backgroundColor: 'gold', color: 'black' }}> EDIT </Button>  </TableCell>

            <TableCell>
                <Button variant="contained" startIcon={<DeleteIcon />}
                style={{ backgroundColor: 'darkred', color: 'white' }}> DELETE </Button> </TableCell>

         </TableRow>

        {studentList.length > 0 ? (
            <TableRow>
                <TableCell colSpan={2}>  
                  <Collapse in={openList[proposal.id]}>
                    <List>
                    <TableContainer component={Paper} style={{ border: '2px solid black' }}>

                       <TableHead> 
                         <TableRow>
                            <TableCell > <Typography fontWeight="bold"> ID </Typography> </TableCell>
                            <TableCell > <Typography fontWeight="bold"> NAME </Typography> </TableCell>
                            <TableCell > <Typography fontWeight="bold"> SURNAME </Typography> </TableCell>       
                            <TableCell > <Typography fontWeight="bold"> EMAIL </Typography> </TableCell>  
                            <TableCell > <Typography fontWeight="bold"> SUBMISSION DATE </Typography> </TableCell>  
                            <TableCell > <Typography fontWeight="bold"> TITLE DEGREE </Typography> </TableCell>  
                            <TableCell > <Typography fontWeight="bold"> ENROLLMENT YEAR </Typography> </TableCell>  
                            <TableCell > <Typography fontWeight="bold"> NATIONALITY </Typography> </TableCell>  
                            
                        </TableRow>
                       </TableHead>

                       <TableBody>
                            {studentList.map((student, studentIndex) => (
                                <TableRow key={studentIndex}>
                                    <TableCell style={{ fontSize: '2vh' }}>   {student.student_id}   </TableCell>
                                    <TableCell style={{ fontSize: '2vh' }}>   {student.student_name}   </TableCell>
                                    <TableCell style={{ fontSize: '2vh' }}>   {student.student_surname}   </TableCell>
                                    <TableCell style={{ fontSize: '2vh' }}>   {student.student_email}   </TableCell>
                                    <TableCell style={{ fontSize: '2vh' }}>   {student.submission_date}   </TableCell>
                                    <TableCell style={{ fontSize: '2vh' }}>   {student.student_title_degree}   </TableCell>
                                    <TableCell style={{ fontSize: '2vh' }}>   {student.student_enrollment_year}   </TableCell>
                                    <TableCell style={{ fontSize: '2vh' }}>   {student.student_nationality}   </TableCell>
                                    
                                    <TableCell style={{ fontSize: '2vh' }} >   
                                        <Button variant="contained"  style={{ backgroundColor: 'green', color: 'white' }}> 
                                        ACCETTA 
                                        </Button>  </TableCell>
                                    <TableCell style={{ fontSize: '2vh' }}>   
                                       <Button variant="contained" color="error"> RIFIUTA </Button>  </TableCell>
                                             
                                </TableRow>
                            ))}
                       </TableBody>

                    </TableContainer>    
                    </List>
                   </Collapse>
                </TableCell>
 
            </TableRow> 
                  
         ) : <> </>
        }
        <TableRow  style={{border: '2px solid black'}}> </TableRow>  

        </>
           
    );

}

function TeacherPage(props)
{
   const { user } = useContext(UserContext);
   const [errorMsgAPI, setErrorMsgAPI] = useState('');

    function handleError(err) 
    {
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

   const navigate = useNavigate();
 
   const [listProposals, setListProposals]=useState('');
   const [filterStatus,setFilterStatus]=useState('all');
  
  
   // USE EFFECT /////////////////////////////////////////////
   useEffect(() => 
   {   
      if (user) 
      {
         API_Proposal.getProposalsByTeacherId(user.id)
         .then((p) => setListProposals(p))
         .catch((err) => handleError(err));
      }
   }, [user]); 


   return(
      <>
      <br />  <br />  <br />  <br /> <br />

      <Typography variant="h5" align="center"> PAGES STATUS {filterStatus}  </Typography> <br /> 

      <Grid  container spacing={2}>
      <Grid item xs={4}>
         <Button variant="contained" color="primary" 
         onClick={()=>navigate("/teacher/addProposal")} > INSERT NEW THESIS PROPOSAL </Button>  <br/> <br/>
      </Grid> 
      
      <Grid item xs={4}>
      <FormControl fullWidth>
         <Typography variant="subtitle1" fontWeight="bold">  FILTER BY STATUS  </Typography>
         < Select
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
      </Grid> 
      </Grid>

      <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
      <Table sx={{ width: '100%' }}>
         <TableHead>
            <TableRow>
               <TableCell>  <Typography fontWeight="bold">TITLE</Typography>  </TableCell>   
               <TableCell>  <Typography fontWeight="bold">TYPE</Typography> </TableCell>   
               <TableCell>  <Typography fontWeight="bold">LEVEL</Typography> </TableCell>   
               <TableCell>  <Typography fontWeight="bold">EXPIRATION DATE</Typography> </TableCell>   
               <TableCell>  <Typography fontWeight="bold">TITLE DEGREE</Typography> </TableCell>   
               <TableCell>  <Typography fontWeight="bold">STATUS</Typography> </TableCell>          
            </TableRow>
         </TableHead>
         
         
         {filterStatus=="all"?
            <TableBody>
            {   
               Array.from(listProposals).map((proposal,index)=>{
                  return <RigaProposal proposal={proposal} number_proposal={listProposals.length}  key={index} />}) 
            }
            </TableBody>
         :
         <TableBody>
         {   
            Array.from(listProposals).filter((p)=>(p.status==filterStatus)).map((proposal,index)=>{
               return <RigaProposal proposal={proposal} number_proposal={listProposals.length}  key={index} />
               
            }) 
         }
         
         </TableBody>
         }

      </Table>
      </TableContainer>      
      </>

   );

   
}

export default TeacherPage;