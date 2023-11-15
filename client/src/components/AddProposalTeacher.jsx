import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Typography from '@mui/material/Typography';
import { UserContext } from '../Contexts';
import { FormControl, InputLabel, Select, MenuItem, Input } from '@mui/material';
import proposalAPI from '../services/proposals.api';
import API_Degrees from '../services/degrees.api';
import API_Keywords from '../services/keywords.api';
import API_Teachers from '../services/teachers.api';
import Button from '@mui/material/Button';

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

function formatDate(inputDate) {
  // Divide la stringa della data in giorno, mese e anno
  var parts = inputDate.split('/');
  if (parts.length !== 3) {
    // La stringa della data non è nel formato corretto
    return null;
  }

  // Estrai giorno, mese e anno
  var day = parts[0];
  var month = parts[1];
  var year = parts[2];

  // Formatta la data nel formato "yyyy-mm-dd"
  var formattedDate = year + '-' + month + '-' + day;

  return formattedDate;
}



function AddProposalTeacher(props)
{
  const navigate= useNavigate();

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

  const { user } = useContext(UserContext);
  const [teachersList, SetTeachersList]=useState('');
  const [degreesList, SetDegreesList]=useState('');
  const [selectedDegree, setSelectedDegree] = useState('');
  const [selectedSupervisor, setSelectedSupervisor] = useState('');
  const [keywordsList, SetKeywordsList]=useState(''); //prese dal DB


  // USE EFFECT /////////////////////////////////////////////

  useEffect(()=>{
    API_Degrees.getAllDegrees()
    .then((d) => SetDegreesList(d))
    .catch((err) => handleError(err));

    API_Teachers.getAllTeachers()
    .then((t) => SetTeachersList(t))
    .catch((err) => handleError(err));

    API_Keywords.getAllKeywords()
    .then((k) => SetKeywordsList(k))
    .catch((err) => handleError(err));

  },[])

  ///////////////////////////////////////////////////////////



  //Proposal Fields (By Slide 8)

  //ID TEACHER FALSO, VERRA PRESO DAL COOKIE DI SESSIONE DOPO L'ACCESSO
  
  const [title,setTitle]=useState('Tesi sui processori');
  const [description,setDescription]=useState('description');
  const [required_knowledge,setRequired_knowledge]=useState('esame di architetture');
  const [notes,setNotes]=useState('blabla');
  const [type,setType]=useState('tipo');
  const [level,setLevel]=useState(1);
  const [expiration_date,setExpirationDate]=useState("08/11/2023");
  
       
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


       //metti condizione lunghezza co supervisors scelte == 0
       if( (title=='')||(description=='')||(required_knowledge=='')||(selectedSupervisor=='')
            ||(notes=='')||(expiration_date=="dd/mm/yyyy")
            ||(type=='')||(level=='')||(selectedDegree=='') 
            || (selectedKeywords.length==0) || ( selectedCoSup.length==0) ) 
       {
           setOpenError(true);
           setErrorMess("ATTENTION: FIELD EMPTY");
           corretto=false;
       }

       if(((isValidDate(expiration_date)==false))&&(corretto==true))
       {
          setOpenError(true);
          setErrorMess("ATTENTION: FORMAT DD/MM/YYYY")
          corretto=false;
       }

         ////////SE INPUT CORRETTO //////////////////////////////////
         if(corretto==true)
         {

          let formatted_expiration = formatDate(expiration_date);

              let nuovo_oggetto=
              {
                  title:   title,
                  description: description,
                  required_knowledge: required_knowledge,
                  supervisor_id: selectedSupervisor.teacher_id, 
                  co_supervisors:  selectedCoSup,
                  notes: notes,
                  keywords: selectedKeywords,          //contiene solo name
                  expiration_date: formatted_expiration,
                  type: type,
                  level: level,
                  cod_group: user.cod_group,  
                  cod_degree: selectedDegree.cod_degree,
              }
            
            
            //POST PROPOSAL
            let list_cod_degree=[nuovo_oggetto.cod_degree];
            let supervisors_obj={"supervisor_id":  nuovo_oggetto.supervisor_id, 
             "co_supervisors":  nuovo_oggetto.co_supervisors};

            proposalAPI.postProposal
            ( 
                nuovo_oggetto.title, nuovo_oggetto.type, nuovo_oggetto.description,
                nuovo_oggetto.level, nuovo_oggetto.expiration_date, nuovo_oggetto.notes,
                nuovo_oggetto.required_knowledge,  list_cod_degree, nuovo_oggetto.cod_group,
                supervisors_obj, nuovo_oggetto.keywords
            )
            .then(()=> setSuccessSubmit(true))
            .catch(err=>handleError(err));  
              
              
         }
         

    }
  
   }   
   
   const [openError, setOpenError] = useState(false);
   const [openSuccessSubmit, setSuccessSubmit] = useState(false);
   const [errorMess, setErrorMess] = useState('');
   
 
    //KEYWORDS A TENDINA
  const [selectedKeywords, setSelectedKeywords] = useState([]);
     
  //CO SUPERVISORS A TENDINA
  const [selectedCoSup, setSelectedCoSup] = useState([]);

  const [invioForm,setInvioForm]=useState(false);

   return (
    <>
      
    <br /> <br /><br /><br /> <br /> <br />

    <Typography variant="h5"> INSERT A NEW PROPOSAL OF THESIS      </Typography>
    <Typography variant="h7"> GROUP NAME    : {user?.group_name}   </Typography> <br />
    <Typography variant="h7"> COD DEPARTMENT: {user?.cod_department}         </Typography>
    
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


        <FormControl fullWidth>
            <InputLabel id="supervisor-label"> Select a Supervisor</InputLabel>
            < Select 
                labelId="word-label" 
                id="supervisor-select" 
                value={selectedSupervisor}   
                onChange={(event) => {setSelectedSupervisor(event.target.value); }}
            >
              {   
                  Array.from(teachersList).map((teacher, index) => 
                (<MenuItem key={index} value={teacher}> {teacher.email} </MenuItem> ))
              }
            </Select>
      </FormControl> 
          <br />  <br /> 


           <TextField label="Notes" name="notes" variant="filled" fullWidth
           value={notes}  onChange={ev=>setNotes(ev.target.value)}/>  <br /> <br />

           <FormControl fullWidth>
              <InputLabel id="cosup-label">Select Co - Supervisors</InputLabel>
              <Select
                labelId="cosup-label"
                id="cosup-select"
                multiple
                value={selectedCoSup}
                onChange={(event) => {setSelectedCoSup(event.target.value)}}
                input={<Input id="select-multiple" />}
              >
                {Array.from(teachersList).map((teacher, index) => (
                  <MenuItem key={index} value={teacher.teacher_id}>
                    {teacher.email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

          
          
           <br />  <br /> 

  
        </Grid>

        <Grid item xs={6}>

        <FormControl fullWidth>
        <InputLabel id="degree-label"> Select a Degree</InputLabel>
        < Select 
            labelId="word-label" 
            id="degree-select" 
            value={selectedDegree}   
            onChange={(event) => {setSelectedDegree(event.target.value); }}
        >
          {   
              Array.from(degreesList).map((degree, index) => 
             (<MenuItem key={index} value={degree}> {degree.title_degree} </MenuItem> ))
          }
        </Select>
      </FormControl>  <br />  <br /> 
        
        
        <TextField label="Expiration Date  (dd/mm/yyyy)" value={expiration_date}  fullWidth
          onChange={ev=>setExpirationDate(ev.target.value)} 
          InputLabelProps={{ shrink: true, }} /> <br />  <br /> 


       <TextField label="Type" name="type" variant="filled"  fullWidth
        value={type}  onChange={ev=>setType(ev.target.value)}/>  <br /> <br />

       <TextField label="Level" name="level" variant="outlined"  fullWidth 
        value={level}  onChange={ev=>setLevel(ev.target.value)}/>  <br /> <br />

    
      <FormControl fullWidth>
        <InputLabel id="keywords-label">Select keywords</InputLabel>
        <Select
          labelId="keywords-label"
          id="keywords-select"
          multiple
          value={selectedKeywords}
          onChange={(event) => {setSelectedKeywords(event.target.value)}}
          input={<Input id="select-multiple" />}
        >
          {Array.from(keywordsList).map((k, index) => (
            <MenuItem key={index} value={k.name}>
              {k.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>



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