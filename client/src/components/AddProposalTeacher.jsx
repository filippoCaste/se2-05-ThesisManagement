import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Typography from '@mui/material/Typography';
import { UserContext } from '../Contexts';
import { FormControl, InputLabel, Select, MenuItem, Input, Container, IconButton,  Paper } from '@mui/material';
import {  useParams } from 'react-router-dom';


import proposalAPI from '../services/proposals.api';
import API_Degrees from '../services/degrees.api';
import API_Keywords from '../services/keywords.api';
import API_Teachers from '../services/teachers.api';

import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';


import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Box from '@mui/material/Box';


import dayjs from 'dayjs' ;
import customParseFormat from 'dayjs/plugin/customParseFormat';


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
  const { proposalId } = useParams();
  let proposalToModify;

  const navigate= useNavigate();
  dayjs.extend(customParseFormat);

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

  const [title,setTitle]=useState('');
  const [description,setDescription]=useState('');
  const [required_knowledge,setRequired_knowledge]=useState('');
  const [notes,setNotes]=useState('');
  const [type,setType]=useState('');
  const [level,setLevel]=useState('');
  const [expiration_date,setExpirationDate]=useState(null);
  

  const { user } = useContext(UserContext);
  const [teachersList, SetTeachersList]=useState('');
  const [degreesList, SetDegreesList]=useState('');
  const [selectedDegree, setSelectedDegree] = useState('');
  const [selectedSupervisor, setSelectedSupervisor] = useState(user.id);
  const [keywordsList, SetKeywordsList]=useState(''); //prese dal DB


  // USE EFFECT /////////////////////////////////////////////
  useEffect(() => {
    if (proposalId !== undefined) {
      proposalAPI.getProposalsByTeacherId(user.id)
        .then((proposals) => {
          proposalToModify = proposals.find(p => p.id === parseInt(proposalId));
          let grado= degreesList.find(d=>d.cod_degree == proposalToModify.cod_degree);

          console.log("P ",proposalToModify);
   
          setLevel(proposalToModify.level);
          setTitle(proposalToModify.title);
          setDescription(proposalToModify.description);
          setRequired_knowledge(proposalToModify.required_knowledge);
          setNotes(proposalToModify.notes);
          setType(proposalToModify.type);
          setSelectedDegree(grado);
          setExpirationDate(dayjs(proposalToModify.expiration_date)); 
          setSelectedSupervisor(user.id);

          
          let array=[{name:"mario", surname:"rossi", teacher_id:1},
                     {name:"luigi", surname:"bianchi", teacher_id:2},
                    ]
          const coSupList = array.map((coSup) => ({
            name: coSup.name,
            surname: coSup.surname,
            teacher_id: coSup.teacher_id,
          }));
          setSelectedCoSupList(coSupList);
  
          let array_2=[{name:"K1"},{name:"K2"},{name:"K3"}];
          const keywordList = array_2.map((keyword) => keyword.name);
          setSelectedKeywordList(keywordList);
        })
        .catch((err) => handleError(err));
    }
  
  }, [proposalId, degreesList]);

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

       
  //HANDLER SUBMIT
  function handleSubmit(event) 
  {
    event.preventDefault();
    if(invioForm==true)
    {

        console.log("proposalId: ",proposalId);
        setInvioForm(false); // Istruzioni provvisori aggiunte perchè quando si preme su add del campo di testo 
                             // co supervisors venive anche inviato il form
                             // soluzione provvisoria, da correggere meglio

       ////////controllo input ////////////////////////
       let corretto= true;
  
       let campi_vuoti=' ';

       if(title=='') { campi_vuoti=campi_vuoti + " TITLE , "; corretto= false; }
       if(description=='') {campi_vuoti=campi_vuoti + " DESCRIPTION , "; corretto= false; }
       if(required_knowledge=='') { campi_vuoti=campi_vuoti + " REQUIRED KNOWLEDGE , "; corretto= false; }
       if(type=='') { campi_vuoti=campi_vuoti + " TYPE , "; corretto= false; }
       if(level=='') { campi_vuoti=campi_vuoti + " LEVEL , "; corretto= false; }
       if(selectedDegree=='') {campi_vuoti=campi_vuoti + " DEGREE , "; corretto= false; }
       if(selectedCoSupList.length==0) { campi_vuoti=campi_vuoti + " CO-SUPERVISORS , "; corretto= false; }
       if(selectedKeywordList.length==0) { campi_vuoti=campi_vuoti + " KEYWORDS , "; corretto= false; }
       if((expiration_date==null)) { campi_vuoti=campi_vuoti + " EXPIRATION DATE , "; corretto= false; }
       

       //messaggio errore campi vuoti
       if(corretto == false) 
       {
           setOpenError(true);
           setErrorMess("ATTENTION: "+campi_vuoti+" EMPTY ");
           corretto=false;
       }
       
         ////////SE INPUT CORRETTO //////////////////////////////////
         if(corretto==true)
         {

          let formatted_expiration = expiration_date.format("YYYY-MM-DD");
          
          let listaCoSup= selectedCoSupList.map(co=>co.teacher_id);

              let nuovo_oggetto=
              {
                  title:   title,
                  description: description,
                  required_knowledge: required_knowledge,
                  supervisor_id: selectedSupervisor, 
                  co_supervisors:  listaCoSup,
                  notes: notes,
                  keywords: selectedKeywordList,          
                  expiration_date: formatted_expiration,
                  type: type,
                  level: level,
                  cod_group: user.cod_group,  
                  cod_degree: selectedDegree.cod_degree,
              }


            let list_cod_degree=[nuovo_oggetto.cod_degree];

            let supervisors_obj={"supervisor_id":  nuovo_oggetto.supervisor_id, 
            "co_supervisors":  nuovo_oggetto.co_supervisors};

            //POST PROPOSAL
            if(proposalId == undefined)
            {
                console.log(nuovo_oggetto);
                setSuccessSubmit(true);
          
                proposalAPI.postProposal(nuovo_oggetto.title,nuovo_oggetto.type, nuovo_oggetto.description,
                  nuovo_oggetto.level, nuovo_oggetto.expiration_date, nuovo_oggetto.notes,
                  nuovo_oggetto.required_knowledge, list_cod_degree, nuovo_oggetto.cod_group,
                  supervisors_obj, nuovo_oggetto.keywords)
                .then()
                .catch(err=>handleError(err));  

                navigate('/teacher');
                
            }
            else
            {
                //UPDATE PROPOSAL
                console.log("UPDATE");
                
                proposalAPI.updateProposal(proposalId, nuovo_oggetto.title, nuovo_oggetto.type,
                  nuovo_oggetto.description, nuovo_oggetto.level, nuovo_oggetto.expiration_date,
                  nuovo_oggetto.notes, nuovo_oggetto.required_knowledge, list_cod_degree,
                  nuovo_oggetto.cod_group, supervisors_obj, nuovo_oggetto.keywords)
                .then(()=> setSuccessSubmit(true))
                .catch(err=>handleError(err));  

            }
                 
        
         }
         

      }
    
   }   
   
   const [openError, setOpenError] = useState(false);
   const [openSuccessSubmit, setSuccessSubmit] = useState(false);
   const [errorMess, setErrorMess] = useState('');
   
    
  //CO SUPERVISORS A TENDINA
  const [selectedCoSup, setSelectedCoSup] = useState('');
  const [selectedCoSupList, setSelectedCoSupList] = useState([]);

  const handleAddClickCoSupervisor = () => {
      if(selectedCoSup != '')
      {
        if (selectedCoSup && !selectedCoSupList.includes(selectedCoSup)) 
        {
          setSelectedCoSupList([...selectedCoSupList, selectedCoSup]);
        }
      }
  };

  const handleRemoveClickCoSupervisor = (indexToRemove) => {
    const updatedCoSupList = selectedCoSupList.filter(
      (_, index) => index !== indexToRemove
    );
    setSelectedCoSupList(updatedCoSupList);
  };

  //KEWWORDS A TENDINA
  const [newKeyword, setNewKeyword] = useState('');
  
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [selectedKeywordList, setSelectedKeywordList] = useState([]);

  const handleAddClickKeyword = () => {
    if (selectedKeyword !== '') {
      if (!selectedKeywordList.includes(selectedKeyword)) {
        setSelectedKeywordList([...selectedKeywordList, selectedKeyword]);
      }
    } else if (newKeyword !== '') {
      // Aggiunge la nuova keyword
      setSelectedKeywordList([...selectedKeywordList, newKeyword]);
      setNewKeyword(''); // Pulisce l'input della nuova keyword dopo l'aggiunta
    }
  }

  const handleRemoveClickKeyword = (indexToRemove) => {
    const updatedKeywordList = selectedKeywordList.filter(
      (_, index) => index !== indexToRemove
    );
    setSelectedKeywordList(updatedKeywordList);
  };

  //INVIO FORM
  const [invioForm,setInvioForm]=useState(false);


   return (
    <Container>
      
    <br /> <br /><br /><br /> <br /> <br />

    {proposalId? 
       <> <Typography variant="h5" align="center"> EDIT THE THESIS  {proposalId} </Typography> <br /></>
       :   
       <><Typography variant="h5" align="center"> INSERT A NEW PROPOSAL OF THESIS      </Typography> <br /></>
     }

    <Typography variant="h7"> TEACHER: {user.name} {user.surname} </Typography> <br />
    <Typography variant="h7"> ID: {user.id} </Typography> <br /> <br />
    
    <Typography variant="h7"> GROUP NAME    : {user?.group_name}   </Typography> <br />
    <Typography variant="h7"> COD DEPARTMENT: {user?.cod_department}         </Typography>


    
    {openError? <Alert severity="warning" onClose={()=>setOpenError(false)}> <AlertTitle> {errorMess} </AlertTitle> </Alert> : false}

    {openSuccessSubmit==true? <Alert severity="success" onClose={()=>setSuccessSubmit(false)}> <AlertTitle> PROPOSAL SUBMIT WITH SUCCESS </AlertTitle> </Alert> : false}

    <br /> <br />

    <form onSubmit={handleSubmit}>

             
        <Typography variant="subtitle1" fontWeight="bold">   TITLE </Typography>
          <TextField  name="title" variant="filled" fullWidth
          value={title}  onChange={ev=>setTitle(ev.target.value)}/>  <br /> <br /> 

        <Typography variant="subtitle2" fontWeight="bold"> DESCRIPTION </Typography>
        <TextField  name="description" variant="outlined"  fullWidth  multiline
           rows={7} value={description}  onChange={ev=>setDescription(ev.target.value)}   />  <br />  <br /> 

          <Grid container spacing={2}> 
              <Grid item xs={4}>
                <FormControl fullWidth>  
                <Typography variant="subtitle1" fontWeight="bold">  SUPERVISORD ID  </Typography>
                  <TextField name="supervisor" variant="outlined" fullWidth
                  value={selectedSupervisor}  onChange={ev=>setSelectedSupervisor(ev.target.value)} disabled /> 
                </FormControl> 
              </Grid>

              <Grid item xs={4}>
                  <FormControl fullWidth>
                  <Typography variant="subtitle1" fontWeight="bold">  SELECT A DEGREE LEVEL </Typography>
                    < Select
                      labelId="word-label"
                      id="level-select"
                      value={level} 
                      onChange={(ev) => { setLevel(ev.target.value) }}
                    >
                      {
                        Array.from(["MSc", "BSc"]).map((el, index) =>
                        (el === "MSc" ? <MenuItem key={index} value={"MSc"}>Master of Science</MenuItem> 
                                      : <MenuItem key={index} value={"BSc"}>Bachelor of Science</MenuItem>))
                      }
                    </Select>
                  </FormControl> 
              </Grid>

              <Grid item xs={4}>
                <FormControl fullWidth disabled={level===''}>
                <Typography variant="subtitle1" fontWeight="bold">  SELECT A DEGREE </Typography>     
                < Select 
                    labelId="word-label" 
                    id="degree-select" 
                    value={selectedDegree}   
                    onChange={(event) => {setSelectedDegree(event.target.value); }}
                >
                  {   
                      Array.from(degreesList).filter(d=>d.level_degree == level).map((degree, index) => 
                    (<MenuItem key={index} value={degree}> {degree.title_degree} </MenuItem> ))
                  }
                </Select>
              </FormControl>   
              </Grid> 
            </Grid> <br/>    

            <Grid container spacing={2}> 
              <Grid item xs={6}>
                  <Typography variant="subtitle1" fontWeight="bold"> TYPE </Typography>     
                  <TextField  name="type" variant="filled"  fullWidth
                  value={type}  onChange={ev=>setType(ev.target.value)}/>  <br /> <br />
              </Grid>

              <Grid item xs={6}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Typography variant="subtitle1" fontWeight="bold"> EXPIRATION DATE </Typography>
                  <DatePicker
                    format="DD/MM/YYYY"
                    value={expiration_date}
                    onChange={(newDate) => { setExpirationDate(newDate); }}
                    minDate={dayjs()}
                  />
                </LocalizationProvider>
                </FormControl> 
              </Grid>
          </Grid>  

          <Typography variant="subtitle5" fontWeight="bold"> REQUIRED KNOWLEDGE </Typography>
          <TextField  name="required_knowledge" variant="filled" fullWidth multiline  rows={7}
          value={required_knowledge}  onChange={ev=>setRequired_knowledge(ev.target.value)}/>  <br /> <br />
       
      <br />  <br /> 

      <Grid item xs={4}>
      <Paper elevation={3} style={{ padding: '16px' }}>
        <FormControl fullWidth>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            SELECT CO-SUPERVISORS
          </Typography>
          <Select
            labelId="cosup-label"
            id="cosup-select"
            value={selectedCoSup}
            onChange={(event) => setSelectedCoSup(event.target.value)}
            input={<Input id="select-multiple" />}
          >
            {Array.from(teachersList).filter(t => t.teacher_id != user.id).map((teacher, index) => (
              <MenuItem key={index} value={teacher}>
                {teacher.name} {teacher.surname} - {teacher.teacher_id}
              </MenuItem>
            ))}
          </Select>

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddClickCoSupervisor}
            style={{ marginTop: '16px' }}
          >
            ADD
          </Button>

          {/* Visualizza i co-supervisori selezionati */}
          <Typography variant="h6" style={{ marginTop: '16px' }}>
            Selected Co-Supervisors
          </Typography>
          {selectedCoSupList.map((coSupervisor, index) => (
            <Paper key={index} elevation={1} style={{ padding: '8px', marginTop: '8px' }}>
              <Grid container alignItems="center">
                <Grid item xs={10}>
                  <Typography variant="body1">{coSupervisor.name} {coSupervisor.surname} - {coSupervisor.teacher_id}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <IconButton
                    color="primary"
                    aria-label="delete"
                    onClick={() => handleRemoveClickCoSupervisor(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </FormControl>
      </Paper>
    </Grid> <br/> <br/>

    <Grid item xs={4}>
      <Paper elevation={3} style={{ padding: '16px' }}>
        <FormControl fullWidth>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            SELECT KEYWORDS
          </Typography>
          <Select
            labelId="keyword-label"
            id="cosup-select"
            value={selectedKeyword}
            onChange={(event) => setSelectedKeyword(event.target.value)}
            input={<Input id="select-multiple" />}
          >
           {Array.from(keywordsList).map((k, index) => (
            <MenuItem key={index} value={k.name}>
              {k.name}
            </MenuItem>
          ))}
          </Select>

          {/* Input per una nuova keyword */}
          <TextField
            label="New Keyword"
            variant="outlined"
            fullWidth
            value={newKeyword}
            onChange={(event) => setNewKeyword(event.target.value)}
            style={{ marginTop: '16px' }}
          />

          {/* Pulsante per aggiungere la nuova keyword o selezionare quella esistente */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddClickKeyword}
            style={{ marginTop: '16px' }}
          >
            ADD
          </Button>

          {/* Visualizza i co-supervisori selezionati */}
          <Typography variant="h6" style={{ marginTop: '16px' }}>
            Selected Keywords
          </Typography>
          {selectedKeywordList.map((keyword, index) => (
            <Paper key={index} elevation={1} style={{ padding: '8px', marginTop: '8px' }}>
              <Grid container alignItems="center">
                <Grid item xs={10}>
                  <Typography variant="body1">{keyword}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <IconButton
                    color="primary"
                    aria-label="delete"
                    onClick={() => handleRemoveClickKeyword(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </FormControl>
      </Paper>
    </Grid>   <br/> <br/>

    <Typography variant="subtitle5" fontWeight="bold"> NOTES </Typography>
           <TextField  name="notes" variant="filled" fullWidth  multiline  rows={5}
           value={notes}  onChange={ev=>setNotes(ev.target.value)}/>  <br /> <br />
 

    <br />

      {proposalId?   
        <Button variant="contained" color="primary" type="submit" onClick={()=>setInvioForm(true)}> UPDATE PROPOSAL </Button>         
        :
        <Button variant="contained" color="primary" type="submit" onClick={()=>setInvioForm(true)}> ADD PROPOSAL </Button> 
      }

        {' '} <Button variant="contained" color="error" onClick={()=>navigate('/teacher')}> CANCEL </Button>
      
      </form>
   
      </Container>
      
  );

}


export default AddProposalTeacher;