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


function isValidDate(dateString) {
  // La regex per il formato "dd/mm/yyyy"
  var datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;

  if (!datePattern.test(dateString)) {
    return false; // La stringa non corrisponde al formato
  }

  // Estrai i componenti della data
  var [, day, month, year] = dateString.match(datePattern);

  // Converte i componenti in numeri
  day = parseInt(day, 10);
  month = parseInt(month, 10);
  year = parseInt(year, 10);

  // Verifica la validità della data
  if (
    month < 1 || month > 12 ||
    day < 1 || day > 31 ||
    year < 1000 || year > 9999
  ) {
    return false; // Data non valida
  }

  // Controllo speciale per febbraio (bisestile)
  if (month === 2) {
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      if (day > 29) {
        return false; // Febbraio ha al massimo 29 giorni in un anno bisestile
      }
    } else if (day > 28) {
      return false; // Febbraio ha al massimo 28 giorni in un anno non bisestile
    }
  }

  // Controlli aggiuntivi per i mesi con meno di 31 giorni
  if ([4, 6, 9, 11].includes(month) && day > 30) {
    return false; // Aprile, giugno, settembre, novembre hanno al massimo 30 giorni
  }

  return true; // La data è valida
}



function AddProposalTeacher(props)
{
  const navigate= useNavigate();

  //Proposal Fields (By Slide 8)
  const [title,setTitle]=useState('Tesi sui processori');
  const [description,setDescription]=useState('blabla');
  const [required_knowledge,setRequired_knowledge]=useState('esame di architetture');
  const [supervisor,setSupervisor]=useState('Marco Torchiano');
  const [notes,setNotes]=useState('blabla');
  const [type,setType]=useState('bo');
  const [level,setLevel]=useState('bo');
  const [groups,setGroups]=useState('Ingegneria Informatica');
  const [cds,setCds]=useState('bo');
 
  //Expiration time: date start and date end
  const [dateStart,setDateStart]=useState("dd/mm/yyyy");
  const [dateEnd,setDateEnd]=useState("dd/mm/yyyy");
  
         
  //HANDLER SUBMIT
  function handleSubmit(event) 
  {
    event.preventDefault();

    if(invioForm==true)
    {
       
        setInvioForm(false); // Istruzioni provvisori aggiunte perchè quando si preme su add del campo di testo 
                             // co supervisors venive anche inviato il form
                             // soluzione provvisoria, da correggere meglio

       ////////controllo input ////////////////////////
       let corretto=true;

       if( (title=='')||(description=='')||(required_knowledge=='')||(supervisor=='')
            ||(notes=='')||(dateStart=="dd/mm/yyyy")||(dateEnd=="dd/mm/yyyy")
            ||(type=='')||(level=='')||(groups=='')||(cds=='') 
            || (co_supervisors.length==0)   || (keywords.length==0) ) 
       {
           setOpenError(true);
           setErrorMess("ATTENTION: FIELD EMPTY");
           corretto=false;
       }

       if(((isValidDate(dateStart)==false)||(isValidDate(dateEnd)==false))&&(corretto==true))
       {
          setOpenError(true);
          setErrorMess("ATTENTION: FORMAT DD/MM/YYYY")
          corretto=false;
       }

         ////////SE INPUT CORRETTO //////////////////////////////////
         if(corretto==true)
         {
              const new_proposal={
                  title: title,
                  description: description,
                  required_knowledge: required_knowledge,
                  supervisor: supervisor,
                  notes: notes,
                  keywords: keywords,
                  date_start: dateStart,
                  date_end: dateEnd,
                  type: type,
                  level: level,
                  groups: groups,
                  cds: cds,
                  co_supervisors: co_supervisors
              }
            console.log("NEW PROPOSAL");
            console.log(new_proposal);

            setSuccessSubmit(true)

            // API CHE AGGIUNGE LA NUOVA PROPOSTA DI TESI

         }
         

    }
  
   }   
   
   const [openError, setOpenError] = useState(false);
   const [openSuccessSubmit, setSuccessSubmit] = useState(false);
   const [errorMess, setErrorMess] = useState('');
   


   //  CO-SUPERVISORS /////////////////////////////////
   const [inputCoSup, setInputCoSup] = useState('');
   const [co_supervisors, setCo_supervisors] = useState([]);
 
   const handleInputCoSup = (event) => {
     setInputCoSup(event.target.value);
   };
 
   const handleAddCoSup = () => {
     if (inputCoSup.trim() !== '') {
       setCo_supervisors([...co_supervisors, inputCoSup]);
     }
   };
 
    //  KEYWORDS /////////////////////////////////
    const [inputKeywords, setInputKeywords] = useState('');
    const [keywords, setKeywords] = useState([]);

    const handleInputKeywords = (event) => {
    setInputKeywords(event.target.value);
    };

    const handleAddkeywords = () => {
        if (inputKeywords.trim() !== '') {
            setKeywords([...keywords, inputKeywords]);
        }
    };


   const [invioForm,setInvioForm]=useState(false);


   return (
    <>
      
    <br /> <br /><br /><br /> <br /> <br />

    <Typography variant="h5"> INSERT A NEW PROPOSAL OF THESIS   </Typography>
    
    {openError? <Alert severity="warning" onClose={()=>setOpenError(false)}> <AlertTitle> {errorMess} </AlertTitle> </Alert> : false}

    {openSuccessSubmit? <Alert severity="success" onClose={()=>setSuccessSubmit(false)}> <AlertTitle> PROPOSAL SUBMIT WITH SUCCESS </AlertTitle> </Alert> : false}

    <br /> <br />

    <form onSubmit={handleSubmit}>
    <Grid container spacing={2}>
        <Grid item xs={6}>
 
          <TextField label="Title" name="title" variant="filled" fullWidth
          value={title}  onChange={ev=>setTitle(ev.target.value)}/>  <br /> <br /> 

          <TextField label="Description" name="description" variant="outlined"  fullWidth
          value={description}  onChange={ev=>setDescription(ev.target.value)}/>  <br />  <br />      
        
           <TextField label="Required Knowledge" name="required_knowledge" variant="filled" fullWidth 
          value={required_knowledge}  onChange={ev=>setRequired_knowledge(ev.target.value)}/>  <br /> <br />

           <TextField label="Supervisor" name="supervisor" variant="outlined"  fullWidth
           value={supervisor}  onChange={ev=>setSupervisor(ev.target.value)}/>  <br /> <br />

           <TextField label="Notes" name="notes" variant="filled" fullWidth
           value={notes}  onChange={ev=>setNotes(ev.target.value)}/>  <br /> <br />

           
           <TextField label="Add Co-Supervisors" variant="outlined" fullWidth
            value={inputCoSup} onChange={handleInputCoSup} /> <button onClick={handleAddCoSup}>Add</button>
      
            <ul> {co_supervisors.map((value, index) => ( <li key={index}> Co-supervisor: {value}</li> ))} </ul>


        </Grid>

        <Grid item xs={6}>

        <TextField label="Cds" name="cds" variant="filled" fullWidth
        value={cds}  onChange={ev=>setCds(ev.target.value)}/>  <br />  <br /> 

        <Box display="flex" >

          <TextField label="From ... (dd/mm/yyyy)" value={dateStart}
           onChange={ev=>setDateStart(ev.target.value)} 
           InputLabelProps={{ shrink: true, }} />

          <TextField label="To ... (dd/mm/yyyy)"  value={dateEnd}
           onChange={ev=>setDateEnd(ev.target.value)} 
           InputLabelProps={{ shrink: true, }} />

        </Box> <br />  

       <TextField label="Type" name="type" variant="filled"  fullWidth
        value={type}  onChange={ev=>setType(ev.target.value)}/>  <br /> <br />

       <TextField label="Level" name="level" variant="outlined"  fullWidth 
        value={level}  onChange={ev=>setLevel(ev.target.value)}/>  <br /> <br />

       <TextField label="Groups" name="groups" variant="filled"  fullWidth
        value={groups}  onChange={ev=>setGroups(ev.target.value)}/>  <br /> <br />

    
       <TextField label="Add Keywords" variant="outlined" fullWidth
         value={inputKeywords} onChange={handleInputKeywords} /> <button onClick={handleAddkeywords}>Add</button>
      
       <ul> {keywords.map((value, index) => ( <li key={index}> Keyword: {value} </li> ))} </ul>



       </Grid>
    </Grid>
    <br />

        <Button variant="contained" color="primary" type="submit" onClick={()=>setInvioForm(true)}> ADD PROPOSAL </Button>
        <Button variant="contained" color="error" onClick={()=>navigate('/teacher')}> CANCEL </Button>
      
      </form>
   
      </>
      
  );

}


export default AddProposalTeacher;