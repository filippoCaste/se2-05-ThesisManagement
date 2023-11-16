import React from 'react';
import { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, List, Container } from '@mui/material';
import API_Proposal from '../services/proposals.api';
import API_Applications from '../services/applications.api';
import { UserContext } from '../Contexts';


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

    if(proposal.level==="BSc")
        livello_convertito= 'Bachelor of Science';
    if(proposal.level==="MSc")
        livello_convertito= 'Master of Science';

    return(
        <>
        {/* <React.Fragment key={proposal.id}> */}
         <TableRow style={{ boxShadow: '2px 2px 5px #888888'}} >
            <TableCell >   {proposal.title}             </TableCell>
            <TableCell >   {proposal.type}              </TableCell>
            <TableCell >   {proposal.description}       </TableCell>
            <TableCell >   {livello_convertito}         </TableCell>
            <TableCell >   {proposal.notes}             </TableCell>
            <TableCell >   {expirationDateFormattata}   </TableCell>
            <TableCell >   {proposal.required_knowledge}   </TableCell>
            <TableCell >   {proposal.title_degree}   </TableCell>
            <TableCell >   {proposal.title_group}   </TableCell>
           
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
                                    <TableCell style={{ fontSize: '2vh' }}>   {student.student_id}   </TableCell>
                                    <TableCell style={{ fontSize: '2vh' }}>   {student.student_name}   </TableCell>
                                    <TableCell style={{ fontSize: '2vh' }}>   {student.student_surname}   </TableCell>
                                    <TableCell style={{ fontSize: '2vh' }}>   {student.student_email}   </TableCell>
                                    <TableCell style={{ fontSize: '2vh' }}>   {student.submission_date}   </TableCell>
                                    <TableCell style={{ fontSize: '2vh' }}>   {student.student_title_degree}   </TableCell>
                                    <TableCell style={{ fontSize: '2vh' }}>   {student.student_enrollment_year}   </TableCell>
                                    <TableCell style={{ fontSize: '2vh' }}>   {student.student_nationality}   </TableCell>
                                             
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
         
        {/* </React.Fragment> */}
        
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

    const { user } = useContext(UserContext);
    const [listProposals, setListProposals]=useState('');

    // USE EFFECT /////////////////////////////////////////////
    
    useEffect(()=>{
        API_Proposal.getProposalsByTeacherId(user.id)    
        .then((p)=>setListProposals(p))
        .catch((err) => handleError(err));
    },[]);
    


    return(
        <Container>
            <br /> <br /> <br /> <br />  <br /> <br/>
            <Typography variant="h5"> ALL MY APPLICATIONS POSTED  </Typography>
            <br /> 
            <Button variant="contained" color="error" onClick={()=>navigate('/teacher')}> BACK </Button> <br/>

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
            
         

        </Container>    
    );


}

export default BrowseApplicationsComponent;