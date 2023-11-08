import React from 'react';
import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Typography from '@mui/material/Typography';


import API_Proposal from '../services/proposals.api'
import API_Degrees from '../services/degrees.api'

function TeacherPage(props)
{
    const navigate = useNavigate();

 
    return(
       <> 
          <Typography variant="h5"> PROFESSOR PAGE  </Typography> <br />   <br />  <br />  <br /> 
    
          <Button variant="contained" color="primary" 
            onClick={()=>navigate("/teacher/addProposal")} > INSERT NEW THESIS PROPOSAL </Button>  <br/> <br/>

          <Button variant="contained" color="primary"> SEE ALL MY THESIS PROPOSAL </Button>  <br />

       
       </>


    );

}


export default TeacherPage;