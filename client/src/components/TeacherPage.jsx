import React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';

function TeacherPage(props)
{
    const navigate = useNavigate();
 
    return(
      <> 
         <Typography variant="h5"> PROFESSOR PAGE  </Typography> <br />   <br />  <br />  <br /> 
    
         <Button variant="contained" color="primary" 
            onClick={()=>navigate("/teacher/addProposal")} > INSERT NEW THESIS PROPOSAL </Button>  <br/> <br/>

         <Button variant="contained" color="primary" 
            onClick={()=>navigate("/teacher/browseApplications")} > BROWSE APPLICATIONS </Button>  <br/> <br/>


       
       </>


    );

}

export default TeacherPage;