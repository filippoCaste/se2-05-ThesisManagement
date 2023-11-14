import React from 'react';
import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { Navigate, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Typography from '@mui/material/Typography';

import { FormControl, InputLabel, Select, MenuItem, Input } from '@mui/material';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse,
    List,
    ListItem,
    ListItemText } from '@mui/material';

import API_Proposal from '../services/proposals.api'
import API_Degrees from '../services/degrees.api'
import API_Keywords from '../services/keywords.api'
import API_Teachers from '../services/teachers.api'
import API_Group from '../services/groups.api'
import API_Users from '../services/users.api'
import API_Applications from '../services/applications.api'


function convertiData(dataString) 
{
    const data = new Date(dataString);
    
    const giorno = String(data.getDate()).padStart(2, '0');
    const mese = String(data.getMonth() + 1).padStart(2, '0'); // I mesi sono indicizzati da 0 a 11
    const anno = data.getFullYear();
  
    return `${giorno}/${mese}/${anno}`;
}


function RigaProposal(props)
{
    const proposal= props.proposal;
    const number_proposal= props.number_proposal;  //numero proposte posted del teacher Loggatto

    const expirationDateFormattata = convertiData(proposal.expiration_date);

    // QUESTI SOLO GLI STUDENTI CHE HANNO FATTO RICHIESTA PER LA PROPOSTA "CORRENTE"
    // OVVIAMENTE QUESTI STUDENTI DOVRANNO ESSERE PRESI DAL DB TRAMITE OPPORTUNA API 
    const [openList, setOpenList] = useState(Array(number_proposal).fill(false)); 

    const handleButtonClick = (index) => {
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

    if(proposal.level==1)
        livello_convertito= 'Bachelor of Science';
    if(proposal.level==2)
        livello_convertito= 'Master of Science';
      
    

    return(
        <>
        <React.Fragment key={proposal.id}>
         <TableRow style={{ boxShadow: '2px 2px 5px #888888'}} >
           <TableCell style={{ fontSize: '18px' }}>   {proposal.title}             </TableCell>
           <TableCell style={{ fontSize: '18px' }}>   {proposal.type}              </TableCell>
           <TableCell style={{ fontSize: '18px' }}>   {proposal.description}       </TableCell>
           <TableCell style={{ fontSize: '18px' }}>   {livello_convertito}         </TableCell>
           <TableCell style={{ fontSize: '18px' }}>   {proposal.notes}             </TableCell>
           <TableCell style={{ fontSize: '18px' }}>   {expirationDateFormattata}   </TableCell>
           <TableCell style={{ fontSize: '18px' }}>   {proposal.required_knowledge}   </TableCell>
           <TableCell style={{ fontSize: '18px' }}>   {proposal.title_degree}   </TableCell>
           <TableCell style={{ fontSize: '18px' }}>   {proposal.title_group}   </TableCell>
           <TableCell style={{ fontSize: '18px' }}>   {proposal.cod_degree}   </TableCell>
           <TableCell style={{ fontSize: '18px' }}>   {proposal.cod_group}   </TableCell>
           
        </ TableRow>

        {studentList.length > 0 ? (
            <TableRow>
                <TableCell colSpan={2}>
                  <Button  variant="contained"   onClick={() => handleButtonClick(proposal.id)}>
                    {openList[proposal.id] ? 'Close List' : 'Show List Students Who Request'}
                  </Button>
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
                                    <TableCell style={{ fontSize: '18px' }}>   {student.student_id}   </TableCell>
                                    <TableCell style={{ fontSize: '18px' }}>   {student.student_name}   </TableCell>
                                    <TableCell style={{ fontSize: '18px' }}>   {student.student_surname}   </TableCell>
                                    <TableCell style={{ fontSize: '18px' }}>   {student.student_email}   </TableCell>
                                    <TableCell style={{ fontSize: '18px' }}>   {student.submission_date}   </TableCell>
                                    <TableCell style={{ fontSize: '18px' }}>   {student.student_title_degree}   </TableCell>
                                    <TableCell style={{ fontSize: '18px' }}>   {student.student_enrollment_year}   </TableCell>
                                    <TableCell style={{ fontSize: '18px' }}>   {student.student_nationality}   </TableCell>
                                             
                                </TableRow>
                            ))}
                       </TableBody>

                    </TableContainer>    
                    </List>
                   </Collapse>
                </TableCell>
            </TableRow>
         ) 
         : 
         (
            <TableRow> 
                <TableCell colSpan={8}> 
                    <Typography variant="h5">   No student has applied for this thesis </Typography> 
                </TableCell>
            
            </TableRow>
        )}
         
        </React.Fragment>
        
        <br /> 
        <TableRow> 


        </TableRow>  
        <br /> 


        </>
           
    );

}

function BrowseApplicationsComponent(props)
{

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


    const navigate= useNavigate();

    const [teacherLoggato, SetTeacherLoggato]=useState(parseInt(10000)); //fatto poi meglio tramite ID di sessione
    const [listProposals, setListProposals]=useState('');

    // USE EFFECT /////////////////////////////////////////////

    //Facciamo finta che il Teacher Loggatto abbia id 10000
    
    useEffect(()=>{
        API_Proposal.getProposalsByTeacherId(10000)    
        .then((p)=>setListProposals(p))
        .catch((err) => handleError(err));
    },[]);
    


    return(
        <>
            <br /> <br /> <br /> <br />  <br /> 
            <Typography variant="h5"> ALL MY APPLICATIONS POSTED  </Typography>
            <br /> 
            <Button variant="contained" color="error" onClick={()=>navigate('/teacher')}> BACK </Button>

            <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell> <Typography fontWeight="bold"> TITLE </Typography> </TableCell>
                        <TableCell> <Typography fontWeight="bold"> TYPE </Typography> </TableCell>
                        <TableCell> <Typography fontWeight="bold"> DESCRIPTION </Typography> </TableCell>
                        <TableCell> <Typography fontWeight="bold"> LEVEL </Typography> </TableCell>
                        <TableCell> <Typography fontWeight="bold"> NOTES </Typography> </TableCell>
                        <TableCell> <Typography fontWeight="bold"> EXPIRATION DATE </Typography> </TableCell>
                        <TableCell> <Typography fontWeight="bold"> REQUIRED KNOWLEDGE </Typography> </TableCell>
                        <TableCell> <Typography fontWeight="bold"> TITLE DEGREE </Typography> </TableCell>
                        <TableCell> <Typography fontWeight="bold"> TITLE GROUP </Typography> </TableCell>
                        <TableCell> <Typography fontWeight="bold"> COD DEGREE </Typography> </TableCell>
                        <TableCell> <Typography fontWeight="bold"> COD GROUP </Typography> </TableCell>
                   
                    </TableRow>
                </TableHead>
                
                <TableBody>
                {   
                     Array.from(listProposals).filter(p=>p.status=="posted").map((proposal,index)=>{
                      return <RigaProposal proposal={proposal} number_proposal={listProposals.length}  key={index} />}) 
                }
                </TableBody>

            </Table>
            </TableContainer>
            
         

        </>    
    );


}

export default BrowseApplicationsComponent;